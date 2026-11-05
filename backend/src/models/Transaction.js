import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
	{
		amount: {
			type: mongoose.Schema.Types.Decimal128,
			required: true,
		},
		type: {
			type: String,
			enum: ["INCOME", "EXPENSE"],
			required: true,
		},
		title: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			default: null,
		},
		date: {
			type: Date,
			required: true,
			default: Date.now,
		},
		category_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Category",
			required: true,
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		legacyId: {
			type: Number,
			index: true,
		},
	},
	{
		timestamps: { createdAt: "created_at", updatedAt: false },
	},
);

transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ userId: 1, category_id: 1 });

export const Transaction =
	mongoose.models.Transaction ||
	mongoose.model("Transaction", transactionSchema);
