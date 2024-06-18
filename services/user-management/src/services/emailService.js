import nodemailer from "nodemailer";

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

export { sendEmail };
