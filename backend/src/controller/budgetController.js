import { prisma } from "../config/db.js";

/**
 * @route   POST /budget
 * @desc    Set or update monthly budget
 * @access  Private
 */
export const setBudget = async (req, res) => {
	try {
		const userId = req.user.id;
		const { amount, month, year } = req.body;

		const currentYear = new Date().getFullYear();
		const currentMonth = new Date().getMonth() + 1; // 1-12

		const targetMonth = parseInt(month) || currentMonth;
		const targetYear = parseInt(year) || currentYear;
		const parsedAmount = parseFloat(amount);

		if (isNaN(parsedAmount) || parsedAmount <= 0) {
			return res.status(400).json({
				success: false,
				message: "Please provide a valid budget amount.",
			});
		}

		// Upsert budget
		const budget = await prisma.budget.upsert({
			where: {
				userId_month_year: {
					userId,
					month: targetMonth,
					year: targetYear,
				},
			},
			update: {
				amount: parsedAmount,
			},
			create: {
				userId,
				month: targetMonth,
				year: targetYear,
				amount: parsedAmount,
			},
		});

		return res.status(200).json({
			success: true,
			message: "Budget set successfully",
			budget,
		});
	} catch (error) {
		console.error("Error setting budget:", error);
		return res.status(500).json({
			success: false,
			message: "Failed to set budget",
			error: error.message,
		});
	}
};

/**
 * @route   GET /budget
 * @desc    Get monthly budget
 * @access  Private
 */
export const getBudget = async (req, res) => {
	try {
		const userId = req.user.id;
		const currentYear = new Date().getFullYear();
		const currentMonth = new Date().getMonth() + 1;

		const month = parseInt(req.query.month) || currentMonth;
		const year = parseInt(req.query.year) || currentYear;

		const budget = await prisma.budget.findUnique({
			where: {
				userId_month_year: {
					userId,
					month,
					year,
				},
			},
		});

		return res.status(200).json({
			success: true,
			budget: budget || { amount: 5000, month, year, isDefault: true },
		});
	} catch (error) {
		console.error("Error fetching budget:", error);
		return res.status(500).json({
			success: false,
			message: "Failed to fetch budget",
			error: error.message,
		});
	}
};
