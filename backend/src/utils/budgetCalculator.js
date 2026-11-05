import { BUDGET_STATUS, BUDGET_THRESHOLDS } from "../constants/index.js";

export const budgetCalculator = {
	calculateProgress(budgetLimit, budgetSpent) {
		const limit = Number(budgetLimit) || 0;
		const spent = Number(budgetSpent) || 0;

		if (limit <= 0) {
			return {
				limit: 0,
				spent,
				percentageUsed: 0,
				remaining: 0,
				status: BUDGET_STATUS.NORMAL,
			};
		}

		const rawPercentage = (spent / limit) * 100;
		const percentageUsed = Math.min(100, Math.round(rawPercentage));
		const remaining = Math.max(0, limit - spent);

		let status = BUDGET_STATUS.NORMAL;
		if (rawPercentage >= BUDGET_THRESHOLDS.EXCEEDED_PERCENT) {
			status = BUDGET_STATUS.EXCEEDED;
		} else if (rawPercentage >= BUDGET_THRESHOLDS.WARNING_PERCENT) {
			status = BUDGET_STATUS.WARNING;
		}

		return {
			limit,
			spent,
			percentageUsed,
			remaining,
			status,
		};
	},
};
