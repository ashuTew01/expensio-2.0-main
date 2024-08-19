import connectRabbitMQ from "./rabbitmq.js";
import { subscribeToUserDeleted } from "../../../expense/src/events/subscribers/subscribeToUserDeleted.js";
import { logError, logInfo } from "@expensio/sharedlib";
import { subscribeToExpenseCreated } from "../events/subscribers/subscribeToExpenseCreated.js";

let channel;

const startRabbitMQ = async () => {
	try {
		channel = await connectRabbitMQ();

		// Initialize event subscribers
		// await subscribeToUserDeleted(channel);
		await subscribeToExpenseCreated(channel);
		// can initialize more event subscribers here

		logInfo("RabbitMQ setup completed successfully.");
	} catch (error) {
		logError("Failed to start RabbitMQ services:", error);
		process.exit(1);
	}
};

export default startRabbitMQ;
