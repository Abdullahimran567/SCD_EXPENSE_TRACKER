import { prisma } from "../config/db.js";

const DEFAULT_SYSTEM_CATEGORIES = [
	{ name: "Housing", type: "EXPENSE" },
	{ name: "Food", type: "EXPENSE" },
	{ name: "Transport", type: "EXPENSE" },
	{ name: "Entertainment", type: "EXPENSE" },
	{ name: "Bills", type: "EXPENSE" },
	{ name: "Income", type: "INCOME" },
	{ name: "Others", type: "EXPENSE" },
];

/**
 * @route   POST /categories
 * @desc    Create a custom user category
 * @access  Private
 */
export const createCategory = async (req, res) => {
	try {
		const userId = req.user.id;
		const { name, type } = req.body;

		if (!name || !name.trim()) {
			return res.status(400).json({
				success: false,
				message: "Please provide a valid category name.",
			});
		}

		const cleanName = name.trim();
		const validTypes = ["EXPENSE", "INCOME"];
		const categoryType = type && validTypes.includes(type.toUpperCase()) ? type.toUpperCase() : "EXPENSE";

		// Check if category already exists for user
		let existingCategory = await prisma.category.findFirst({
			where: {
				name: cleanName,
				user_id: userId,
			},
		});

		if (existingCategory) {
			return res.status(200).json({
				success: true,
				message: "Category already exists",
				category: existingCategory,
			});
		}

		// Create category
		const category = await prisma.category.create({
			data: {
				name: cleanName,
				type: categoryType,
				user_id: userId,
			},
		});

		return res.status(201).json({
			success: true,
			message: "Category created successfully",
			category,
		});
	} catch (error) {
		console.error("Error in createCategory:", error);
		return res.status(500).json({
			success: false,
			message: "Failed to create category",
			error: error.message,
		});
	}
};

/**
 * @route   GET /categories
 * @desc    Get all categories available to user (user custom + defaults)
 * @access  Private
 */
export const getCategories = async (req, res) => {
	try {
		const userId = req.user.id;

		// Fetch user's custom categories from DB
		const userCategories = await prisma.category.findMany({
			where: { user_id: userId },
			orderBy: { name: "asc" },
		});

		const userCategoryNames = new Set(userCategories.map((c) => c.name.toLowerCase()));

		// Combine with default categories not yet created by user
		const combinedCategories = [...userCategories];

		DEFAULT_SYSTEM_CATEGORIES.forEach((def, index) => {
			if (!userCategoryNames.has(def.name.toLowerCase())) {
				combinedCategories.push({
					id: `def-${index}`,
					name: def.name,
					type: def.type,
					user_id: userId,
					isDefault: true,
				});
			}
		});

		return res.status(200).json({
			success: true,
			categories: combinedCategories,
		});
	} catch (error) {
		console.error("Error in getCategories:", error);
		return res.status(500).json({
			success: false,
			message: "Failed to fetch categories",
			error: error.message,
		});
	}
};
