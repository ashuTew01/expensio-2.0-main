import connectRabbitMQ from "./rabbitmq.js";
import { logError, logInfo } from "@expensio/sharedlib";

let channel;

const startRabbitMQ = async () => {
	try {
		logInfo("Connecting to RabbitMQ Event Bus...");
		channel = await connectRabbitMQ(45000, 500);

		logInfo("Subscribing to Events...");
		// Initialize event subscribers
		// EXAMPLE:: await subscribeToUserDeleted(channel);
		logInfo("Subscription to Events Complete...");

		logInfo("RabbitMQ setup completed successfully.");
	} catch (error) {
		logError("Failed to start RabbitMQ services:", error);
		process.exit(1);
	}
};

export default startRabbitMQ;