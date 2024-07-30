import twilioClient from "../config/twilio.js";
import * as otpModel from "../models/otpModel.js";
import * as userService from "../services/userService.js";
import crypto from "crypto";
import generateToken from "../utils/generateToken.js";
import pool from "../config/db.js";

import RateLimitError from "../errors/otp/RateLimitError.js";
import OtpSendingError from "../errors/otp/OtpSendingError.js";

import ValidationError from "../errors/ValidationError.js";
import InternalServerError from "../errors/InternalServerError.js";

const generateOTP = () => {
	return crypto.randomInt(100000, 999999).toString(); // 6 digit otp
};

export const handleSendOTPService = async (phone) => {
	const otpRequest = await otpModel.findOtpRequestByPhoneModel(phone);

	if (otpRequest) {
		const now = new Date();
		if (otpRequest.is_blocked_until > now) {
			throw new RateLimitError(
				`User is blocked from receiving OTPs. Try again after ${otpRequest.is_blocked_until}`
			);
		}
		if (otpRequest.request_count >= 50) {
			// reset request_count to avoid permanent block
			await otpModel.updateOtpRequestModel(phone, {
				is_blocked_until: new Date(now.getTime() + 60 * 60 * 1000), // Block for 1 hour
				request_count: 0, // to avoid permanent blocking
			});
			throw new RateLimitError(
				"Too many OTP requests. Please try after 1 hour."
			);
		}
	}

	const otp = generateOTP();

	const otpExpiry = new Date(new Date().getTime() + 30 * 60 * 1000); // OTP expire time (currently set to 30 minutes)

	// update or create OTP request record
	const result = await otpModel.createOrUpdateOtpRequestModel({
		phone,
		otp,
		last_request_time: new Date(),
		otp_expiry: otpExpiry,
		request_count: otpRequest ? otpRequest.request_count + 1 : 1,
	});

	const environment = process.env.NODE_ENV;
	if (environment !== "development") {
		// Send OTP via SMS using Twilio
		try {
			await twilioClient.messages.create({
				to: phone,
				from: process.env.TWILIO_PHONE_NUMBER,
				body: `Your OTP is: ${otp}`,
			});
		} catch (error) {
			throw new OtpSendingError("Failed to send OTP via SMS");
		}
	}

	return {
		message: "OTP sent successfully.",
		userExists: result.user_exists,
		otp: environment === "development" ? otp : null,
	};
};

export const handleVerifyOTPService = async (phone, otp, userData) => {
	const client = await pool.connect();
	try {
		await client.query("BEGIN");

		const otpRequest = await otpModel.findOtpRequestByPhoneModel(phone, client);
		if (
			!otpRequest ||
			otpRequest.otp !== otp ||
			otpRequest.otp_expiry < new Date()
		) {
			throw new ValidationError("OTP is invalid or has expired.");
		}
		const userExists = otpRequest.user_exists;
		let user;
		if (!userExists) {
			// check for required userData fields only when user creation necessary
			if (
				!userData ||
				!userData.firstName ||
				!userData.username ||
				!userData.phone
			) {
				throw new ValidationError(
					"Missing required user data fields: firstName, username, and phone are required."
				);
			}
			user = await userService.createUserService(userData, client);
			await otpModel.markUserExistsModel(phone, client);
		} else {
			user = await userService.findUserByPhoneService(phone, client);
		}
		const token = generateToken({ id: user.id, phone: user.phone });
		await otpModel.resetOtpRequestModel(phone, client);
		await client.query("COMMIT");

		const message = userExists
			? "User logged in successfully."
			: "User registered and logged in successfully.";
		return { user, token, message };
	} catch (error) {
		await client.query("ROLLBACK");
		console.error("Error handling OTP verification:", error);
		throw new InternalServerError(
			"Failed to verify OTP and handle user registration/login."
		);
	} finally {
		client.release();
	}
};
