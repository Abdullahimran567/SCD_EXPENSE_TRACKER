import { Category } from "../models/Category.js";

const toPlainCategory = (doc) => {
	if (!doc) return null;
	const obj = doc.toObject ? doc.toObject() : doc;
	return {
		id: obj._id.toString(),
		name: obj.name,
		type: obj.type,
		user_id: obj.user_id.toString(),
	};
};

export const categoryRepository = {
	async findByNameAndUserId(name, userId) {
		const category = await Category.findOne({
			nameNormalized: name.trim().toLowerCase(),
			user_id: userId,
		}).lean();
		if (!category) return null;
		return {
			id: category._id.toString(),
			name: category.name,
			type: category.type,
			user_id: category.user_id.toString(),
		};
	},

	async findByName(name) {
		const category = await Category.findOne({
			nameNormalized: name.trim().toLowerCase(),
		}).lean();
		if (!category) return null;
		return {
			id: category._id.toString(),
			name: category.name,
			type: category.type,
			user_id: category.user_id.toString(),
		};
	},

	async findById(id) {
		const category = await Category.findById(id).lean();
		if (!category) return null;
		return {
			id: category._id.toString(),
			name: category.name,
			type: category.type,
			user_id: category.user_id.toString(),
		};
	},

	async findByUserId(userId, orderBy = { name: "asc" }) {
		const sort = {};
		if (orderBy && orderBy.name) {
			sort.name = orderBy.name === "asc" ? 1 : -1;
		} else {
			sort.name = 1;
		}

		const categories = await Category.find({ user_id: userId })
			.sort(sort)
			.lean();

		return categories.map((c) => ({
			id: c._id.toString(),
			name: c.name,
			type: c.type,
			user_id: c.user_id.toString(),
		}));
	},

	async create({ name, type, user_id }) {
		const category = await Category.create({
			name: name.trim(),
			nameNormalized: name.trim().toLowerCase(),
			type,
			user_id,
		});
		return toPlainCategory(category);
	},
};
