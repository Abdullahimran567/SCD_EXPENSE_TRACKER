import { categoryService } from "../services/categoryService.js";
import { AppError } from "../utils/errors.js";

export const createCategory = async (req, res) => {
	try {
		const userId = req.user.id;
		const { name, type } = req.body;

		const result = await categoryService.createCategory({ userId, name, type });

		if (result.isExisting) {
			return res.status(200).json({
				success: true,
				message: "Category already exists",
				category: result.category,
			});
		}

		return res.status(201).json({
			success: true,
			message: "Category created successfully",
			category: result.category,
		});
	} catch (error) {
		if (error instanceof AppError) {
			return res.status(error.statusCode).json({
				success: false,
				message: error.message,
			});
		}
		console.error("Error in createCategory:", error);
		return res.status(500).json({
			success: false,
			message: "Failed to create category",
			error: error.message,
		});
	}
};

export const getCategories = async (req, res) => {
	try {
		const userId = req.user.id;
		const categories = await categoryService.getCategories(userId);

		return res.status(200).json({
			success: true,
			categories,
		});
	} catch (error) {
		if (error instanceof AppError) {
			return res.status(error.statusCode).json({
				success: false,
				message: error.message,
			});
		}
		console.error("Error in getCategories:", error);
		return res.status(500).json({
			success: false,
			message: "Failed to fetch categories",
			error: error.message,
		});
	}
};
