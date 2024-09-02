import { logError, EVENTS, subscribeEvent } from "@expensio/sharedlib";
import { addExpenseToDashboardService } from "../../services/dashboardService.js";

export const subscribeToExpenseCreated = async (channel) => {
	const eventName = EVENTS.EXPENSE_CREATED;
	try {
		await subscribeEvent(
			eventName,
			"dashboard-service-expense-created",
			async ({ data, headers }) => {
				await addExpenseToDashboardService(data);
			},
			channel
		);
	} catch (error) {
		logError(`FAILED TO SUBSCRIBE TO ${eventName}.`);
		logError(error.message);
		throw error;
	}
};
