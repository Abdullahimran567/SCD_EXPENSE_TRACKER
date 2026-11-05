import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { userRepository } from "../repositories/userRepository.js";
import { ValidationError, AuthError, NotFoundError } from "../utils/errors.js";

const JWT_SECRET =
	process.env.JWT_SECRET || "scd_expense_tracker_secret_key_2026";

export const authService = {
	async signup({ name, email, password }) {
		if (!name || !email || !password) {
			throw new ValidationError("Please provide name, email, and password.");
		}

		if (password.length < 6) {
			throw new ValidationError("Password must be at least 6 characters long.");
		}

		const normalizedEmail = email.trim().toLowerCase();

		const existingUser = await userRepository.findByEmail(normalizedEmail);

		if (existingUser) {
			throw new ValidationError("User with this email already exists.");
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const user = await userRepository.create({
			name: name.trim(),
			email: normalizedEmail,
			password: hashedPassword,
		});

		const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
			expiresIn: "7d",
		});

		return {
			token,
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
				created_at: user.created_at,
			},
		};
	},

	async login({ email, password }) {
		if (!email || !password) {
			throw new ValidationError("Please provide email and password.");
		}

		const normalizedEmail = email.trim().toLowerCase();

		const user = await userRepository.findByEmail(normalizedEmail);

		if (!user) {
			throw new AuthError("Invalid email or password.");
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			throw new AuthError("Invalid email or password.");
		}

		const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
			expiresIn: "7d",
		});

		return {
			token,
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
				created_at: user.created_at,
			},
		};
	},

	async getMe(userId) {
		const user = await userRepository.findById(userId);

		if (!user) {
			throw new NotFoundError("User not found");
		}

		return {
			id: user.id,
			name: user.name,
			email: user.email,
			created_at: user.created_at,
		};
	},
};
