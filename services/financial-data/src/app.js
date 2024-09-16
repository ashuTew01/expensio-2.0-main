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

// Load environment variables from .env file
dotenv.config();
import { startKafka } from "./config/startKafka.js";

// log setup
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logDirectory = path.join(__dirname, "..", "logs");
initLogger(logDirectory);

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// Use routes
app.use("/api/financial-data", financialDataRoutes);
app.use(errorHandlingMiddleware);

const PORT = process.env.PORT || 3000;

const startServices = async () => {
	try {
		await startKafka();
		await connectDB();
	} catch (error) {
		logError("Failed to start services: " + error);
		process.exit(1);
	}
};

await startServices();

app.listen(PORT, () => {
	logInfo("Financial Data service is running on port " + PORT);
});
