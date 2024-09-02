import { logError, EVENTS, subscribeEvent } from "@expensio/sharedlib";
import { addExpenseFinancialDataService } from "../../services/financialDataService.js";

export const subscribeToExpenseCreated = async (channel) => {
	const eventName = EVENTS.EXPENSE_CREATED;
	try {
		await subscribeEvent(
			eventName,
			"financial-data-service-expense-created",
			async ({ data, headers }) => {
				await addExpenseFinancialDataService(data);
			},
			channel
		);
	} catch (error) {
		logError(`FAILED TO SUBSCRIBE TO ${eventName}.`);
		logError(error.message);
		throw error;
	}
};
