import { MONTH_NAMES } from "../constants/index.js";

export const monthlyTrend = {
	buildRollingSixMonths(referenceDate = new Date()) {
		const currentYear = referenceDate.getFullYear();
		const currentMonth = referenceDate.getMonth();

		const buckets = [];
		for (let i = 5; i >= 0; i--) {
			const d = new Date(currentYear, currentMonth - i, 1);
			const mIndex = d.getMonth();
			const yNum = d.getFullYear();

			const startDate = new Date(yNum, mIndex, 1);
			const endDate = new Date(yNum, mIndex + 1, 0, 23, 59, 59, 999);

			buckets.push({
				monthName: MONTH_NAMES[mIndex],
				monthIndex: mIndex,
				year: yNum,
				startDate,
				endDate,
			});
		}

		return buckets;
	},

	aggregateBuckets(buckets, transactionsByBucket = []) {
		let hasChartData = false;

		const chartData = buckets.map((bucket, index) => {
			const txs = transactionsByBucket[index] || [];
			let income = 0;
			let expense = 0;

			for (const t of txs) {
				const amt = Number(t.amount);
				if (t.type === "INCOME") {
					income += amt;
				} else {
					expense += amt;
				}
			}

			if (income > 0 || expense > 0) {
				hasChartData = true;
			}

			return {
				month: bucket.monthName,
				income,
				expense,
			};
		});

		return {
			chartData,
			hasChartData,
		};
	},
};
