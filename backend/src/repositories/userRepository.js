import { prisma } from "../config/db.js";

const toPlainUser = (user) => {
	if (!user) return null;
	return {
		id: user.id,
		name: user.name,
		email: user.email,
		password: user.password,
		created_at: user.created_at,
	};
};

export const userRepository = {
	async findByEmail(email) {
		const user = await prisma.user.findUnique({
			where: { email },
		});
		return toPlainUser(user);
	},

	async findById(id) {
		const user = await prisma.user.findUnique({
			where: { id },
		});
		return toPlainUser(user);
	},

	async create({ name, email, password }) {
		const user = await prisma.user.create({
			data: {
				name,
				email,
				password,
			},
		});
		return toPlainUser(user);
	},
};
