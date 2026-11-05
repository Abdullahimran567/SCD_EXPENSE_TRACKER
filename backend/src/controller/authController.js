import { authService } from "../services/authService.js";
import { AppError } from "../utils/errors.js";
import config from "../config/index.js";

const getCookieOptions = () => config.cookieOptions;

export const signup = async (req, res) => {
	try {
		const { name, email, password } = req.body;
		const result = await authService.signup({ name, email, password });

		res.cookie("token", result.token, getCookieOptions());

		return res.status(201).json({
			success: true,
			message: "User registered successfully",
			user: result.user,
		});
	} catch (error) {
		if (error instanceof AppError) {
			return res.status(error.statusCode).json({
				success: false,
				message: error.message,
			});
		}
		console.error("Error in signup controller:", error);
		return res.status(500).json({
			success: false,
			message: "Server error during registration.",
			error: error.message,
		});
	}
};

export const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		const result = await authService.login({ email, password });

		res.cookie("token", result.token, getCookieOptions());

		return res.status(200).json({
			success: true,
			message: "Login successful",
			user: result.user,
		});
	} catch (error) {
		if (error instanceof AppError) {
			return res.status(error.statusCode).json({
				success: false,
				message: error.message,
			});
		}
		console.error("Error in login controller:", error);
		return res.status(500).json({
			success: false,
			message: "Server error during login.",
			error: error.message,
		});
	}
};

export const logout = async (req, res) => {
	res.clearCookie("token", {
		httpOnly: config.cookieOptions.httpOnly,
		secure: config.cookieOptions.secure,
		sameSite: config.cookieOptions.sameSite,
	});

	return res.status(200).json({
		success: true,
		message: "Logged out successfully",
	});
};

export const getMe = async (req, res) => {
	try {
		const user = await authService.getMe(req.user.id);

		return res.status(200).json({
			success: true,
			user,
		});
	} catch (error) {
		if (error instanceof AppError) {
			return res.status(error.statusCode).json({
				success: false,
				message: error.message,
			});
		}
		return res.status(500).json({
			success: false,
			message: "Server error",
			error: error.message,
		});
	}
};
