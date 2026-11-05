import { prisma } from "../config/db.js";

const toPlainBudget = (budget) => {
	if (!budget) return null;
	return {
		id: budget.id,
		amount: budget.amount,
		month: budget.month,
		year: budget.year,
		userId: budget.userId,
	};
};

export const budgetRepository = {
	async upsert({ userId, month, year, amount }) {
		const budget = await prisma.budget.upsert({
			where: {
				userId_month_year: {
					userId,
					month,
					year,
				},
			},
			update: {
				amount,
			},
			create: {
				userId,
				month,
				year,
				amount,
			},
		});
		return toPlainBudget(budget);
	},

	async findByUserMonthYear(userId, month, year) {
		const budget = await prisma.budget.findUnique({
			where: {
				userId_month_year: {
					userId,
					month,
					year,
				},
			},
		});
		return toPlainBudget(budget);
	},
};
