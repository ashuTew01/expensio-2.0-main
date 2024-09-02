import connectRabbitMQ from "./rabbitmq.js";
// import { subscribeToUserDeleted } from "../events/subscribers/subscribeToUserDeleted.js";
import { logError, logInfo } from "@expensio/sharedlib";

let channel;

const startRabbitMQ = async () => {
	try {
		channel = await connectRabbitMQ();

		// Initialize event subscribers
		// await subscribeToUserDeleted(channel);
		// can initialize more event subscribers here

		logInfo("RabbitMQ setup completed successfully.");
	} catch (error) {
		logError("Failed to start RabbitMQ services:", error);
		process.exit(1);
	}
};

export default startRabbitMQ;
