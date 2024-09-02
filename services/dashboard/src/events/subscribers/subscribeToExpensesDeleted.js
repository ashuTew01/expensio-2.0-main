import { logError, EVENTS, subscribeEvent } from "@expensio/sharedlib";
import { removeExpensesFromDashboardService } from "../../services/dashboardService.js";

export const subscribeToExpensesDeleted = async (channel) => {
	const eventName = EVENTS.EXPENSE_DELETED;
	try {
		await subscribeEvent(
			eventName,
			"dashboard-service-expense-deleted",
			async ({ data, headers }) => {
				await removeExpensesFromDashboardService(data);
			},
			channel
		);
	} catch (error) {
		logError(`FAILED TO SUBSCRIBE TO ${eventName}.`);
		logError(error.message);
		throw error;
	}
};
