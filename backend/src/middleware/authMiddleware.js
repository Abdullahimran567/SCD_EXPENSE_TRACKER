import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "scd_expense_tracker_secret_key_2026";

/**
 * Middleware to authenticate requests using JWT
 */
export const authenticateToken = (req, res, next) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

	if (!token) {
		return res.status(401).json({
			success: false,
			message: "Access denied. No authentication token provided.",
		});
	}

	try {
		const decoded = jwt.verify(token, JWT_SECRET);
		req.user = decoded;
		next();
	} catch (error) {
		return res.status(403).json({
			success: false,
			message: "Invalid or expired token.",
		});
	}
};
