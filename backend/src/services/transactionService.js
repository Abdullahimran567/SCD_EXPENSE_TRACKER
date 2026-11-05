import { transactionRepository } from "../repositories/transactionRepository.js";
import { categoryRepository } from "../repositories/categoryRepository.js";
import { ValidationError, NotFoundError } from "../utils/errors.js";

export const transactionService = {
	async createTransaction({ userId, title, amount, type, categoryName, description, date }) {
		if (!title || amount === undefined || !type) {
			throw new ValidationError(
				"Please provide title, amount, and type (INCOME or EXPENSE).",
			);
		}

		const parsedAmount = parseFloat(amount);
		if (isNaN(parsedAmount) || parsedAmount <= 0) {
			throw new ValidationError("Amount must be a positive number.");
		}

		const validTypes = ["INCOME", "EXPENSE"];
		const upperType = type.toUpperCase();
		if (!validTypes.includes(upperType)) {
			throw new ValidationError("Type must be either INCOME or EXPENSE.");
		}

		const nameCategory = (categoryName || "General").trim();

		let category = await categoryRepository.findByName(nameCategory);

		if (!category) {
			category = await categoryRepository.create({
				name: nameCategory,
				type: upperType,
				user_id: userId,
			});
		}

		const transaction = await transactionRepository.create({
			title: title.trim(),
			amount: parsedAmount,
			type: upperType,
			description: description || null,
			date: date ? new Date(date) : new Date(),
			category_id: category.id,
			userId: userId,
		});

		return transaction;
	},

	async getTransactions({ userId, limit = 20, page = 1 }) {
		const parsedLimit = parseInt(limit) || 20;
		const parsedPage = parseInt(page) || 1;
		const skip = (parsedPage - 1) * parsedLimit;

		const transactions = await transactionRepository.findMany({
			where: { userId },
			orderBy: { date: "desc" },
			take: parsedLimit,
			skip: skip,
			includeCategory: true,
		});

		const totalCount = await transactionRepository.count({
			where: { userId },
		});

		return {
			count: transactions.length,
			total: totalCount,
			page: parsedPage,
			totalPages: Math.ceil(totalCount / parsedLimit),
			transactions,
		};
	},

	async updateTransaction({ userId, transactionId, data }) {
		const parsedId = parseInt(transactionId);
		if (isNaN(parsedId)) {
			throw new ValidationError("Invalid transaction ID");
		}

		const existingTransaction = await transactionRepository.findById(parsedId);

		if (!existingTransaction || existingTransaction.userId !== userId) {
			throw new NotFoundError("Transaction not found");
		}

		const { title, amount, type, categoryName, description, date } = data;

		const updateData = {};

		if (title) updateData.title = title.trim();
		if (amount !== undefined) {
			const parsedAmount = parseFloat(amount);
			if (isNaN(parsedAmount) || parsedAmount <= 0) {
				throw new ValidationError("Amount must be a positive number");
			}
			updateData.amount = parsedAmount;
		}

		if (type) {
			const upperType = type.toUpperCase();
			if (["INCOME", "EXPENSE"].includes(upperType)) {
				updateData.type = upperType;
			}
		}

		if (description !== undefined) {
			updateData.description = description || null;
		}

		if (date) {
			updateData.date = new Date(date);
		}

		if (categoryName) {
			const nameCategory = categoryName.trim();
			let category = await categoryRepository.findByName(nameCategory);

			if (!category) {
				category = await categoryRepository.create({
					name: nameCategory,
					type: updateData.type || existingTransaction.type,
					user_id: userId,
				});
			}
			updateData.category_id = category.id;
		}

		const updatedTransaction = await transactionRepository.update(
			parsedId,
			updateData,
		);

		return updatedTransaction;
	},

	async deleteTransaction({ userId, transactionId }) {
		const parsedId = parseInt(transactionId);
		if (isNaN(parsedId)) {
			throw new ValidationError("Invalid transaction ID");
		}

		const existingTransaction = await transactionRepository.findById(parsedId);

		if (!existingTransaction || existingTransaction.userId !== userId) {
			throw new NotFoundError("Transaction not found");
		}

		await transactionRepository.delete(parsedId);
		return true;
	},
};
