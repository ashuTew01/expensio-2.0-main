import { logError, logInfo } from "@expensio/sharedlib";
import mongoose from "mongoose";

const connectDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGO_URI);
		logInfo(`Connected to MongoDB: ${conn.connection.host}`);
	} catch (error) {
		logError(`Error: ${error.message}`);
		process.exit(1);
	}
};

export default connectDB;
