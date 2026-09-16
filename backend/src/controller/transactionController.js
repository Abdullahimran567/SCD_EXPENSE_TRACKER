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
