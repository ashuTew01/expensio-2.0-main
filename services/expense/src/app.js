import express from "express";
import dotenv from "dotenv";
import expenseRoutes from "./routes/expenseRoutes.js";
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

//log setup
import path from "path";
import { fileURLToPath } from "url";
import { startKafka } from "./config/startKafka.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logDirectory = path.join(__dirname, "..", "logs");
initLogger(logDirectory);

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(errorHandlingMiddleware);
app.use(cors());

// Use routes
app.use("/api/expense", expenseRoutes);

const PORT = process.env.PORT || 3000;

const startServices = async () => {
	try {
		await startRabbitMQ();
		await connectDB();
		await startKafka();
	} catch (error) {
		logError("Failed to start services:", error);
		process.exit(1);
	}
};

await startServices();

app.listen(PORT, () => {
	logInfo("Expense service is running on port " + PORT);

	/* Add data insertion functions below */
	/* WARNING: Comment them and move them out of app.listen after one time insertion.*/
});

// addPsychologicalTypes();
// addCategories();
