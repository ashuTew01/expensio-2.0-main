import { connectKafka } from "./connectKafka.js";
import {
	logInfo,
	logError,
	consumeEvent,
	EVENTS,
	TOPICS,
} from "@expensio/sharedlib";
import { expenseCreatedEventHandler } from "../events/handlers/expenseCreatedEventHandler.js";
import { incomeCreatedEventHandler } from "../events/handlers/incomeCreatedEventHandler.js";
import { expenseDeletedEventHandler } from "../events/handlers/expenseDeletedEventHandler.js";
import { incomeDeletedEventHandler } from "../events/handlers/incomeDeletedEventHandler.js";

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

		// Define event handlers for various event names
		const eventHandlers = {
			[EVENTS.EXPENSE_CREATED]: expenseCreatedEventHandler,
			[EVENTS.INCOME_CREATED]: incomeCreatedEventHandler,
			[EVENTS.EXPENSE_DELETED]: expenseDeletedEventHandler,
			[EVENTS.INCOME_DELETED]: incomeDeletedEventHandler,
		};

		// Call the consumeEvent function with the handlers and topics
		await consumeEvent(
			eventHandlers,
			[TOPICS.EXPENSE, TOPICS.INCOME],
			consumer,
			producer
		);

		logInfo("Kafka setup completed successfully.");
	} catch (error) {
		logError(`Failed to start Kafka services: \n ${error}`);
		process.exit(1);
	}
};
