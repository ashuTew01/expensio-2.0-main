import mongoose from "mongoose";
import UserTokens from "../models/UserTokens.js";
import AiSubscription from "../models/AiSubscription.js";
import { logInfo, ValidationError } from "@expensio/sharedlib";
import config from "../config/config.js";

const FREE_SUBSCRIPTION_INITIAL_TOKENS =
	config.FREE_SUBSCRIPTION_INITIAL_TOKENS;

/**
 * Adds a new subscription to the database.
 * @param {String} name - Name of the subscription.
 * @param {Number} monthlyTokens - The number of tokens available per month in this subscription.
 * @returns {Promise<Object>} - Returns the created subscription object.
 * @throws {ValidationError} - Throws an error if validation fails.
 */
export const addSubscriptionToDb = async (name, monthlyTokens) => {
	if (!name || typeof name !== "string") {
		throw new ValidationError(`Invalid subscription name: ${name}.}`);
	}

	// Validate monthlyTokens
	if (
		typeof monthlyTokens !== "number" ||
		monthlyTokens < 0 ||
		monthlyTokens > 10000 // You can adjust the upper limit as per your app's requirements
	) {
		throw new ValidationError(
			`Invalid token value: ${monthlyTokens}. Tokens should be a positive number and less than 1,000,000.`
		);
	}

	// Check for duplicate subscription
	const existingSubscription = await AiSubscription.findOne({ name });
	if (existingSubscription) {
		throw new ValidationError(
			`Subscription with name '${name}' already exists. Please use a unique name.`
		);
	}

	// Create new subscription
	const newSubscription = new AiSubscription({
		name,
		monthlyTokens,
	});

	// Save the subscription in the database
	try {
		const savedSubscription = await newSubscription.save();
		return savedSubscription;
	} catch (error) {
		throw new Error(`Failed to add subscription to DB: ${error.message}`);
	}
};

/**
 * Assigns or updates a user's subscription and adds tokens to the user's current balance.
 * Adds new subscription tokens even if an active subscription exists.
 * Uses a MongoDB transaction to ensure data integrity.
 *
 * @param {Number} userId - The ID of the user.
 * @param {String} subscriptionCode - The code (unique) of the AiSubscription.
 * @returns {Promise<Object>} - The updated UserTokens document.
 * @throws {ValidationError} - Throws an error if validation fails or if the subscription or user is not found.
 */
export const assignSubscriptionToUser = async (userId, subscriptionCode) => {
	const session = await mongoose.startSession();
	session.startTransaction(); // Start the transaction

	try {
		// Validate userId
		if (typeof userId !== "number") {
			throw new ValidationError(
				`Invalid userId: ${userId}. UserId must be a number.`
			);
		}

		// Validate subscriptionId
		if (!subscriptionCode) {
			throw new ValidationError(
				`Invalid subscriptionCode: ${subscriptionCode}. Please provide a valid subscriptionCode.`
			);
		}

		// Find the subscription
		const subscription = await AiSubscription.findOne({
			code: subscriptionCode,
		}).session(session);

		if (!subscription) {
			throw new ValidationError(
				`Subscription with code '${subscriptionCode}' not found.`
			);
		}

		let initialTokens = subscription.monthlyTokens;

		if (subscriptionCode === "free") {
			initialTokens = initialTokens + FREE_SUBSCRIPTION_INITIAL_TOKENS;
		}

		// Find or create the user's tokens entry
		let userTokens = await UserTokens.findOne({ userId }).session(session);
		const currentDate = new Date();

		if (!userTokens) {
			// If userTokens record doesn't exist, create a new one
			userTokens = new UserTokens({
				userId,
				aiSubscriptionId: subscription._id,
				currentTokens: initialTokens, // Start with monthly tokens from the new subscription
				lastRefillDate: currentDate,
			});
		} else {
			// Add the new subscription's monthlyTokens to the current balance
			userTokens.currentTokens += subscription.monthlyTokens;

			// Update the user's subscription and refill date
			userTokens.aiSubscriptionId = subscription._id;
			userTokens.lastRefillDate = currentDate;
		}

		// Save the user tokens in a transaction
		const updatedUserTokens = await userTokens.save({ session });

		// Commit the transaction
		await session.commitTransaction();
		session.endSession();

		return updatedUserTokens;
	} catch (error) {
		await session.abortTransaction();
		session.endSession();
		throw new Error(`Failed to assign subscription to user: ${error.message}`);
	}
};

/**
 * Retrieves the AI tokens for a user.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<Object>} - The user's AI tokens document.
 * @throws {Error} - If there's an error fetching the user's AI tokens.
 */

export const getUserAiTokensDetailsService = async (userId) => {
	let session;
	try {
		let userTokens = await UserTokens.findOne({ userId }).populate({
			path: "aiSubscriptionId",
			model: "AiSubscription",
		});
		if (userTokens) {
			return userTokens;
		}

		// start transation if no userTokens are found
		session = await mongoose.startSession();
		session.startTransaction();

		// check again that no userTokens created by other request during lookup
		userTokens = await UserTokens.findOne({ userId })
			.populate({
				path: "aiSubscriptionId",
				model: "AiSubscription",
			})
			.session(session);

		if (!userTokens) {
			await assignSubscriptionToUser(userId, "free", session);

			// Re-fetch
			userTokens = await UserTokens.findOne({ userId })
				.populate({
					path: "aiSubscriptionId",
					model: "AiSubscription",
				})
				.session(session);
		}

		// Commit the transaction if everything is successful
		await session.commitTransaction();
		session.endSession();

		return userTokens;
	} catch (error) {
		// Handle the case where an error occurs and abort the transaction if needed
		if (session && session.inTransaction()) {
			await session.abortTransaction();
			session.endSession();
		}
		throw new Error(`Failed to get user tokens: ${error.message}`);
	}
};

export const resetGuestAiTokensService = async (aiTokensToReset = 50) => {
	const session = await mongoose.startSession();
	session.startTransaction();
	try {
		logInfo(`Resetting Guest user tokens to ${aiTokensToReset}.`);
		const userTokens = await UserTokens.findOne({ userId: 0 }).session(session);
		// if (!userTokens) {
		// 	// If userTokens record doesn't exist, create a new one
		// 	userTokens = new UserTokens({
		// 		userId: 0,
		// 		aiSubscriptionId: subscription._id,
		// 		currentTokens: subscription.monthlyTokens, // Start with monthly tokens from the new subscription
		// 		lastRefillDate: currentDate,
		// 	});
		// }

		userTokens.currentTokens = aiTokensToReset;
		await userTokens.save({ session });
		await session.commitTransaction();
		session.endSession();
		logInfo(`Guest user tokens reset to ${aiTokensToReset} tokens`);
		return userTokens;
	} catch (error) {
		await session.abortTransaction();
		session.endSession();
		throw new Error(`Failed to reset guest user tokens: ${error.message}`);
	}
};
