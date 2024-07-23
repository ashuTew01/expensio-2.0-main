// User Controller
import * as userService from "../services/userService.js";
import * as otpService from "../services/otpService.js";
import { sendVerificationEmailService } from "../services/emailService.js";
import jwt from "jsonwebtoken";

//prefix /api/users

// POST @ /send-otp PUBLIC
const sendOTPController = async (req, res) => {
	const { phone } = req.body;
	try {
		const { message, userExists } =
			await otpService.handleSendOTPService(phone);
		res.status(200).json({ message, userExists });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};
// POST @ /verify-otp PUBLIC
const verifyOTPController = async (req, res) => {
	const { phone, otp, userData, haveToCreateUser } = req.body;
	try {
		const result = await otpService.handleVerifyOTPService(
			phone,
			otp,
			userData,
			haveToCreateUser
		);
		if (result.token) {
			res.status(200).json(result);
		} else {
			res.status(401).json({
				message: "OTP verification failed or registration required",
				details: result,
			});
		}
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};
// GET @ /send-verification-email PRIVATE
const sendVerificationEmailController = async (req, res) => {
	try {
		const userId = req.user.id;
		await sendVerificationEmailService(userId);
		res.status(200).send({ message: "Verification email sent successfully." });
	} catch (error) {
		console.error("Error sending verification email: ", error);
		res.status(500).send({
			message: "An error occurred while sending the verification email.",
		});
	}
};

// GET @ /verify-email PUBLIC
const verifyEmailController = async (req, res) => {
	try {
		const { token } = req.query;
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		await userService.verifyUserEmailService(decoded.email);
		res.status(200).json({ message: "Email verified successfully" });
	} catch (error) {
		console.log(error);
		res.status(400).json({ error: "Invalid or expired token" });
	}
};

// PUT @ /user PRIVATE
const updateProfileController = async (req, res) => {
	try {
		const userId = req.user.id;
		const {
			username,
			email,
			first_name,
			last_name,
			profile_picture_url,
			bio,
			date_of_birth,
		} = req.body;
		const updates = {
			username,
			email,
			first_name,
			last_name,
			profile_picture_url,
			bio,
			date_of_birth,
		};

		const updatedUser = await userService.updateUserProfileService(
			userId,
			updates
		);
		res.status(200).json(updatedUser);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: error.message });
	}
};

// DELETE @ /user PRIVATE
const deleteUserController = async (req, res) => {
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
		console.error("Error deleting user: ", error);
		res
			.status(500)
			.send({ message: "An error occurred while processing your request." });
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
