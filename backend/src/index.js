import app from "./app.js";
import config from "./config/index.js";
import { connectDB } from "./config/db.js";

const PORT = config.port;

const startServer = async () => {
	await connectDB();
	app.listen(PORT, () => {
		console.log(`Server running on ${PORT}`);
	});
};

startServer().catch((err) => {
	console.error("Failed to start server:", err);
	process.exit(1);
});
