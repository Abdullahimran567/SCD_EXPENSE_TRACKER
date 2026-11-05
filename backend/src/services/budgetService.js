import { budgetRepository } from "../repositories/budgetRepository.js";
import { ValidationError } from "../utils/errors.js";

export const budgetService = {
	async setBudget({ userId, amount, month, year }) {
		const currentYear = new Date().getFullYear();
		const currentMonth = new Date().getMonth() + 1; // 1-12

		const targetMonth = parseInt(month) || currentMonth;
		const targetYear = parseInt(year) || currentYear;
		const parsedAmount = parseFloat(amount);

		if (isNaN(parsedAmount) || parsedAmount <= 0) {
			throw new ValidationError("Please provide a valid budget amount.");
		}

		const budget = await budgetRepository.upsert({
			userId,
			month: targetMonth,
			year: targetYear,
			amount: parsedAmount,
		});

		return budget;
	},

	async getBudget({ userId, month, year }) {
		const currentYear = new Date().getFullYear();
		const currentMonth = new Date().getMonth() + 1;

		const targetMonth = parseInt(month) || currentMonth;
		const targetYear = parseInt(year) || currentYear;

		const budget = await budgetRepository.findByUserMonthYear(
			userId,
			targetMonth,
			targetYear,
		);

		return budget || { amount: 5000, month: targetMonth, year: targetYear, isDefault: true };
	},
};
