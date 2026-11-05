import { User } from "../models/User.js";

const toPlainUser = (doc) => {
	if (!doc) return null;
	const obj = doc.toObject ? doc.toObject() : doc;
	return {
		id: obj._id.toString(),
		name: obj.name,
		email: obj.email,
		password: obj.password,
		created_at: obj.created_at,
	};
};

export const userRepository = {
	async findByEmail(email) {
		const user = await User.findOne({
			email: email.trim().toLowerCase(),
		}).lean();
		if (!user) return null;
		return {
			id: user._id.toString(),
			name: user.name,
			email: user.email,
			password: user.password,
			created_at: user.created_at,
		};
	},

	async findById(id) {
		const user = await User.findById(id).lean();
		if (!user) return null;
		return {
			id: user._id.toString(),
			name: user.name,
			email: user.email,
			password: user.password,
			created_at: user.created_at,
		};
	},

	async create({ name, email, password }) {
		const user = await User.create({
			name,
			email,
			password,
		});
		return toPlainUser(user);
	},
};
