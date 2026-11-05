import { categoryRepository } from "../repositories/categoryRepository.js";
import { ValidationError } from "../utils/errors.js";

const DEFAULT_SYSTEM_CATEGORIES = [
	{ name: "Housing", type: "EXPENSE" },
	{ name: "Food", type: "EXPENSE" },
	{ name: "Transport", type: "EXPENSE" },
	{ name: "Entertainment", type: "EXPENSE" },
	{ name: "Bills", type: "EXPENSE" },
	{ name: "Income", type: "INCOME" },
	{ name: "Others", type: "EXPENSE" },
];

export const categoryService = {
	async createCategory({ userId, name, type }) {
		if (!name || !name.trim()) {
			throw new ValidationError("Please provide a valid category name.");
		}

		const cleanName = name.trim();
		const validTypes = ["EXPENSE", "INCOME"];
		const categoryType =
			type && validTypes.includes(type.toUpperCase())
				? type.toUpperCase()
				: "EXPENSE";

		let existingCategory = await categoryRepository.findByNameAndUserId(
			cleanName,
			userId,
		);

		if (existingCategory) {
			return {
				isExisting: true,
				category: existingCategory,
			};
		}

		const category = await categoryRepository.create({
			name: cleanName,
			type: categoryType,
			user_id: userId,
		});

		return {
			isExisting: false,
			category,
		};
	},

	async getCategories(userId) {
		const userCategories = await categoryRepository.findByUserId(userId, {
			name: "asc",
		});

		const userCategoryNames = new Set(
			userCategories.map((c) => c.name.toLowerCase()),
		);

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

		return combinedCategories;
	},
};
