import { userRepository } from "../repositories/userRepository.js";
import { transactionRepository } from "../repositories/transactionRepository.js";
import { budgetRepository } from "../repositories/budgetRepository.js";

const CATEGORY_COLORS = {
	Housing: "#6366f1",
	Food: "#10b981",
	Transport: "#f59e0b",
	Entertainment: "#ef4444",
	Bills: "#3b82f6",
	Others: "#cbd5e1",
	General: "#94a3b8",
};

const MONTH_NAMES = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
];

export const dashboardService = {
	async getDashboardSummary(userId) {
		const userRecord = await userRepository.findById(userId);
		const user = userRecord
			? { id: userRecord.id, name: userRecord.name, email: userRecord.email }
			: null;

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

		const allTransactions = await transactionRepository.findMany({
			where: { userId },
		});

		let totalIncomeAllTime = 0;
		let totalExpenseAllTime = 0;

		allTransactions.forEach((t) => {
			const numAmt = Number(t.amount);
			if (t.type === "INCOME") {
				totalIncomeAllTime += numAmt;
			} else {
				totalExpenseAllTime += numAmt;
			}
		});

		const totalBalance = totalIncomeAllTime - totalExpenseAllTime;

		const currentMonthTx = await transactionRepository.findMany({
			where: {
				userId,
				date: {
					gte: currentMonthStart,
					lte: currentMonthEnd,
				},
			},
			includeCategory: true,
		});

		let monthlyIncome = 0;
		let monthlyExpenses = 0;

		currentMonthTx.forEach((t) => {
			const numAmt = Number(t.amount);
			if (t.type === "INCOME") {
				monthlyIncome += numAmt;
			} else {
				monthlyExpenses += numAmt;
			}
		});

		const monthlySavings = Math.max(0, monthlyIncome - monthlyExpenses);

		const prevMonthTx = await transactionRepository.findMany({
			where: {
				userId,
				date: {
					gte: prevMonthStart,
					lte: prevMonthEnd,
				},
			},
		});

		let prevMonthlyIncome = 0;
		prevMonthTx.forEach((t) => {
			if (t.type === "INCOME") prevMonthlyIncome += Number(t.amount);
		});

		let growthPercentage = 0;
		if (prevMonthlyIncome > 0) {
			growthPercentage = parseFloat(
				(
					((monthlyIncome - prevMonthlyIncome) / prevMonthlyIncome) *
					100
				).toFixed(1),
			);
		} else if (monthlyIncome > 0) {
			growthPercentage = 100;
		}

		const userBudget = await budgetRepository.findByUserMonthYear(
			userId,
			currentMonth + 1,
			currentYear,
		);

		const budgetLimit = userBudget ? Number(userBudget.amount) : 0;
		const budgetSpent = monthlyExpenses;
		const percentageUsed =
			budgetLimit > 0
				? Math.min(100, Math.round((budgetSpent / budgetLimit) * 100))
				: 0;
		const remainingBudget =
			budgetLimit > 0 ? Math.max(0, budgetLimit - budgetSpent) : 0;

		const categoryTotalsMap = {};
		currentMonthTx
			.filter((t) => t.type === "EXPENSE")
			.forEach((t) => {
				const catName = t.category?.name || "General";
				categoryTotalsMap[catName] =
					(categoryTotalsMap[catName] || 0) + Number(t.amount);
			});

		const categoryBreakdown = Object.keys(categoryTotalsMap).map((catName) => {
			const amt = categoryTotalsMap[catName];
			const pct =
				monthlyExpenses > 0 ? Math.round((amt / monthlyExpenses) * 100) : 0;
			return {
				name: catName,
				amount: amt,
				percentage: pct,
				color: CATEGORY_COLORS[catName] || "#8b5cf6",
			};
		});

		const sixMonthsData = [];
		let hasChartData = false;

		for (let i = 5; i >= 0; i--) {
			const d = new Date(currentYear, currentMonth - i, 1);
			const mIndex = d.getMonth();
			const yNum = d.getFullYear();

			const mStart = new Date(yNum, mIndex, 1);
			const mEnd = new Date(yNum, mIndex + 1, 0, 23, 59, 59, 999);

			const mTx = await transactionRepository.findMany({
				where: {
					userId,
					date: { gte: mStart, lte: mEnd },
				},
			});

			let mInc = 0;
			let mExp = 0;

			mTx.forEach((t) => {
				if (t.type === "INCOME") mInc += Number(t.amount);
				else mExp += Number(t.amount);
			});

			if (mInc > 0 || mExp > 0) {
				hasChartData = true;
			}

			sixMonthsData.push({
				month: MONTH_NAMES[mIndex],
				income: mInc,
				expense: mExp,
			});
		}

		const recentTx = await transactionRepository.findMany({
			where: { userId },
			orderBy: { date: "desc" },
			take: 5,
			includeCategory: true,
		});

		const formattedRecentTx = recentTx.map((t) => ({
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

		return {
			user: user || null,
			totalBalance,
			growthPercentage,
			monthlyIncome,
			monthlyExpenses,
			savings: monthlySavings,
			budget: {
				limit: budgetLimit,
				spent: budgetSpent,
				percentageUsed,
				remaining: remainingBudget,
				isSet: Boolean(userBudget),
				monthName: MONTH_NAMES[currentMonth],
				year: currentYear,
			},
			categoryBreakdown,
			incomeVsExpense: sixMonthsData,
			hasChartData,
			recentTransactions: formattedRecentTx,
			hasTransactions: allTransactions.length > 0,
		};
	},
};
