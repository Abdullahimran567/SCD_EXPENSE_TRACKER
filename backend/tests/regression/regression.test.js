import request from "supertest";
import app from "../../src/app.js";
import { resetTestDb } from "../setup.js";
import { prisma } from "../../src/config/db.js";

describe("ExpenseMate Regression Characterization Tests", () => {
	beforeEach(async () => {
		await resetTestDb();
	});

	afterAll(async () => {
		await resetTestDb();
		await prisma.$disconnect();
	});

	describe("1. Auth: Signup, Login, Logout", () => {
		it("registers a new user and sets HttpOnly cookie", async () => {
			const res = await request(app)
				.post("/auth/signup")
				.send({
					name: "Alice",
					email: "alice@example.com",
					password: "password123",
				});

			expect(res.status).toBe(201);
			expect(res.body.success).toBe(true);
			expect(res.body.user).toHaveProperty("id");
			expect(res.body.user.name).toBe("Alice");
			expect(res.body.user.email).toBe("alice@example.com");

			const cookies = res.headers["set-cookie"];
			expect(cookies).toBeDefined();
			const tokenCookie = cookies.find((c) => c.startsWith("token="));
			expect(tokenCookie).toBeDefined();
			expect(tokenCookie.toLowerCase()).toContain("httponly");
		});

		it("logs in with valid credentials, sets HttpOnly cookie, and gets /me", async () => {
			await request(app)
				.post("/auth/signup")
				.send({
					name: "Alice",
					email: "alice@example.com",
					password: "password123",
				});

			const loginRes = await request(app)
				.post("/auth/login")
				.send({
					email: "alice@example.com",
					password: "password123",
				});

			expect(loginRes.status).toBe(200);
			expect(loginRes.body.success).toBe(true);
			expect(loginRes.body.user.name).toBe("Alice");

			const cookies = loginRes.headers["set-cookie"];
			expect(cookies).toBeDefined();
			const tokenCookie = cookies.find((c) => c.startsWith("token="));
			expect(tokenCookie).toBeDefined();
			expect(tokenCookie.toLowerCase()).toContain("httponly");

			// Test /auth/me with cookie
			const meRes = await request(app)
				.get("/auth/me")
				.set("Cookie", tokenCookie);

			expect(meRes.status).toBe(200);
			expect(meRes.body.success).toBe(true);
			expect(meRes.body.user.email).toBe("alice@example.com");
		});

		it("clears token cookie on logout", async () => {
			const res = await request(app).post("/auth/logout");
			expect(res.status).toBe(200);
			expect(res.body.success).toBe(true);

			const cookies = res.headers["set-cookie"];
			expect(cookies).toBeDefined();
			const tokenCookie = cookies.find((c) => c.startsWith("token="));
			expect(tokenCookie).toBeDefined();
		});
	});

	describe("2. Categories: List, Create, Duplicate", () => {
		let aliceCookie;

		beforeEach(async () => {
			const res = await request(app)
				.post("/auth/signup")
				.send({
					name: "Alice",
					email: "alice@example.com",
					password: "password123",
				});
			aliceCookie = res.headers["set-cookie"].find((c) => c.startsWith("token="));
		});

		it("lists default categories when none created yet", async () => {
			const res = await request(app)
				.get("/categories")
				.set("Cookie", aliceCookie);

			expect(res.status).toBe(200);
			expect(res.body.success).toBe(true);
			expect(Array.isArray(res.body.categories)).toBe(true);
			expect(res.body.categories.length).toBeGreaterThanOrEqual(7);
		});

		it("creates a new custom category", async () => {
			const res = await request(app)
				.post("/categories")
				.set("Cookie", aliceCookie)
				.send({
					name: "Freelance",
					type: "INCOME",
				});

			expect(res.status).toBe(201);
			expect(res.body.success).toBe(true);
			expect(res.body.category.name).toBe("Freelance");
			expect(res.body.category.type).toBe("INCOME");
			expect(res.body.category).toHaveProperty("id");
		});

		it("handles duplicate category creation returning 200 and existing category", async () => {
			await request(app)
				.post("/categories")
				.set("Cookie", aliceCookie)
				.send({
					name: "Freelance",
					type: "INCOME",
				});

			const dupRes = await request(app)
				.post("/categories")
				.set("Cookie", aliceCookie)
				.send({
					name: "Freelance",
					type: "INCOME",
				});

			expect(dupRes.status).toBe(200);
			expect(dupRes.body.success).toBe(true);
			expect(dupRes.body.message).toBe("Category already exists");
			expect(dupRes.body.category.name).toBe("Freelance");
		});
	});

	describe("3. Transactions: Create, List (pagination), Partial Update, Delete", () => {
		let aliceCookie;

		beforeEach(async () => {
			const res = await request(app)
				.post("/auth/signup")
				.send({
					name: "Alice",
					email: "alice@example.com",
					password: "password123",
				});
			aliceCookie = res.headers["set-cookie"].find((c) => c.startsWith("token="));
		});

		it("creates a transaction and retrieves it in paginated list", async () => {
			const createRes = await request(app)
				.post("/transactions")
				.set("Cookie", aliceCookie)
				.send({
					title: "Grocery Shopping",
					amount: 150.5,
					type: "EXPENSE",
					categoryName: "Food",
					date: "2026-03-15T12:00:00.000Z",
				});

			expect(createRes.status).toBe(201);
			expect(createRes.body.success).toBe(true);
			expect(createRes.body.transaction).toHaveProperty("id");
			const txId = createRes.body.transaction.id;

			const listRes = await request(app)
				.get("/transactions?page=1&limit=10")
				.set("Cookie", aliceCookie);

			expect(listRes.status).toBe(200);
			expect(listRes.body.success).toBe(true);
			expect(listRes.body.total).toBe(1);
			expect(listRes.body.transactions.length).toBe(1);
			expect(listRes.body.transactions[0].id).toEqual(txId);
		});

		it("partially updates a transaction", async () => {
			const createRes = await request(app)
				.post("/transactions")
				.set("Cookie", aliceCookie)
				.send({
					title: "Old Title",
					amount: 50,
					type: "EXPENSE",
					categoryName: "Bills",
				});
			const txId = createRes.body.transaction.id;

			const updateRes = await request(app)
				.put(`/transactions/${txId}`)
				.set("Cookie", aliceCookie)
				.send({
					title: "Updated Title",
				});

			expect(updateRes.status).toBe(200);
			expect(updateRes.body.success).toBe(true);
			expect(updateRes.body.transaction.title).toBe("Updated Title");
			expect(Number(updateRes.body.transaction.amount)).toBe(50);
		});

		it("deletes a transaction", async () => {
			const createRes = await request(app)
				.post("/transactions")
				.set("Cookie", aliceCookie)
				.send({
					title: "To Delete",
					amount: 25,
					type: "EXPENSE",
				});
			const txId = createRes.body.transaction.id;

			const delRes = await request(app)
				.delete(`/transactions/${txId}`)
				.set("Cookie", aliceCookie);

			expect(delRes.status).toBe(200);
			expect(delRes.body.success).toBe(true);

			const listRes = await request(app)
				.get("/transactions")
				.set("Cookie", aliceCookie);
			expect(listRes.body.total).toBe(0);
		});
	});

	describe("4. Ownership Isolation Between Two Users", () => {
		let aliceCookie;
		let bobCookie;
		let aliceTxId;

		beforeEach(async () => {
			const aRes = await request(app)
				.post("/auth/signup")
				.send({ name: "Alice", email: "alice@example.com", password: "password123" });
			aliceCookie = aRes.headers["set-cookie"].find((c) => c.startsWith("token="));

			const bRes = await request(app)
				.post("/auth/signup")
				.send({ name: "Bob", email: "bob@example.com", password: "password123" });
			bobCookie = bRes.headers["set-cookie"].find((c) => c.startsWith("token="));

			const txRes = await request(app)
				.post("/transactions")
				.set("Cookie", aliceCookie)
				.send({ title: "Alice Private Tx", amount: 100, type: "EXPENSE" });
			aliceTxId = txRes.body.transaction.id;
		});

		it("prevents Bob from viewing Alice's transactions in list", async () => {
			const res = await request(app)
				.get("/transactions")
				.set("Cookie", bobCookie);

			expect(res.status).toBe(200);
			expect(res.body.total).toBe(0);
			expect(res.body.transactions.length).toBe(0);
		});

		it("prevents Bob from updating Alice's transaction", async () => {
			const res = await request(app)
				.put(`/transactions/${aliceTxId}`)
				.set("Cookie", bobCookie)
				.send({ title: "Hacked by Bob" });

			expect(res.status).toBe(404);
			expect(res.body.success).toBe(false);
			expect(res.body.message).toBe("Transaction not found");
		});

		it("prevents Bob from deleting Alice's transaction", async () => {
			const res = await request(app)
				.delete(`/transactions/${aliceTxId}`)
				.set("Cookie", bobCookie);

			expect(res.status).toBe(404);
			expect(res.body.success).toBe(false);
			expect(res.body.message).toBe("Transaction not found");
		});
	});

	describe("5. Budget: Set and Upsert", () => {
		let aliceCookie;

		beforeEach(async () => {
			const res = await request(app)
				.post("/auth/signup")
				.send({ name: "Alice", email: "alice@example.com", password: "password123" });
			aliceCookie = res.headers["set-cookie"].find((c) => c.startsWith("token="));
		});

		it("sets a new monthly budget and updates it on subsequent call (upsert)", async () => {
			const setRes = await request(app)
				.post("/budget")
				.set("Cookie", aliceCookie)
				.send({
					amount: 2500,
					month: 5,
					year: 2026,
				});

			expect(setRes.status).toBe(200);
			expect(setRes.body.success).toBe(true);
			expect(Number(setRes.body.budget.amount)).toBe(2500);

			const updateRes = await request(app)
				.post("/budget")
				.set("Cookie", aliceCookie)
				.send({
					amount: 3000,
					month: 5,
					year: 2026,
				});

			expect(updateRes.status).toBe(200);
			expect(updateRes.body.success).toBe(true);
			expect(Number(updateRes.body.budget.amount)).toBe(3000);

			const getRes = await request(app)
				.get("/budget?month=5&year=2026")
				.set("Cookie", aliceCookie);

			expect(getRes.status).toBe(200);
			expect(Number(getRes.body.budget.amount)).toBe(3000);
		});
	});

	describe("6. Dashboard Summary", () => {
		let aliceCookie;

		beforeEach(async () => {
			const res = await request(app)
				.post("/auth/signup")
				.send({ name: "Alice", email: "alice@example.com", password: "password123" });
			aliceCookie = res.headers["set-cookie"].find((c) => c.startsWith("token="));
		});

		it("returns accurate dashboard summary structure and 6-month chart data", async () => {
			await request(app)
				.post("/transactions")
				.set("Cookie", aliceCookie)
				.send({
					title: "Monthly Salary",
					amount: 5000,
					type: "INCOME",
					categoryName: "Income",
					date: new Date().toISOString(),
				});

			await request(app)
				.post("/transactions")
				.set("Cookie", aliceCookie)
				.send({
					title: "Groceries",
					amount: 500,
					type: "EXPENSE",
					categoryName: "Food",
					date: new Date().toISOString(),
				});

			const res = await request(app)
				.get("/dashboard/summary")
				.set("Cookie", aliceCookie);

			expect(res.status).toBe(200);
			expect(res.body.success).toBe(true);
			expect(res.body.summary).toHaveProperty("totalBalance");
			expect(res.body.summary.totalBalance).toBe(4500);
			expect(res.body.summary.monthlyIncome).toBe(5000);
			expect(res.body.summary.monthlyExpenses).toBe(500);
			expect(res.body.summary.savings).toBe(4500);
			expect(Array.isArray(res.body.summary.incomeVsExpense)).toBe(true);
			expect(res.body.summary.incomeVsExpense.length).toBe(6);
			expect(Array.isArray(res.body.summary.categoryBreakdown)).toBe(true);
			expect(res.body.summary.hasTransactions).toBe(true);
		});
	});
});
