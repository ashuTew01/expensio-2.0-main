import { logError, EVENTS, subscribeEvent } from "@expensio/sharedlib";
import { removeExpenseFinancialDataService } from "../../services/financialDataService.js";

export const subscribeToExpensesDeleted = async (channel) => {
	const eventName = EVENTS.EXPENSE_DELETED;
	try {
		await subscribeEvent(
			eventName,
			"financial-data-service-expenses-deleted",
			async ({ data, headers }) => {
				await removeExpenseFinancialDataService(data);
			},
			channel
		);
	} catch (error) {
		logError(`FAILED TO SUBSCRIBE TO ${eventName}.`);
		logError(error.message);
		throw error;
	}
};
