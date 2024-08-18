import express from "express";
import connectRabbitMQ from "./config/rabbitmq.js";
import healthCheckRoute from "./routes/healthCheck.js";
import dotenv from "dotenv";
import { logError, logInfo } from "@expensio/sharedlib";
dotenv.config();
const app = express();

app.use(express.json());
app.use("/api", healthCheckRoute);

let channel;

connectRabbitMQ()
	.then((conn) => {
		return conn.createChannel();
	})
	.then((ch) => {
		channel = ch;
		logInfo("Connected to RabbitMQ");
	})
	.catch((err) => {
		logError("Failed to connect to RabbitMQ:", err);
	});

export { app, channel };
