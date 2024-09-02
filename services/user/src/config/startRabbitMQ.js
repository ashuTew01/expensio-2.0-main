import connectRabbitMQ from "./rabbitmq.js";
import { subscribeToUserDeletionFailed } from "../events/subscribers/subscribeToUserDeletionFailed.js";
import { logError, logInfo } from "@expensio/sharedlib";

let channel;

const startRabbitMQ = async () => {
	try {
		channel = await connectRabbitMQ();

		// Initialize event subscribers
		await subscribeToUserDeletionFailed(channel);
		// can initialize more event subscribers here

		logInfo("Events subscribed and RabbitMQ setup completed successfully.");
	} catch (error) {
		logError("Failed to start RabbitMQ services:", error);
		process.exit(1);
	}
};

export default startRabbitMQ;
