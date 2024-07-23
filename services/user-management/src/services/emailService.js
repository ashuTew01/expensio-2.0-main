import nodemailer from "nodemailer";
import * as userModel from "../models/userModel.js";

const transporter = nodemailer.createTransport({
	host: "smtp.zoho.in",
	port: 587,
	secure: false,
	auth: {
		user: process.env.EMAIL_FOR_SMTP,
		pass: process.env.EMAIL_PASSWORD,
	},
});

const sendEmail = async ({ from, to, subject, html }) => {
	try {
		const info = await transporter.sendMail({
			from,
			to,
			subject,
			html,
		});
		console.log("Email sent: %s", info.messageId);
	} catch (error) {
		console.error("Error sending email: ", error);
	}
};

const sendVerificationEmailService = async (userId) => {
	const user = await userModel.findUserByIdModel(userId);

	if (!user) {
		throw new Error("User not found.");
	}

	if (!user.email) {
		throw new Error("User does not have an email address.");
	}
	if (user.is_email_verified === true) {
		throw new Error("User's email is already verified.");
	}

	const isProd = process.env.NODE_ENV === "production";
	const emailVerificationToken = user.email_verification_token;
	const emailVerificationLink = `${isProd ? "https" : "http"}://${isProd ? process.env.PROD_DOMAIN : `localhost:${process.env.PORT}`}/api/users/verify-email?token=${emailVerificationToken}`;

	await sendEmail({
		from: `"Expensio" <${process.env.EMAIL_FOR_SMTP}>`,
		to: user.email,
		subject: "Please verify your email",
		html: `
					<h1>Welcome to Expensio!</h1>
					<p>Please click on the link below to verify your email address:</p>
					<a href="${emailVerificationLink}">Verify Email</a>
			`,
	});
};

export { sendEmail, sendVerificationEmailService };
