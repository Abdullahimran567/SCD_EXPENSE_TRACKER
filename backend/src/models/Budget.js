import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema(
	{
		amount: {
			type: mongoose.Schema.Types.Decimal128,
			required: true,
		},
		month: {
			type: Number,
			required: true,
		},
		year: {
			type: Number,
			required: true,
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},
		legacyId: {
			type: Number,
			index: true,
		},
	},
	{
		timestamps: false,
	},
);

budgetSchema.index({ userId: 1, year: 1, month: 1 }, { unique: true });

export const Budget =
	mongoose.models.Budget || mongoose.model("Budget", budgetSchema);
