import { prisma } from "../config/db.js";

const toPlainTransaction = (transaction) => {
	if (!transaction) return null;
	const plain = {
		id: transaction.id,
		amount: transaction.amount,
		type: transaction.type,
		title: transaction.title,
		description: transaction.description,
		date: transaction.date,
		created_at: transaction.created_at,
		category_id: transaction.category_id,
		userId: transaction.userId,
	};
	if (transaction.category) {
		plain.category = {
			id: transaction.category.id,
			name: transaction.category.name,
			type: transaction.category.type,
			user_id: transaction.category.user_id,
		};
	}
	return plain;
};

export const transactionRepository = {
	async create({ title, amount, type, description, date, category_id, userId }) {
		const transaction = await prisma.transaction.create({
			data: {
				title,
				amount,
				type,
				description,
				date,
				category_id,
				userId,
			},
			include: {
				category: true,
			},
		});
		return toPlainTransaction(transaction);
	},

	async findById(id) {
		const transaction = await prisma.transaction.findUnique({
			where: { id },
			include: { category: true },
		});
		return toPlainTransaction(transaction);
	},

	async findMany({ where, orderBy, take, skip, includeCategory = false }) {
		const options = {
			where,
		};
		if (orderBy) options.orderBy = orderBy;
		if (take !== undefined) options.take = take;
		if (skip !== undefined) options.skip = skip;
		if (includeCategory) {
			options.include = { category: true };
		}

		const transactions = await prisma.transaction.findMany(options);
		return transactions.map(toPlainTransaction);
	},

	async count({ where }) {
		return prisma.transaction.count({
			where,
		});
	},

	async update(id, data) {
		const transaction = await prisma.transaction.update({
			where: { id },
			data,
			include: { category: true },
		});
		return toPlainTransaction(transaction);
	},

	async delete(id) {
		const transaction = await prisma.transaction.delete({
			where: { id },
		});
		return toPlainTransaction(transaction);
	},
};
