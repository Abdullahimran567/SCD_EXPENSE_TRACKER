import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config/index.js";
import { userRepository as defaultUserRepo } from "../repositories/userRepository.js";
import { ValidationError, AuthError, NotFoundError } from "../utils/errors.js";

export class AuthService {
	constructor({ userRepository = defaultUserRepo } = {}) {
		this.userRepository = userRepository;
		this.jwtSecret = config.jwtSecret;
		this.jwtExpiresIn = config.jwtExpiresIn;
		this.bcryptRounds = config.bcryptRounds;
	}

	async signup({ name, email, password }) {
		if (!name || !email || !password) {
			throw new ValidationError("Please provide name, email, and password.");
		}

		if (password.length < 6) {
			throw new ValidationError("Password must be at least 6 characters long.");
		}

		const normalizedEmail = email.trim().toLowerCase();

		const existingUser = await this.userRepository.findByEmail(normalizedEmail);

		if (existingUser) {
			throw new ValidationError("User with this email already exists.");
		}

		const salt = await bcrypt.genSalt(this.bcryptRounds);
		const hashedPassword = await bcrypt.hash(password, salt);

		const user = await this.userRepository.create({
			name: name.trim(),
			email: normalizedEmail,
			password: hashedPassword,
		});

		const token = jwt.sign(
			{ id: user.id, email: user.email },
			this.jwtSecret,
			{ expiresIn: this.jwtExpiresIn },
		);

		return {
			token,
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
				created_at: user.created_at,
			},
		};
	}

	async login({ email, password }) {
		if (!email || !password) {
			throw new ValidationError("Please provide email and password.");
		}

		const normalizedEmail = email.trim().toLowerCase();

		const user = await this.userRepository.findByEmail(normalizedEmail);

		if (!user) {
			throw new AuthError("Invalid email or password.");
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			throw new AuthError("Invalid email or password.");
		}

		const token = jwt.sign(
			{ id: user.id, email: user.email },
			this.jwtSecret,
			{ expiresIn: this.jwtExpiresIn },
		);

		return {
			token,
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
				created_at: user.created_at,
			},
		};
	}

	async getMe(userId) {
		const user = await this.userRepository.findById(userId);

		if (!user) {
			throw new NotFoundError("User not found");
		}

		return {
			id: user.id,
			name: user.name,
			email: user.email,
			created_at: user.created_at,
		};
	}
}

export const authService = new AuthService();
