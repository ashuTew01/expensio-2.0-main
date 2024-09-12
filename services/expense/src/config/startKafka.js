import { userDeletedEventHandler } from "../events/handlers/userDeletedEventHandler.js";
import { connectKafka } from "./connectKafka.js";
import {
	logInfo,
	logError,
	consumeEvent,
	EVENTS,
	TOPICS,
} from "@expensio/sharedlib";

let producer; // Global producer
let consumer; // Global consumer

/**
 * Establishes a connection to the Kafka Event Bus and subscribes to events.
 *
 * The events and their corresponding handlers are as follows:
 * - USER_DELETED: userDeletedEventHandler
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
		const eventHandlers = {
			[EVENTS.USER_DELETED]: userDeletedEventHandler,
		};

		// Call the consumeEvent function with the handlers and topics
		await consumeEvent(eventHandlers, [TOPICS.USER], consumer, producer);

		logInfo("Kafka setup completed successfully.");
	} catch (error) {
		logError(`Failed to start Kafka services: \n ${error}`);
		process.exit(1);
	}
};
