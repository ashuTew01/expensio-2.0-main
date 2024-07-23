import * as userModel from "../models/userModel.js";
import * as otpModel from "../models/otpModel.js";
import pool from "../config/db.js";
import { sendVerificationEmailService } from "../services/emailService.js";

export const createUserService = async (userData) => {
	const user = await userModel.createUserModel(userData);
	// verifying email
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
	return await userModel.findUserByPhoneModel(phone);
};

export const updateUserProfileService = async (userId, updates) => {
	try {
		const updatedUser = await userModel.updateUserProfileModel(userId, updates);
		return updatedUser;
	} catch (error) {
		console.error("Error updating user profile:", error);
		throw new Error("Failed to update user profile.");
	}
};

export const verifyUserEmailService = async (email) => {
	try {
		const user = await userModel.verifyUserEmailModel(email);
		return user;
	} catch (error) {
		throw new Error("Error finding user.");
	}
};

export const deleteUserService = async (userId, userPhone) => {
	const client = await pool.connect();
	try {
		await client.query("BEGIN");

		await otpModel.deleteOtpRequestsByPhoneModel(userPhone, client);
		const rowsDeleted = await userModel.deleteUserModel(userId, client);

		await client.query("COMMIT");
		return rowsDeleted;
	} catch (error) {
		await client.query("ROLLBACK");
		console.error("Error deleting user and OTP requests:", error);
		throw new Error("Failed to delete user and OTP requests.");
	} finally {
		client.release();
	}
};
