import { budgetRepository as defaultBudgetRepo } from "../repositories/budgetRepository.js";
import { BUDGET_THRESHOLDS } from "../constants/index.js";
import { ValidationError } from "../utils/errors.js";

export class BudgetService {
	constructor({ budgetRepository = defaultBudgetRepo } = {}) {
		this.budgetRepository = budgetRepository;
	}

	async setBudget({ userId, amount, month, year }) {
		const currentYear = new Date().getFullYear();
		const currentMonth = new Date().getMonth() + 1; // 1-12

		const targetMonth = parseInt(month) || currentMonth;
		const targetYear = parseInt(year) || currentYear;
		const parsedAmount = parseFloat(amount);

		if (isNaN(parsedAmount) || parsedAmount <= 0) {
			throw new ValidationError("Please provide a valid budget amount.");
		}

		return this.budgetRepository.upsert({
			userId,
			month: targetMonth,
			year: targetYear,
			amount: parsedAmount,
		});
	}

	async getBudget({ userId, month, year }) {
		const currentYear = new Date().getFullYear();
		const currentMonth = new Date().getMonth() + 1;

		const targetMonth = parseInt(month) || currentMonth;
		const targetYear = parseInt(year) || currentYear;

		const budget = await this.budgetRepository.findByUserMonthYear(
			userId,
			targetMonth,
			targetYear,
		);

		return (
			budget || {
				amount: BUDGET_THRESHOLDS.DEFAULT_AMOUNT,
				month: targetMonth,
				year: targetYear,
				isDefault: true,
			}
		);
	}
}

export const budgetService = new BudgetService();
