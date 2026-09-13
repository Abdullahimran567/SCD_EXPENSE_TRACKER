import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";

const JWT_SECRET = process.env.JWT_SECRET || "scd_expense_tracker_secret_key_2026";

/**
 * @route   POST /auth/signup (or /signup)
 * @desc    Register a new user
 * @access  Public
 */
export const signup = async (req, res) => {
	try {
		const { name, email, password } = req.body;

		// Validation
		if (!name || !email || !password) {
			return res.status(400).json({
				success: false,
				message: "Please provide name, email, and password.",
			});
		}

		if (password.length < 6) {
			return res.status(400).json({
				success: false,
				message: "Password must be at least 6 characters long.",
			});
		}

		const normalizedEmail = email.trim().toLowerCase();

		// Check if user already exists
		const existingUser = await prisma.user.findUnique({
			where: { email: normalizedEmail },
		});

		if (existingUser) {
			return res.status(400).json({
				success: false,
				message: "User with this email already exists.",
			});
		}

		// Hash password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		// Create user
		const user = await prisma.user.create({
			data: {
				name: name.trim(),
				email: normalizedEmail,
				password: hashedPassword,
			},
		});

		// Generate JWT Token
		const token = jwt.sign(
			{ id: user.id, email: user.email },
			JWT_SECRET,
			{ expiresIn: "7d" }
		);

		return res.status(201).json({
			success: true,
			message: "User registered successfully",
			token,
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
				created_at: user.created_at,
			},
		});
	} catch (error) {
		console.error("Error in signup controller:", error);
		return res.status(500).json({
			success: false,
			message: "Server error during registration.",
			error: error.message,
		});
	}
};

/**
 * @route   POST /auth/login (or /login)
 * @desc    Authenticate user & get token
 * @access  Public
 */
export const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		// Validation
		if (!email || !password) {
			return res.status(400).json({
				success: false,
				message: "Please provide email and password.",
			});
		}

		const normalizedEmail = email.trim().toLowerCase();

		// Find user by email
		const user = await prisma.user.findUnique({
			where: { email: normalizedEmail },
		});

		if (!user) {
			return res.status(401).json({
				success: false,
				message: "Invalid email or password.",
			});
		}

		// Check password
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(401).json({
				success: false,
				message: "Invalid email or password.",
			});
		}

		// Generate JWT Token
		const token = jwt.sign(
			{ id: user.id, email: user.email },
			JWT_SECRET,
			{ expiresIn: "7d" }
		);

		return res.status(200).json({
			success: true,
			message: "Login successful",
			token,
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
				created_at: user.created_at,
			},
		});
	} catch (error) {
		console.error("Error in login controller:", error);
		return res.status(500).json({
			success: false,
			message: "Server error during login.",
			error: error.message,
		});
	}
};
