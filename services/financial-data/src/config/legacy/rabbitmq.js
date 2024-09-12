import { logError, logInfo } from "@expensio/sharedlib";
import amqp from "amqplib";

let channel; // singleton channel instance

const connectRabbitMQ = async (timeout = 15000, interval = 500) => {
	const startTime = Date.now();

	while (!channel) {
		try {
			const connection = await amqp.connect(process.env.RABBITMQ_URL);
			channel = await connection.createChannel();
			logInfo("Connected to RabbitMQ Event Bus and created Channel.");

			process.on("exit", () => {
				channel.close();
				logInfo("RabbitMQ channel closed");
			});
			process.on("SIGINT", () => {
				connection.close();
				logInfo("RabbitMQ Event Bus connection closed due to app termination");
				process.exit(0);
			});
		} catch (error) {
			if (Date.now() - startTime >= timeout) {
				logError(
					"Failed to connect to RabbitMQ Event Bus after multiple attempts:",
					error
				);
				throw error;
			}
			await new Promise((resolve) => setTimeout(resolve, interval)); // Wait before retrying
		}
	}
	return channel;
};

export default connectRabbitMQ;
