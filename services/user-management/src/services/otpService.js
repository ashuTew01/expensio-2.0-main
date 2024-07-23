import twilioClient from "../config/twilio.js";
import * as otpModel from "../models/otpModel.js";
import * as userService from "../services/userService.js";
import crypto from "crypto";
import generateToken from "../utils/generateToken.js";
import pool from "../config/db.js";

const generateOTP = () => {
	return crypto.randomInt(100000, 999999).toString(); // 6 digit otp
};

export const handleSendOTPService = async (phone) => {
	const otpRequest = await otpModel.findOtpRequestByPhoneModel(phone);

	if (otpRequest) {
		const now = new Date();
		if (otpRequest.is_blocked_until > now) {
			throw new Error(
				`User is blocked from receiving OTPs. Try again after ${otpRequest.is_blocked_until}`
			);
		}
		if (otpRequest.request_count >= 3) {
			// reset request_count to avoid permanent block
			await otpModel.updateOtpRequestModel(phone, {
				is_blocked_until: new Date(now.getTime() + 60 * 60 * 1000), // Block for 1 hour
				request_count: 0, // to avoid permanent blocking
			});
			throw new Error("Too many OTP requests. Please try after 1 hour.");
		}
	}

	const otp = generateOTP();

	// Send OTP via SMS using Twilio
	await twilioClient.messages.create({
		to: phone,
		from: process.env.TWILIO_PHONE_NUMBER,
		body: `Your OTP is: ${otp}`,
	});

	const otpExpiry = new Date(new Date().getTime() + 30 * 60 * 1000); // OTP expire time (currently set to 30 minutes)

	// update or create OTP request record
	const result = await otpModel.createOrUpdateOtpRequestModel({
		phone,
		otp,
		last_request_time: new Date(),
		otp_expiry: otpExpiry,
		request_count: otpRequest ? otpRequest.request_count + 1 : 1,
	});

	return { message: "OTP sent successfully.", userExists: result.user_exists };
};

export const handleVerifyOTPService = async (
	phone,
	otp,
	userData,
	haveToCreateUser
) => {
	const client = await pool.connect();
	try {
		await client.query("BEGIN");

		const otpRequest = await otpModel.findOtpRequestByPhoneModel(phone, client);
		if (
			!otpRequest ||
			otpRequest.otp !== otp ||
			otpRequest.otp_expiry < new Date()
		) {
			throw new Error("OTP is invalid or has expired.");
		}

		if (haveToCreateUser && !otpRequest.user_exists) {
			const newUser = await userService.createUserService(userData, client);
			await otpModel.markUserExistsModel(phone, client);
			const token = generateToken({ id: newUser.id, phone: newUser.phone });

			await otpModel.resetOtpRequestModel(phone, client);

			await client.query("COMMIT");
			return {
				user: newUser,
				token,
				message: "User registered and logged in successfully.",
			};
		}

		if (!haveToCreateUser && otpRequest.user_exists) {
			const user = await userService.findUserByPhoneService(phone, client);
			const token = generateToken({ id: user.id, phone: user.phone });

			await otpModel.resetOtpRequestModel(phone, client);

			await client.query("COMMIT");
			return { user, token, message: "User logged in successfully." };
		}

		throw new Error("Invalid operation.");
	} catch (error) {
		await client.query("ROLLBACK");
		console.error("Error handling OTP verification:", error);
		throw new Error("Failed to verify OTP and handle user registration/login.");
	} finally {
		client.release();
	}
};
