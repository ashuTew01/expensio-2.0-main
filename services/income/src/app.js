import express from "express";
import dotenv from "dotenv";
import incomeRoutes from "./routes/incomeRoutes.js";
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

const requiredEnvVars = [
	"NODE_ENV",
	"SERVICE_NAME",
	"KAFKA_BROKER_URL",
	"MONGO_URI",
	"PORT",
	"JWT_SECRET",
];

const checkEnvVariables = () => {
	const unsetEnv = requiredEnvVars.filter(
		(envVar) => typeof process.env[envVar] === "undefined"
	);
	if (unsetEnv.length > 0) {
		console.error(
			`Required ENV variables are not set: [${unsetEnv.join(", ")}]`
		);
		process.exit(1);
	}
};
checkEnvVariables();

import { startKafka } from "./config/startKafka.js";

//log setup
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
app.use("/api/income", incomeRoutes);
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
	logInfo("Income service is running on port " + PORT);

	/* Add data insertion functions below */
	/* WARNING: Comment them and move them out of app.listen after one time insertion.*/
});
