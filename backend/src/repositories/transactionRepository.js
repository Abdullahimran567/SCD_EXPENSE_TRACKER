import mongoose from "mongoose";
import { Transaction } from "../models/Transaction.js";

const toPlainTransaction = (doc) => {
	if (!doc) return null;
	const obj = doc.toObject ? doc.toObject() : doc;
	const plain = {
		id: obj._id.toString(),
		amount: obj.amount ? obj.amount.toString() : "0.00",
		type: obj.type,
		title: obj.title,
		description: obj.description ?? null,
		date: obj.date,
		created_at: obj.created_at,
		category_id: obj.category_id ? (obj.category_id._id ? obj.category_id._id.toString() : obj.category_id.toString()) : null,
		userId: obj.userId ? obj.userId.toString() : null,
	};

	if (obj.category_id && typeof obj.category_id === "object" && obj.category_id._id) {
		plain.category = {
			id: obj.category_id._id.toString(),
			name: obj.category_id.name,
			type: obj.category_id.type,
			user_id: obj.category_id.user_id ? obj.category_id.user_id.toString() : null,
		};
	}

	return plain;
};

const buildQuery = (where = {}) => {
	const query = {};
	if (where.userId) {
		query.userId = where.userId;
	}
	if (where.date) {
		query.date = {};
		if (where.date.gte) query.date.$gte = where.date.gte;
		if (where.date.lte) query.date.$lte = where.date.lte;
	}
	return query;
};

export const transactionRepository = {
	async create({ title, amount, type, description, date, category_id, userId }) {
		const decimalAmount = mongoose.Types.Decimal128.fromString(
			Number(amount).toFixed(2),
		);

		const created = await Transaction.create({
			title,
			amount: decimalAmount,
			type,
			description: description || null,
			date: date || new Date(),
			category_id,
			userId,
		});

		const populated = await Transaction.findById(created._id).populate("category_id");
		return toPlainTransaction(populated);
	},

	async findById(id) {
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return null;
		}
		const transaction = await Transaction.findById(id).populate("category_id");
		return toPlainTransaction(transaction);
	},

	async findMany({ where, orderBy, take, skip, includeCategory = false }) {
		const query = buildQuery(where);
		let mQuery = Transaction.find(query);

		if (orderBy && orderBy.date) {
			mQuery = mQuery.sort({ date: orderBy.date === "asc" ? 1 : -1 });
		} else {
			mQuery = mQuery.sort({ date: -1 });
		}

		if (skip !== undefined) {
			mQuery = mQuery.skip(skip);
		}
		if (take !== undefined) {
			mQuery = mQuery.limit(take);
		}

		if (includeCategory) {
			mQuery = mQuery.populate("category_id");
		}

		const transactions = await mQuery;
		return transactions.map(toPlainTransaction);
	},

	async count({ where }) {
		const query = buildQuery(where);
		return Transaction.countDocuments(query);
	},

	async update(id, data) {
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return null;
		}

		const updatePayload = { ...data };
		if (data.amount !== undefined) {
			updatePayload.amount = mongoose.Types.Decimal128.fromString(
				Number(data.amount).toFixed(2),
			);
		}

		const updated = await Transaction.findByIdAndUpdate(
			id,
			{ $set: updatePayload },
			{ returnDocument: "after" },
		).populate("category_id");

		return toPlainTransaction(updated);
	},

	async delete(id) {
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return null;
		}
		const deleted = await Transaction.findByIdAndDelete(id);
		return toPlainTransaction(deleted);
	},
};
