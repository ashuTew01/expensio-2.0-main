import { logError, EVENTS, subscribeEvent } from "@expensio/sharedlib";
import { removeIncomeFinancialDataService } from "../../services/financialDataService.js";

export const subscribeToIncomesDeleted = async (channel) => {
	const eventName = EVENTS.INCOME_DELETED;
	try {
		await subscribeEvent(
			eventName,
			"financial-data-service-incomes-deleted",
			async ({ data, headers }) => {
				await removeIncomeFinancialDataService(data);
			},
			channel
		);
	} catch (error) {
		logError(`FAILED TO SUBSCRIBE TO ${eventName}.`);
		logError(error.message);
		throw error;
	}
};
