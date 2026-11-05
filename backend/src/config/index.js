import "dotenv/config";

const requiredEnvVars = ["MONGODB_URI", "JWT_SECRET"];

for (const envVar of requiredEnvVars) {
	if (!process.env[envVar]) {
		throw new Error(
			`[Config Error] Missing required environment variable: ${envVar}`,
		);
	}
}

export const config = {
	port: parseInt(process.env.PORT, 10) || 5000,
	nodeEnv: process.env.NODE_ENV || "development",
	jwtSecret: process.env.JWT_SECRET,
	jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
	bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS, 10) || 10,
	mongodbUri: process.env.MONGODB_URI,
	frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
	cookieOptions: {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
		maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
	},
};

export default config;
