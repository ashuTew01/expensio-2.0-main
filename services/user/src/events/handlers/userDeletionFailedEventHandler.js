import {
	InternalServerError,
	logError,
	logInfo,
	logWarning,
} from "@expensio/sharedlib";
import { undoDeleteUserService } from "../../services/userService.js";

/**
 * Handles the USER_DELETION_FAILED event by undoing the soft deletion of the user.
 *
 * @param {Object} message - The event message.
 * @param {string} message.userId - The ID of the user.
 * @param {string} message.userPhone - The phone number of the user.
 * @returns {Promise<void>}
 */
export const userDeletionFailedEventHandler = async (message) => {
	const { userId, userPhone } = message;
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
};
