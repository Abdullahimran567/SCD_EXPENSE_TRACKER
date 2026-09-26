import { prisma } from "../config/db.js";

/**
 * @route   POST /transactions
 * @desc    Create a new transaction for logged-in user
 * @access  Private
 */
export const createTransaction = async (req, res) => {
	try {
		const userId = req.user.id;
		const { title, amount, type, categoryName, description, date } = req.body;

		if (!title || amount === undefined || !type) {
			return res.status(400).json({
				success: false,
				message: "Please provide title, amount, and type (INCOME or EXPENSE).",
			});
		}

		const parsedAmount = parseFloat(amount);
		if (isNaN(parsedAmount) || parsedAmount <= 0) {
			return res.status(400).json({
				success: false,
				message: "Amount must be a positive number.",
			});
		}

		const validTypes = ["INCOME", "EXPENSE"];
		const upperType = type.toUpperCase();
		if (!validTypes.includes(upperType)) {
			return res.status(400).json({
				success: false,
				message: "Type must be either INCOME or EXPENSE.",
			});
		}

		const nameCategory = (categoryName || "General").trim();

		// Find or create category safely
		let category = await prisma.category.findFirst({
			where: { name: nameCategory },
		});

		if (!category) {
			category = await prisma.category.create({
				data: {
					name: nameCategory,
					type: upperType,
					user_id: userId,
				},
			});
		}

		// Create transaction
		const transaction = await prisma.transaction.create({
			data: {
				title: title.trim(),
				amount: parsedAmount,
				type: upperType,
				description: description || null,
				date: date ? new Date(date) : new Date(),
				category_id: category.id,
				userId: userId,
			},
			include: {
				category: true,
			},
		});

		return res.status(201).json({
			success: true,
			message: "Transaction created successfully",
			transaction,
		});
	} catch (error) {
		console.error("Error creating transaction:", error);
		return res.status(500).json({
			success: false,
			message: "Failed to create transaction",
			error: error.message,
		});
	}
};

/**
 * @route   GET /transactions
 * @desc    Get transactions for logged-in user
 * @access  Private
 */
export const getTransactions = async (req, res) => {
	try {
		const userId = req.user.id;
		const limit = parseInt(req.query.limit) || 20;
		const page = parseInt(req.query.page) || 1;
		const skip = (page - 1) * limit;

		const transactions = await prisma.transaction.findMany({
			where: { userId },
			orderBy: { date: "desc" },
			take: limit,
			skip: skip,
			include: {
				category: true,
			},
		});

		const totalCount = await prisma.transaction.count({
			where: { userId },
		});

		return res.status(200).json({
			success: true,
			count: transactions.length,
			total: totalCount,
			page,
			totalPages: Math.ceil(totalCount / limit),
			transactions,
		});
	} catch (error) {
		console.error("Error fetching transactions:", error);
		return res.status(500).json({
			success: false,
			message: "Failed to fetch transactions",
			error: error.message,
		});
	}
};

/**
 * @route   PUT /transactions/:id
 * @desc    Update an existing transaction
 * @access  Private
 */
export const updateTransaction = async (req, res) => {
	try {
		const userId = req.user.id;
		const transactionId = parseInt(req.params.id);

		if (isNaN(transactionId)) {
			return res.status(400).json({
				success: false,
				message: "Invalid transaction ID",
			});
		}

		// Find transaction and verify ownership
		const existingTransaction = await prisma.transaction.findUnique({
			where: { id: transactionId },
		});

		if (!existingTransaction || existingTransaction.userId !== userId) {
			return res.status(404).json({
				success: false,
				message: "Transaction not found",
			});
		}

		const { title, amount, type, categoryName, description, date } = req.body;

		const updateData = {};

		if (title) updateData.title = title.trim();
		if (amount !== undefined) {
			const parsedAmount = parseFloat(amount);
			if (isNaN(parsedAmount) || parsedAmount <= 0) {
				return res.status(400).json({
					success: false,
					message: "Amount must be a positive number",
				});
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
			let category = await prisma.category.findFirst({
				where: { name: nameCategory },
			});

			if (!category) {
				category = await prisma.category.create({
					data: {
						name: nameCategory,
						type: updateData.type || existingTransaction.type,
						user_id: userId,
					},
				});
			}
			updateData.category_id = category.id;
		}

		const updatedTransaction = await prisma.transaction.update({
			where: { id: transactionId },
			data: updateData,
			include: { category: true },
		});

		return res.status(200).json({
			success: true,
			message: "Transaction updated successfully",
			transaction: updatedTransaction,
		});
	} catch (error) {
		console.error("Error updating transaction:", error);
		return res.status(500).json({
			success: false,
			message: "Failed to update transaction",
			error: error.message,
		});
	}
};

/**
 * @route   DELETE /transactions/:id
 * @desc    Delete a transaction
 * @access  Private
 */
export const deleteTransaction = async (req, res) => {
	try {
		const userId = req.user.id;
		const transactionId = parseInt(req.params.id);

		if (isNaN(transactionId)) {
			return res.status(400).json({
				success: false,
				message: "Invalid transaction ID",
			});
		}

		// Find transaction and verify ownership
		const existingTransaction = await prisma.transaction.findUnique({
			where: { id: transactionId },
		});

		if (!existingTransaction || existingTransaction.userId !== userId) {
			return res.status(404).json({
				success: false,
				message: "Transaction not found",
			});
		}

		await prisma.transaction.delete({
			where: { id: transactionId },
		});

		return res.status(200).json({
			success: true,
			message: "Transaction deleted successfully",
		});
	} catch (error) {
		console.error("Error deleting transaction:", error);
		return res.status(500).json({
			success: false,
			message: "Failed to delete transaction",
			error: error.message,
		});
	}
};
