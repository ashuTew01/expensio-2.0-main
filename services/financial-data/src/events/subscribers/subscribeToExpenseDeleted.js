import { logError, EVENTS, subscribeEvent } from "@expensio/sharedlib";
import { removeFinancialDataService } from "../../services/financialDataService.js";

export const subscribeToExpensesDeleted = async (channel) => {
	const eventName = EVENTS.EXPENSE_DELETED;
	try {
		await subscribeEvent(
			eventName,
			"financial-data-service-expenses-deleted",
			async ({ data, headers }) => {
				await removeFinancialDataService(data);
			},
			channel
		);
	} catch (error) {
		logError(`FAILED TO SUBSCRIBE TO ${eventName}.`);
		logError(error.message);
		throw error;
	}
};
