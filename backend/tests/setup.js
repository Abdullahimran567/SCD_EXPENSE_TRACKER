import { prisma } from "../src/config/db.js";

export const resetTestDb = async () => {
	await prisma.transaction.deleteMany({});
	await prisma.budget.deleteMany({});
	await prisma.category.deleteMany({});
	await prisma.user.deleteMany({});
};
