import express from "express";
import dotenv from "dotenv";
import financialDataRoutes from "./routes/financialDataRoutes.js";
import {
	errorHandlingMiddleware,
	initLogger,
	logError,
	logInfo,
} from "@expensio/sharedlib";
import bodyParser from "body-parser";
import connectDB from "./config/db.js";
import cors from "cors";
import startRabbitMQ from "./config/startRabbitMQ.js";

// Load environment variables from .env file
dotenv.config();

// log setup
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logDirectory = path.join(__dirname, "..", "logs");
// console.log(logDirectory);
initLogger(logDirectory);

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(errorHandlingMiddleware);
app.use(cors());

// Use routes
app.use("/api", financialDataRoutes);

const PORT = process.env.PORT || 3003;

const startServices = async () => {
	try {
		await startRabbitMQ();
		await connectDB();
	} catch (error) {
		logError("Failed to start services:", error);
		process.exit(1);
	}
};

startServices();

app.listen(PORT, () => {
	logInfo("Financial Data service is running on port " + PORT);
});
