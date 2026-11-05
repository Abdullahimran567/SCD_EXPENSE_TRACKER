import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const pgUrl =
	process.env.DATABASE_URL ||
	"postgresql://postgres:imran5701@localhost:5432/Expense_Tracker";

const adapter = new PrismaPg({ connectionString: pgUrl });
const prisma = new PrismaClient({ adapter });

async function seed() {
	console.log("Seeding sample data into PostgreSQL...");

	// Clean existing
	await prisma.transaction.deleteMany();
	await prisma.budget.deleteMany();
	await prisma.category.deleteMany();
	await prisma.user.deleteMany();

	const hashedPassword = await bcrypt.hash("password123", 10);

	// User 1
	const user1 = await prisma.user.create({
		data: {
			name: "John Doe",
			email: "john@example.com",
			password: hashedPassword,
		},
	});

	// User 2
	const user2 = await prisma.user.create({
		data: {
			name: "Jane Smith",
			email: "jane@example.com",
			password: hashedPassword,
		},
	});

	// Categories for User 1
	const catFood = await prisma.category.create({
		data: { name: "Food", type: "EXPENSE", user_id: user1.id },
	});
	const catSalary = await prisma.category.create({
		data: { name: "Salary", type: "INCOME", user_id: user1.id },
	});

	// Categories for User 2
	const catRent = await prisma.category.create({
		data: { name: "Rent", type: "EXPENSE", user_id: user2.id },
	});
	const catBonus = await prisma.category.create({
		data: { name: "Bonus", type: "INCOME", user_id: user2.id },
	});

	// Budgets
	await prisma.budget.create({
		data: {
			userId: user1.id,
			month: 11,
			year: 2026,
			amount: 1500.0,
		},
	});

	await prisma.budget.create({
		data: {
			userId: user2.id,
			month: 11,
			year: 2026,
			amount: 2000.0,
		},
	});

	// Transactions for User 1
	await prisma.transaction.create({
		data: {
			title: "Tech Corp Salary",
			amount: 4500.0,
			type: "INCOME",
			category_id: catSalary.id,
			userId: user1.id,
			date: new Date("2026-11-01T10:00:00Z"),
		},
	});
	await prisma.transaction.create({
		data: {
			title: "Supermarket Groceries",
			amount: 175.5,
			type: "EXPENSE",
			category_id: catFood.id,
			userId: user1.id,
			date: new Date("2026-11-02T15:30:00Z"),
		},
	});

	// Transactions for User 2
	await prisma.transaction.create({
		data: {
			title: "Quarterly Performance Bonus",
			amount: 1200.0,
			type: "INCOME",
			category_id: catBonus.id,
			userId: user2.id,
			date: new Date("2026-11-03T11:00:00Z"),
		},
	});
	await prisma.transaction.create({
		data: {
			title: "Apartment Rent",
			amount: 950.0,
			type: "EXPENSE",
			category_id: catRent.id,
			userId: user2.id,
			date: new Date("2026-11-04T09:00:00Z"),
		},
	});

	console.log("PostgreSQL seed completed successfully.");
	await prisma.$disconnect();
}

seed().catch((err) => {
	console.error("Seed failed:", err);
	process.exit(1);
});
