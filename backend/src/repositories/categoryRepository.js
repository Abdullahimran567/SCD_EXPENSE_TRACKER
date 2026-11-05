import { prisma } from "../config/db.js";

const toPlainCategory = (category) => {
	if (!category) return null;
	return {
		id: category.id,
		name: category.name,
		type: category.type,
		user_id: category.user_id,
	};
};

export const categoryRepository = {
	async findByNameAndUserId(name, userId) {
		const category = await prisma.category.findFirst({
			where: {
				name,
				user_id: userId,
			},
		});
		return toPlainCategory(category);
	},

	async findByName(name) {
		const category = await prisma.category.findFirst({
			where: {
				name,
			},
		});
		return toPlainCategory(category);
	},

	async findById(id) {
		const category = await prisma.category.findUnique({
			where: { id },
		});
		return toPlainCategory(category);
	},

	async findByUserId(userId, orderBy = { name: "asc" }) {
		const categories = await prisma.category.findMany({
			where: { user_id: userId },
			orderBy,
		});
		return categories.map(toPlainCategory);
	},

	async create({ name, type, user_id }) {
		const category = await prisma.category.create({
			data: {
				name,
				type,
				user_id,
			},
		});
		return toPlainCategory(category);
	},
};
