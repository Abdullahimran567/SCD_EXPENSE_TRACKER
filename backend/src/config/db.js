import mongoose from "mongoose";
import config from "./index.js";

const uri =
	process.env.MONGODB_URI_TEST ||
	(process.env.NODE_ENV === "test" && process.env.MONGODB_URI
		? process.env.MONGODB_URI
		: config.mongodbUri);

export const connectDB = async () => {
	if (mongoose.connection.readyState === 1) {
		return mongoose.connection;
	}
	return mongoose.connect(uri);
};

export const disconnectDB = async () => {
	if (mongoose.connection.readyState !== 0) {
		await mongoose.disconnect();
	}
};

export default mongoose;
