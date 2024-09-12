import { connectKafka } from "./connectKafka.js";
import { logInfo, logError, consumeEvent } from "@expensio/sharedlib";

let producer; // Global producer
let consumer; // Global consumer

/**
 * Establishes a connection to the Kafka Event Bus and subscribes to events.
 *
 * The events and their corresponding handlers are as follows:
 *
 * This function will log an error and terminate the process if a connection to
 * the Kafka Event Bus cannot be established.
 */
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

		// Define event handlers for various event names
		const eventHandlers = {};

		// Call the consumeEvent function with the handlers and topics
		await consumeEvent(eventHandlers, [], consumer, producer);

		logInfo("Kafka setup completed successfully.");
	} catch (error) {
		logError(`Failed to start Kafka services: \n ${error}`);
		process.exit(1);
	}
};
