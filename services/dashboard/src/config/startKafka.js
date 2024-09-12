import { connectKafka } from "./connectKafka.js";
import {
	logInfo,
	logError,
	consumeEvent,
	EVENTS,
	TOPICS,
} from "@expensio/sharedlib";
import {
	addExpenseToDashboardService,
	addIncomeToDashboardService,
	removeExpensesFromDashboardService,
	removeIncomesFromDashboardService,
	updateExpenseFinancialDataService,
	updateIncomeFinancialDataService,
} from "../services/dashboardService.js";

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
			[EVENTS.EXPENSE_CREATED]: async (message) => {
				await addExpenseToDashboardService(message);
			},
			[EVENTS.INCOME_CREATED]: async (message) => {
				await addIncomeToDashboardService(message);
			},
			[EVENTS.EXPENSE_DELETED]: async (message) => {
				await removeExpensesFromDashboardService(message);
			},
			[EVENTS.INCOME_DELETED]: async (message) => {
				await removeIncomesFromDashboardService(message);
			},
			[EVENTS.FINANCIALDATA_UPDATED_EXPENSE]: async (message) => {
				await updateExpenseFinancialDataService(message);
			},
			[EVENTS.FINANCIALDATA_UPDATED_INCOME]: async (message) => {
				await updateIncomeFinancialDataService(message);
			},
			// Add more handlers as needed
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
