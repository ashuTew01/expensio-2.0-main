import { connectKafka } from "./connectKafka.js";
import { logInfo, logError } from "@expensio/sharedlib";
// import { subscribeToX } from "../events/subscribers/subscribeToX.js"; // Event subscribers

let producer; // Global producer
let consumer; // Global consumer

export const startKafka = async () => {
	try {
		logInfo("Connecting to Kafka Event Bus...");

		const { producerInstance, consumerInstance } = await connectKafka(
			45000,
			500
		);
		producer = producerInstance;
		consumer = consumerInstance;

		logInfo("Subscribing to Events...");

		// Subscribe to events
		// await subscribeToX(consumer);

		logInfo("Subscription to Events Complete...");
		logInfo("Kafka setup completed successfully.");
	} catch (error) {
		logError("Failed to start Kafka services:", error);
		process.exit(1);
	}
};
