import {
	InternalServerError,
	logWarning,
	subscribeEvent,
} from "@expensio/sharedlib";
import { EVENTS, logError, logInfo } from "@expensio/sharedlib";
import { undoDeleteUserService } from "../../services/userService.js";

export const subscribeToUserDeletionFailed = async (channel) => {
	// console.log(EVENTS);
	await subscribeEvent(
		EVENTS.USER_DELETION_FAILED,
		"user-service-deletion-failed",
		async ({ data, headers }) => {
			const { userId, userPhone } = data;
			try {
				logWarning(
					`Some issue removing User ${userId}, phone: ${userPhone} by other Services. Rolling Back the soft deletion...`
				);
				await undoDeleteUserService(userId, userPhone);
				logInfo(
					`User with id ${userId}, and phone ${userPhone} restored successfully.`
				);
			} catch (error) {
				logError(
					`User with id ${userId}, and phone ${userPhone} COULD NOT BE RESTORED. DATABASE INCONSISTENT.`
				);
				throw new InternalServerError("Failed to undo user deletion");

				// LATER::::, publish another event or take other measures if this fails
			}
		},
		channel
	);
};
