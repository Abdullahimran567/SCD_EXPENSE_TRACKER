import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		nameNormalized: {
			type: String,
			required: true,
			trim: true,
			lowercase: true,
		},
		type: {
			type: String,
			enum: ["INCOME", "EXPENSE"],
			required: true,
		},
		user_id: {
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

categorySchema.pre("validate", function () {
	if (this.name) {
		this.nameNormalized = this.name.trim().toLowerCase();
	}
});

categorySchema.index({ nameNormalized: 1, user_id: 1 }, { unique: true });

export const Category =
	mongoose.models.Category || mongoose.model("Category", categorySchema);
