import { logError, logInfo } from "@expensio/sharedlib";
import amqp from "amqplib";

let channel; // singleton channel instance

const connectRabbitMQ = async () => {
	if (!channel) {
		try {
			const connection = await amqp.connect(process.env.RABBITMQ_URL);
			channel = await connection.createChannel();
			logInfo("Connected to RabbitMQ and channel created.");

			process.on("exit", () => {
				channel.close();
				logInfo("RabbitMQ channel closed");
			});
			process.on("SIGINT", () => {
				connection.close();
				logInfo("RabbitMQ connection closed due to app termination");
				process.exit(0);
			});
		} catch (error) {
			logError("Failed to connect to RabbitMQ:", error);
			throw error;
		}
	}
	return channel;
};

export default connectRabbitMQ;
