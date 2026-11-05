import { userRepository as defaultUserRepo } from "../repositories/userRepository.js";
import { transactionRepository as defaultTxRepo } from "../repositories/transactionRepository.js";
import { budgetRepository as defaultBudgetRepo } from "../repositories/budgetRepository.js";
import { summaryCalculator } from "../utils/summaryCalculator.js";
import { budgetCalculator } from "../utils/budgetCalculator.js";
import { monthlyTrend } from "../utils/monthlyTrend.js";
import { CATEGORY_COLORS, MONTH_NAMES } from "../constants/index.js";

export class DashboardService {
	constructor({
		userRepository = defaultUserRepo,
		transactionRepository = defaultTxRepo,
		budgetRepository = defaultBudgetRepo,
	} = {}) {
		this.userRepository = userRepository;
		this.transactionRepository = transactionRepository;
		this.budgetRepository = budgetRepository;
	}

	async getDashboardSummary(userId) {
		const user = await this._getUserInfo(userId);

		const now = new Date();
		const currentYear = now.getFullYear();
		const currentMonth = now.getMonth();

		const currentMonthStart = new Date(currentYear, currentMonth, 1);
		const currentMonthEnd = new Date(
			currentYear,
			currentMonth + 1,
			0,
			23,
			59,
			59,
			999,
		);

		const prevMonthStart = new Date(currentYear, currentMonth - 1, 1);
		const prevMonthEnd = new Date(
			currentYear,
			currentMonth,
			0,
			23,
			59,
			59,
			999,
		);

		const allTransactions = await this.transactionRepository.findMany({
			where: { userId },
		});
		const { balance: totalBalance } =
			summaryCalculator.calculateTotals(allTransactions);

		const currentMonthTx = await this.transactionRepository.findMany({
			where: {
				userId,
				date: { gte: currentMonthStart, lte: currentMonthEnd },
			},
			includeCategory: true,
		});
		const {
			totalIncome: monthlyIncome,
			totalExpense: monthlyExpenses,
			savings: monthlySavings,
		} = summaryCalculator.calculateTotals(currentMonthTx);

		const prevMonthTx = await this.transactionRepository.findMany({
			where: {
				userId,
				date: { gte: prevMonthStart, lte: prevMonthEnd },
			},
		});
		const { totalIncome: prevMonthlyIncome } =
			summaryCalculator.calculateTotals(prevMonthTx);

		const growthPercentage = summaryCalculator.calculateGrowth(
			monthlyIncome,
			prevMonthlyIncome,
		);

		const userBudget = await this.budgetRepository.findByUserMonthYear(
			userId,
			currentMonth + 1,
			currentYear,
		);
		const budgetLimit = userBudget ? Number(userBudget.amount) : 0;
		const budgetProgress = budgetCalculator.calculateProgress(
			budgetLimit,
			monthlyExpenses,
		);

		const categoryBreakdown = summaryCalculator.calculateCategoryBreakdown(
			currentMonthTx,
			monthlyExpenses,
			CATEGORY_COLORS,
		);

		const { sixMonthsData, hasChartData } = await this._buildSixMonthChart(
			userId,
			now,
		);

		const recentTransactions = await this._getRecentTransactions(userId);

		return {
			user,
			totalBalance,
			growthPercentage,
			monthlyIncome,
			monthlyExpenses,
			savings: monthlySavings,
			budget: {
				limit: budgetProgress.limit,
				spent: budgetProgress.spent,
				percentageUsed: budgetProgress.percentageUsed,
				remaining: budgetProgress.remaining,
				isSet: Boolean(userBudget),
				monthName: MONTH_NAMES[currentMonth],
				year: currentYear,
			},
			categoryBreakdown,
			incomeVsExpense: sixMonthsData,
			hasChartData,
			recentTransactions,
			hasTransactions: allTransactions.length > 0,
		};
	}

	async _getUserInfo(userId) {
		const userRecord = await this.userRepository.findById(userId);
		if (!userRecord) return null;
		return {
			id: userRecord.id,
			name: userRecord.name,
			email: userRecord.email,
		};
	}

	async _buildSixMonthChart(userId, referenceDate) {
		const buckets = monthlyTrend.buildRollingSixMonths(referenceDate);

		const transactionsByBucket = await Promise.all(
			buckets.map((b) =>
				this.transactionRepository.findMany({
					where: {
						userId,
						date: { gte: b.startDate, lte: b.endDate },
					},
				}),
			),
		);

		const { chartData, hasChartData } = monthlyTrend.aggregateBuckets(
			buckets,
			transactionsByBucket,
		);

		return {
			sixMonthsData: chartData,
			hasChartData,
		};
	}

	async _getRecentTransactions(userId) {
		const recentTx = await this.transactionRepository.findMany({
			where: { userId },
			orderBy: { date: "desc" },
			take: 5,
			includeCategory: true,
		});

		return recentTx.map((t) => ({
			id: t.id,
			title: t.title,
			category: t.category?.name || "General",
			date: t.date
				? new Date(t.date).toLocaleDateString("en-US", {
						month: "short",
						day: "numeric",
						year: "numeric",
					})
				: "Today",
			amount: t.type === "INCOME" ? Number(t.amount) : -Number(t.amount),
			type: t.type,
		}));
	}
}

export const dashboardService = new DashboardService();
