import { budgetService } from "../services/budgetService.js";
import { AppError } from "../utils/errors.js";

export const setBudget = async (req, res) => {
	try {
		const userId = req.user.id;
		const { amount, month, year } = req.body;

		const budget = await budgetService.setBudget({
			userId,
			amount,
			month,
			year,
		});

		return res.status(200).json({
			success: true,
			message: "Budget set successfully",
			budget,
		});
	} catch (error) {
		if (error instanceof AppError) {
			return res.status(error.statusCode).json({
				success: false,
				message: error.message,
			});
		}
		console.error("Error setting budget:", error);
		return res.status(500).json({
			success: false,
			message: "Failed to set budget",
			error: error.message,
		});
	}
};

export const getBudget = async (req, res) => {
	try {
		const userId = req.user.id;
		const { month, year } = req.query;

		const budget = await budgetService.getBudget({
			userId,
			month,
			year,
		});

		return res.status(200).json({
			success: true,
			budget,
		});
	} catch (error) {
		if (error instanceof AppError) {
			return res.status(error.statusCode).json({
				success: false,
				message: error.message,
			});
		}
		console.error("Error fetching budget:", error);
		return res.status(500).json({
			success: false,
			message: "Failed to fetch budget",
			error: error.message,
		});
	}
};
