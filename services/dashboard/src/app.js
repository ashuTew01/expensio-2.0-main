import express from "express";
import dotenv from "dotenv";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import {
	errorHandlingMiddleware,
	initLogger,
	logError,
	logInfo,
	showLogo,
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
// console.log(logDirectory);
initLogger(logDirectory);

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// Use routes
app.use("/api/dashboard", dashboardRoutes);
app.use(errorHandlingMiddleware);

const PORT = process.env.PORT || 3000;

const startServices = async () => {
	showLogo();
	console.log(
		`${process.env.SERVICE_NAME.toUpperCase()} Service is BOOTING UP...`
	);
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
	logInfo("Dashboard service is running on port " + PORT);
});
