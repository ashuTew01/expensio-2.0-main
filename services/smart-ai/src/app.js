import express from "express";
import dotenv from "dotenv";
import smartAiRoutes from "./routes/smartAiRoutes.js";
import {
	errorHandlingMiddleware,
	initLogger,
	logError,
	logInfo,
} from "@expensio/sharedlib";
import bodyParser from "body-parser";
import connectDB from "./config/db.js";
import cors from "cors";

import { initializeWebSocket } from "./config/websocket.js";
import http from "http"; // Required to run WebSocket on the same server

// Load environment variables from .env file
dotenv.config();

// log setup
import path from "path";
import { fileURLToPath } from "url";
import { startKafka } from "./config/startKafka.js";
import { connectOpenai } from "./config/connectOpenai.js";
import { starterFunctions } from "./utils/starterFunctions.js";

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
app.use("/api/smart-ai", smartAiRoutes);
app.use(errorHandlingMiddleware);

const PORT = process.env.PORT || 3000;

// Create an HTTP server for WebSocket and Express to share
const server = http.createServer(app);

const startServices = async () => {
	try {
		await startKafka();
		initializeWebSocket(server); // Initialize WebSocket when services start
		await connectOpenai();
		await connectDB();
	} catch (error) {
		logError("Failed to start services: " + error);
		process.exit(1);
	}
};

await startServices();

server.listen(PORT, () => {
	logInfo("Smart Ai service is running on port " + PORT);
	starterFunctions();
});
