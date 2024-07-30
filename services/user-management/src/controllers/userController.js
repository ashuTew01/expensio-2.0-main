// User Controller
import * as userService from "../services/userService.js";
import * as otpService from "../services/otpService.js";
import { sendVerificationEmailService } from "../services/emailService.js";
import ValidationError from "../errors/ValidationError.js";

//prefix /api/users

// POST @ /send-otp PUBLIC
const sendOTPController = async (req, res, next) => {
	const { phone } = req.body;
	console.log(phone);
	// if(!phone) {
	// 	throw ValidationError("Please provide a valid phone number.")
	// }
	try {
		const { message, userExists, otp } =
			await otpService.handleSendOTPService(phone);
		res.status(200).json({ message, userExists, otp });
	} catch (error) {
		// res.status(error.statusCode || 400).json({ error: error.message });
		next(error);
	}
};

// POST @ /verify-otp PUBLIC
const verifyOTPController = async (req, res, next) => {
	const { phone, otp, userData } = req.body;
	try {
		const result = await otpService.handleVerifyOTPService(
			phone,
			otp,
			userData
		);
		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};

// GET @ /send-verification-email PRIVATE
const sendVerificationEmailController = async (req, res, next) => {
	try {
		const userId = req.user.id;
		await sendVerificationEmailService(userId);
		res.status(200).send({ message: "Verification email sent successfully." });
	} catch (error) {
		next(error);
	}
};

// GET @ /verify-email PUBLIC
const verifyEmailController = async (req, res, next) => {
	try {
		const { token } = req.query;
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		await userService.verifyUserEmailService(decoded.email);
		res.status(200).json({ message: "Email verified successfully" });
	} catch (error) {
		next(error);
	}
};

// PUT @ /user PRIVATE
const updateProfileController = async (req, res, next) => {
	try {
		const userId = req.user.id;
		const updates = req.body;
		const updatedUser = await userService.updateUserProfileService(
			userId,
			updates
		);
		res.status(200).json(updatedUser);
	} catch (error) {
		next(error);
	}
};

// DELETE @ /user PRIVATE
const deleteUserController = async (req, res, next) => {
	try {
		const userId = req.user.id;
		const userPhone = req.user.phone;

		const rowsDeleted = await userService.deleteUserService(userId, userPhone);
		if (rowsDeleted > 0) {
			res.status(200).send({ message: "User deleted successfully." });
		} else {
			res.status(404).send({ message: "User not found." });
		}
	} catch (error) {
		next(error);
	}
};

export {
	sendOTPController,
	verifyOTPController,
	sendVerificationEmailController,
	verifyEmailController,
	updateProfileController,
	deleteUserController,
};
