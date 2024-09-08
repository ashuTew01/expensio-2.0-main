import express from "express";
import dotenv from "dotenv";
import smartChatRoutes from "./routes/smartChatRoutes.js";
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
import { initializeWebSocket } from "./config/websocket.js";
import http from "http"; // Required to run WebSocket on the same server

// Load environment variables from .env file
dotenv.config();

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
app.use(errorHandlingMiddleware);

// Use routes
app.use("/api/smart-chat", smartChatRoutes);

const PORT = process.env.PORT || 3000;

// Create an HTTP server for WebSocket and Express to share
const server = http.createServer(app);

const startServices = async () => {
	try {
		// await startRabbitMQ();
		await connectDB();
		initializeWebSocket(server); // Initialize WebSocket when services start
	} catch (error) {
		logError("Failed to start services:", error);
		process.exit(1);
	}
};

await startServices();

server.listen(PORT, () => {
	logInfo("Smart Chat service is running on port " + PORT);
});
