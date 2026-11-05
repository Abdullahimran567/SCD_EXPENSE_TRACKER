import "dotenv/config";
import mongoose from "mongoose";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { User as MongoUser } from "../src/models/User.js";
import { Category as MongoCategory } from "../src/models/Category.js";
import { Transaction as MongoTransaction } from "../src/models/Transaction.js";
import { Budget as MongoBudget } from "../src/models/Budget.js";

const isDryRun = process.argv.includes("--dry-run");

const pgUrl =
	process.env.DATABASE_URL ||
	"postgresql://postgres:imran5701@localhost:5432/Expense_Tracker";
const mongoUri =
	process.env.MONGODB_URI || "mongodb://localhost:27017/Expense_Tracker";

const adapter = new PrismaPg({ connectionString: pgUrl });
const prisma = new PrismaClient({ adapter });

async function runMigration() {
	console.log(`Starting PostgreSQL to MongoDB Migration...`);
	console.log(`Dry Run Mode: ${isDryRun ? "YES" : "NO"}`);
	console.log(`PostgreSQL source: ${pgUrl}`);
	console.log(`MongoDB target: ${mongoUri}\n`);

	await mongoose.connect(mongoUri);

	// 1. Fetch from PostgreSQL
	const pgUsers = await prisma.user.findMany({ orderBy: { id: "asc" } });
	const pgCategories = await prisma.category.findMany({
		orderBy: { id: "asc" },
	});
	const pgTransactions = await prisma.transaction.findMany({
		orderBy: { id: "asc" },
	});
	const pgBudgets = await prisma.budget.findMany({ orderBy: { id: "asc" } });

	console.log(`[Read from PostgreSQL]`);
	console.log(`- Users: ${pgUsers.length}`);
	console.log(`- Categories: ${pgCategories.length}`);
	console.log(`- Transactions: ${pgTransactions.length}`);
	console.log(`- Budgets: ${pgBudgets.length}\n`);

	// Maps for legacyId -> ObjectId
	const userMap = new Map();
	const categoryMap = new Map();

	// 2. Migrate Users
	let migratedUsers = 0;
	for (const u of pgUsers) {
		let mongoUser = await MongoUser.findOne({
			$or: [{ email: u.email.toLowerCase() }, { legacyId: u.id }],
		});

		if (!mongoUser) {
			if (!isDryRun) {
				mongoUser = await MongoUser.create({
					name: u.name,
					email: u.email.toLowerCase(),
					password: u.password,
					legacyId: u.id,
					created_at: u.created_at,
				});
			} else {
				mongoUser = new MongoUser({
					_id: new mongoose.Types.ObjectId(),
					name: u.name,
					email: u.email.toLowerCase(),
					password: u.password,
					legacyId: u.id,
				});
			}
			migratedUsers++;
		}
		userMap.set(u.id, mongoUser._id);
	}

	// 3. Migrate Categories
	let migratedCategories = 0;
	for (const c of pgCategories) {
		const targetUserId = userMap.get(c.user_id);
		if (!targetUserId) continue;

		let mongoCat = await MongoCategory.findOne({
			nameNormalized: c.name.trim().toLowerCase(),
			user_id: targetUserId,
		});

		if (!mongoCat) {
			if (!isDryRun) {
				mongoCat = await MongoCategory.create({
					name: c.name.trim(),
					nameNormalized: c.name.trim().toLowerCase(),
					type: c.type,
					user_id: targetUserId,
					legacyId: c.id,
				});
			} else {
				mongoCat = new MongoCategory({
					_id: new mongoose.Types.ObjectId(),
					name: c.name.trim(),
					nameNormalized: c.name.trim().toLowerCase(),
					type: c.type,
					user_id: targetUserId,
					legacyId: c.id,
				});
			}
			migratedCategories++;
		}
		categoryMap.set(c.id, mongoCat._id);
	}

	// 4. Migrate Budgets
	let migratedBudgets = 0;
	for (const b of pgBudgets) {
		const targetUserId = userMap.get(b.userId);
		if (!targetUserId) continue;

		let mongoBudget = await MongoBudget.findOne({
			userId: targetUserId,
			month: b.month,
			year: b.year,
		});

		if (!mongoBudget) {
			if (!isDryRun) {
				mongoBudget = await MongoBudget.create({
					amount: mongoose.Types.Decimal128.fromString(Number(b.amount).toFixed(2)),
					month: b.month,
					year: b.year,
					userId: targetUserId,
					legacyId: b.id,
				});
			}
			migratedBudgets++;
		}
	}

	// 5. Migrate Transactions
	let migratedTransactions = 0;
	for (const t of pgTransactions) {
		const targetUserId = userMap.get(t.userId);
		const targetCategoryId = categoryMap.get(t.category_id);
		if (!targetUserId || !targetCategoryId) continue;

		let mongoTx = await MongoTransaction.findOne({
			legacyId: t.id,
		});

		if (!mongoTx) {
			if (!isDryRun) {
				mongoTx = await MongoTransaction.create({
					title: t.title,
					amount: mongoose.Types.Decimal128.fromString(Number(t.amount).toFixed(2)),
					type: t.type,
					description: t.description || null,
					date: t.date,
					created_at: t.created_at,
					category_id: targetCategoryId,
					userId: targetUserId,
					legacyId: t.id,
				});
			}
			migratedTransactions++;
		}
	}

	// 6. Verification Report
	const mongoTotalUsers = await MongoUser.countDocuments();
	const mongoTotalCategories = await MongoCategory.countDocuments();
	const mongoTotalBudgets = await MongoBudget.countDocuments();
	const mongoTotalTransactions = await MongoTransaction.countDocuments();

	// Check orphaned references in Mongo
	const allMongoTx = await MongoTransaction.find().lean();
	let orphanedTx = 0;
	for (const tx of allMongoTx) {
		const userExists = await MongoUser.findById(tx.userId);
		const catExists = await MongoCategory.findById(tx.category_id);
		if (!userExists || !catExists) {
			orphanedTx++;
		}
	}

	const allMongoBudgets = await MongoBudget.find().lean();
	let orphanedBudgets = 0;
	for (const b of allMongoBudgets) {
		const userExists = await MongoUser.findById(b.userId);
		if (!userExists) {
			orphanedBudgets++;
		}
	}

	console.log(`========================================`);
	console.log(`        MIGRATION VERIFICATION REPORT    `);
	console.log(`========================================`);
	console.log(`Table / Collection Counts:`);
	console.log(`  Users:        PG ${pgUsers.length} vs Mongo ${mongoTotalUsers}`);
	console.log(`  Categories:   PG ${pgCategories.length} vs Mongo ${mongoTotalCategories}`);
	console.log(`  Transactions: PG ${pgTransactions.length} vs Mongo ${mongoTotalTransactions}`);
	console.log(`  Budgets:      PG ${pgBudgets.length} vs Mongo ${mongoTotalBudgets}`);
	console.log(`\nOrphaned References:`);
	console.log(`  Transactions with invalid user/category: ${orphanedTx}`);
	console.log(`  Budgets with invalid user: ${orphanedBudgets}`);

	console.log(`\nPer-User Totals Comparison:`);
	for (const u of pgUsers) {
		const userPgTx = pgTransactions.filter((t) => t.userId === u.id);
		let pgIncome = 0;
		let pgExpense = 0;
		for (const t of userPgTx) {
			if (t.type === "INCOME") pgIncome += Number(t.amount);
			else pgExpense += Number(t.amount);
		}

		const mongoUid = userMap.get(u.id);
		let mongoIncome = 0;
		let mongoExpense = 0;

		if (mongoUid) {
			const userMongoTx = await MongoTransaction.find({
				userId: mongoUid,
			}).lean();
			for (const t of userMongoTx) {
				const amt = Number(t.amount.toString());
				if (t.type === "INCOME") mongoIncome += amt;
				else mongoExpense += amt;
			}
		}

		console.log(`  User: ${u.email} (PG ID: ${u.id})`);
		console.log(
			`    Income:  PG ${pgIncome.toFixed(2)} | Mongo ${mongoIncome.toFixed(2)} [${pgIncome.toFixed(2) === mongoIncome.toFixed(2) ? "MATCH" : "MISMATCH"}]`,
		);
		console.log(
			`    Expense: PG ${pgExpense.toFixed(2)} | Mongo ${mongoExpense.toFixed(2)} [${pgExpense.toFixed(2) === mongoExpense.toFixed(2) ? "MATCH" : "MISMATCH"}]`,
		);
	}
	console.log(`========================================\n`);

	await prisma.$disconnect();
	await mongoose.disconnect();
}

runMigration().catch((err) => {
	console.error("Migration failed:", err);
	process.exit(1);
});
