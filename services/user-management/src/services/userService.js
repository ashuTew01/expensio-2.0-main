import * as userModel from "../models/userModel.js";
import * as otpModel from "../models/otpModel.js";
import pool from "../config/db.js";
import { sendVerificationEmailService } from "../services/emailService.js";

import { NotFoundError, InternalServerError } from "@expensio/sharedlib";

export const createUserService = async (userData) => {
	let user;
	try {
		user = await userModel.createUserModel(userData);
	} catch (error) {
		throw new InternalServerError("Failed to create user.");
	}

	// Verifying email
	if (user.email) {
		try {
			await sendVerificationEmailService(user.id);
		} catch (error) {
			console.log("Error sending email verification: \n", error);
		}
	}

	return user;
};

export const findUserByPhoneService = async (phone) => {
	try {
		return await userModel.findUserByPhoneModel(phone);
	} catch (error) {
		throw new NotFoundError("User not found by phone.");
	}
};

export const updateUserProfileService = async (userId, updates) => {
	try {
		return await userModel.updateUserProfileModel(userId, updates);
	} catch (error) {
		throw new InternalServerError("Failed to update user profile.");
	}
};

export const verifyUserEmailService = async (email) => {
	try {
		await userModel.verifyUserEmailModel(email);
	} catch (error) {
		throw new InternalServerError("Failed to verify user email.");
	}
};

export const deleteUserService = async (userId, userPhone) => {
	const client = await pool.connect();
	try {
		await client.query("BEGIN");

		await otpModel.deleteOtpRequestsByPhoneModel(userPhone, client);
		const rowsDeleted = await userModel.deleteUserModel(userId, client);

		if (rowsDeleted === 0) {
			throw new NotFoundError("User not found for deletion.");
		}

		await client.query("COMMIT");
		return rowsDeleted;
	} catch (error) {
		await client.query("ROLLBACK");
		throw new InternalServerError("Failed to delete user and OTP requests.");
	} finally {
		client.release();
	}
};
