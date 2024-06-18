// User Controller
import * as userService from "../services/userService.js";
import { sendEmail } from "../services/emailService.js";
import jwt from "jsonwebtoken";

const isProd = process.env.NODE_ENV === "production";

const register = async (req, res) => {
	try {
		const user = await userService.registerUser(req.body);
		const verificationToken = user.verification_token;
		console.log(user);
		const verificationLink = `${isProd ? "https" : "http"}://${
			isProd ? process.env.PROD_DOMAIN : `localhost:${process.env.PORT}`
		}/api/users/verify-email?token=${verificationToken}`;

		await sendEmail({
			from: `"Expensio" <${process.env.EMAIL_FOR_SMTP}>`,
			to: user.email,
			subject: "Please verify your email",
			html: `
        <h1>Welcome to Expensio!</h1>
        <p>Please click on the link below to verify your email address:</p>
        <a href="${verificationLink}">Verify Email</a>
      `,
		});

		res.status(201).json({
			message:
				"User registered. Please check your email to verify your account.",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: error.message });
	}
};

const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await userService.authenticateUser(email, password);
		if (user) {
			const token = jwt.sign(
				{ id: user.id, email: user.email },
				process.env.JWT_SECRET,
				{ expiresIn: "30d" }
			);
			res.status(200).json({ token });
		} else {
			res.status(401).json({ error: "Invalid email or password" });
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({
			error: "We're having trouble logging you in! Please try again.",
		});
	}
};

const verifyEmail = async (req, res) => {
	try {
		const { token } = req.query;
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		await userService.verifyUserEmail(decoded.email);
		res.status(200).json({ message: "Email verified successfully" });
	} catch (error) {
		console.log(error);
		res.status(400).json({ error: "Invalid or expired token" });
	}
};

const requestPasswordReset = async (req, res) => {
	try {
		const { email } = req.body;
		const token = await userService.createPasswordResetToken(email);
		const passwordResetLink = `${isProd ? "https" : "http"}://${
			isProd ? process.env.PROD_DOMAIN : `localhost:${process.env.PORT}`
		}/reset-password?token=${token}`;

		await sendEmail({
			from: `"Expensio" <${process.env.EMAIL_FOR_SMTP}>`,
			to: email,
			subject: "Reset Password Request",
			html: `
        <h1>Welcome to Expensio!</h1>
        <p>Please click on the link below to reset your password:</p>
        <a href="${passwordResetLink}">Reset Password</a>
      `,
		});

		res
			.status(200)
			.json({ message: "Password reset token sent to the user email." });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

const resetPasswordController = async (req, res) => {
	try {
		const { token, newPassword } = req.body;
		await userService.resetPasswordService(token, newPassword);
		res.json({ message: "Password successfully reset." });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

const updateProfile = async (req, res) => {
	try {
		const userId = req.user.id;
		const updatedUser = await userService.updateUserProfile(userId, req.body);
		res.status(200).json(updatedUser);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

const getUserByEmailController = async (req, res) => {
	try {
		const { email } = req.user;
		const user = await userService.getUserByEmail(email);
		res.status(200).json(user);
	} catch (error) {
		console.log(error);
		res.status(400).json({ error: "Something went wrong!" });
	}
};

const deleteUserController = async (req, res) => {
	try {
		const userId = req.user.id;
		const rowsDeleted = await userService.deleteUserService(userId);
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
	register,
	login,
	verifyEmail,
	requestPasswordReset,
	resetPasswordController,
	updateProfile,
	getUserByEmailController,
	deleteUserController,
};
