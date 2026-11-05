import { connectDB, disconnectDB } from "../src/config/db.js";
import { User } from "../src/models/User.js";
import { Category } from "../src/models/Category.js";
import { Transaction } from "../src/models/Transaction.js";
import { Budget } from "../src/models/Budget.js";

export const resetTestDb = async () => {
	await connectDB();
	await Transaction.deleteMany({});
	await Budget.deleteMany({});
	await Category.deleteMany({});
	await User.deleteMany({});
};

export const closeTestDb = async () => {
	await disconnectDB();
};
