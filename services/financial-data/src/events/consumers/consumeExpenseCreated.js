import { consumeEvent, EVENTS, TOPICS, logError } from "@expensio/sharedlib";
import { addExpenseFinancialDataService } from "../../services/financialDataService.js";

export const consumeExpenseCreated = async (consumer) => {
	const eventName = EVENTS.EXPENSE_CREATED;
	const topicName = TOPICS.EXPENSE;
	try {
		await consumeEvent(
			eventName,
			topicName,
			async ({ key, message }) => {
				const { data, eventId } = message;
				await addExpenseFinancialDataService(data);
			},
			consumer // Kafka consumer instance
		);
	} catch (error) {
		logError(`FAILED TO SUBSCRIBE TO ${eventName}.`);
		logError(error.message);
		throw error;
	}
};
