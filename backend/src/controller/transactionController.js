import { transactionService } from "../services/transactionService.js";
import { AppError } from "../utils/errors.js";

export const createTransaction = async (req, res) => {
	try {
		const userId = req.user.id;
		const { title, amount, type, categoryName, description, date } = req.body;

		const transaction = await transactionService.createTransaction({
			userId,
			title,
			amount,
			type,
			categoryName,
			description,
			date,
		});

		return res.status(201).json({
			success: true,
			message: "Transaction created successfully",
			transaction,
		});
	} catch (error) {
		if (error instanceof AppError) {
			return res.status(error.statusCode).json({
				success: false,
				message: error.message,
			});
		}
		console.error("Error creating transaction:", error);
		return res.status(500).json({
			success: false,
			message: "Failed to create transaction",
			error: error.message,
		});
	}
};

export const getTransactions = async (req, res) => {
	try {
		const userId = req.user.id;
		const { limit, page } = req.query;

		const result = await transactionService.getTransactions({
			userId,
			limit,
			page,
		});

		return res.status(200).json({
			success: true,
			...result,
		});
	} catch (error) {
		if (error instanceof AppError) {
			return res.status(error.statusCode).json({
				success: false,
				message: error.message,
			});
		}
		console.error("Error fetching transactions:", error);
		return res.status(500).json({
			success: false,
			message: "Failed to fetch transactions",
			error: error.message,
		});
	}
};

export const updateTransaction = async (req, res) => {
	try {
		const userId = req.user.id;
		const transactionId = req.params.id;

		const updatedTransaction = await transactionService.updateTransaction({
			userId,
			transactionId,
			data: req.body,
		});

		return res.status(200).json({
			success: true,
			message: "Transaction updated successfully",
			transaction: updatedTransaction,
		});
	} catch (error) {
		if (error instanceof AppError) {
			return res.status(error.statusCode).json({
				success: false,
				message: error.message,
			});
		}
		console.error("Error updating transaction:", error);
		return res.status(500).json({
			success: false,
			message: "Failed to update transaction",
			error: error.message,
		});
	}
};

export const deleteTransaction = async (req, res) => {
	try {
		const userId = req.user.id;
		const transactionId = req.params.id;

		await transactionService.deleteTransaction({
			userId,
			transactionId,
		});

		return res.status(200).json({
			success: true,
			message: "Transaction deleted successfully",
		});
	} catch (error) {
		if (error instanceof AppError) {
			return res.status(error.statusCode).json({
				success: false,
				message: error.message,
			});
		}
		console.error("Error deleting transaction:", error);
		return res.status(500).json({
			success: false,
			message: "Failed to delete transaction",
			error: error.message,
		});
	}
};
