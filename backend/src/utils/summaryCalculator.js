export const summaryCalculator = {
	calculateTotals(transactions = []) {
		let totalIncome = 0;
		let totalExpense = 0;

		for (const t of transactions) {
			const amt = Number(t.amount);
			if (t.type === "INCOME") {
				totalIncome += amt;
			} else {
				totalExpense += amt;
			}
		}

		const balance = totalIncome - totalExpense;
		const savings = Math.max(0, totalIncome - totalExpense);

		return {
			totalIncome,
			totalExpense,
			balance,
			savings,
		};
	},

	calculateGrowth(currentIncome, previousIncome) {
		const current = Number(currentIncome) || 0;
		const previous = Number(previousIncome) || 0;

		if (previous > 0) {
			return parseFloat((((current - previous) / previous) * 100).toFixed(1));
		}
		if (current > 0) {
			return 100;
		}
		return 0;
	},

	calculateCategoryBreakdown(transactions = [], totalExpenses = 0, colorMap = {}) {
		const categoryTotalsMap = {};

		transactions
			.filter((t) => t.type === "EXPENSE")
			.forEach((t) => {
				const catName = t.category?.name || "General";
				categoryTotalsMap[catName] =
					(categoryTotalsMap[catName] || 0) + Number(t.amount);
			});

		return Object.keys(categoryTotalsMap).map((catName) => {
			const amt = categoryTotalsMap[catName];
			const pct =
				totalExpenses > 0 ? Math.round((amt / totalExpenses) * 100) : 0;
			return {
				name: catName,
				amount: amt,
				percentage: pct,
				color: colorMap[catName] || "#8b5cf6",
			};
		});
	},
};
