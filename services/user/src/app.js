//log setup
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logDirectory = path.join(__dirname, "..", "logs");
initLogger(logDirectory);

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

const requiredEnvVars = [
	"NODE_ENV",
	"JWT_SECRET",
	"PORT",
	"EMAIL_PASSWORD",
	"EMAIL_FOR_SMTP",
	"PROD_DOMAIN",
	"TWILIO_ACCOUNT_SID",
	"TWILIO_AUTH_TOKEN",
	"TWILIO_PHONE_NUMBER",
	"DB_USER",
	"DB_PASSWORD",
	"DB_HOST",
	"DB_PORT",
	"DB_NAME",
	// "DB_AIVEN_POSTGRES_CERT",
];

const checkEnvVariables = () => {
	const unsetEnv = requiredEnvVars.filter(
		(envVar) => typeof process.env[envVar] === "undefined"
	);
	if (unsetEnv.length > 0) {
		logError(`Required ENV variables are not set: [${unsetEnv.join(", ")}]`);
		process.exit(1);
	}
};

checkEnvVariables();

import bodyParser from "body-parser";
import {
	errorHandlingMiddleware,
	EVENTS,
	initLogger,
	logError,
	logInfo,
} from "@expensio/sharedlib";
import userRoutes from "./routes/userRoutes.js";
import pool from "./config/db.js";
const app = express();

//start RabbitMQ
import startRabbitMQ from "./config/startRabbitMQ.js";
const startServices = async () => {
	try {
		await startRabbitMQ();
	} catch (error) {
		logError("Failed to start services:", error);
		process.exit(1);
	}
};
startServices();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/api/users", userRoutes);

app.use(errorHandlingMiddleware);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
	// console.log(EVENTS);
	logInfo(`User Service is running on port ${PORT}`);

	// sendEmail({
	// 	from: `"Test Server" <${process.env.EMAIL_FOR_SMTP}>`, // Replace with your actual email
	// 	to: "krishwave66@gmail.com",
	// 	subject: "Test Email from Node Server",
	// 	html: "<h1>Hello World!</h1><p>This is a test email sent automatically from the server.</p>",
	// });
});

process.on("SIGINT", () => {
	pool.end(() => {
		logInfo("PostgreSQL pool has ended");
	});
});
