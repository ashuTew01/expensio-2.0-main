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
import { financialdataUpdatedExpenseEventHandler } from "../events/handlers/financialdataUpdatedExpenseEventHandler.js";
import { financialdataUpdatedIncomeEventHandler } from "../events/handlers/financialdataUpdatedIncomeEventHandler.js";

let producer; // Global producer
let consumer; // Global consumer

/**
 * Establishes a connection to the Kafka Event Bus and subscribes to events.
 *
 * The events and their corresponding handlers are as follows:
 * - EXPENSE_CREATED: addExpenseToDashboardService
 * - INCOME_CREATED: addIncomeToDashboardService
 * - EXPENSE_DELETED: removeExpensesFromDashboardService
 * - INCOME_DELETED: removeIncomesFromDashboardService
 * - FINANCIALDATA_UPDATED_EXPENSE: updateExpenseFinancialDataService
 * - FINANCIALDATA_UPDATED_INCOME: updateIncomeFinancialDataService
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
			[EVENTS.EXPENSE_CREATED]: expenseCreatedEventHandler,
			[EVENTS.INCOME_CREATED]: incomeCreatedEventHandler,
			[EVENTS.EXPENSE_DELETED]: expenseDeletedEventHandler,
			[EVENTS.INCOME_DELETED]: incomeDeletedEventHandler,
			[EVENTS.FINANCIALDATA_UPDATED_EXPENSE]:
				financialdataUpdatedExpenseEventHandler,
			[EVENTS.FINANCIALDATA_UPDATED_INCOME]:
				financialdataUpdatedIncomeEventHandler,
		};

		// Call the consumeEvent function with the handlers and topics
		await consumeEvent(
			eventHandlers,
			[TOPICS.EXPENSE, TOPICS.INCOME, TOPICS.FINANCIALDATA],
			consumer,
			producer
		);

		logInfo("Kafka setup completed successfully.");
	} catch (error) {
		logError(`Failed to start Kafka services: \n ${error}`);
		process.exit(1);
	}
};
