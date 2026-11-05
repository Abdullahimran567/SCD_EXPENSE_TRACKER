import mongoose from "mongoose";
import { Budget } from "../models/Budget.js";

const toPlainBudget = (doc) => {
	if (!doc) return null;
	const obj = doc.toObject ? doc.toObject() : doc;
	return {
		id: obj._id.toString(),
		amount: obj.amount ? obj.amount.toString() : "0.00",
		month: obj.month,
		year: obj.year,
		userId: obj.userId.toString(),
	};
};

export const budgetRepository = {
	async upsert({ userId, month, year, amount }) {
		const decimalAmount = mongoose.Types.Decimal128.fromString(
			Number(amount).toFixed(2),
		);

		const updated = await Budget.findOneAndUpdate(
			{ userId, month, year },
			{
				$set: {
					amount: decimalAmount,
				},
				$setOnInsert: {
					userId,
					month,
					year,
				},
			},
			{
				upsert: true,
				returnDocument: "after",
			},
		);

		return toPlainBudget(updated);
	},

	async findByUserMonthYear(userId, month, year) {
		const budget = await Budget.findOne({
			userId,
			month,
			year,
		}).lean();

		if (!budget) return null;
		return {
			id: budget._id.toString(),
			amount: budget.amount ? budget.amount.toString() : "0.00",
			month: budget.month,
			year: budget.year,
			userId: budget.userId.toString(),
		};
	},
};
