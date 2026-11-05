import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
		},
		password: {
			type: String,
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

export const User = mongoose.models.User || mongoose.model("User", userSchema);
