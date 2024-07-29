import express from "express";
import dotenv from "dotenv";
dotenv.config();

const requiredEnvVars = [
	"NODE_ENV",
	"JWT_SECRET",
	"PORT",
	"EMAIL_PASSWORD",
	"EMAIL_FOR_SMTP",
	"PROD_DOMAIN",
	"TWILIO_ACCOUNT_SID",
	"TWILIO_AUTH_TOKEN",
	"TWILIO_PHONE_NUMBER",
	"DB_USER",
	"DB_PASSWORD",
	"DB_HOST",
	"DB_PORT",
	"DB_NAME",
	// "DB_AIVEN_POSTGRES_CERT",
];

const checkEnvVariables = () => {
	const unsetEnv = requiredEnvVars.filter(
		(envVar) => typeof process.env[envVar] === "undefined"
	);
	if (unsetEnv.length > 0) {
		console.error(
			`Required ENV variables are not set: [${unsetEnv.join(", ")}]`
		);
		process.exit(1);
	}
};

checkEnvVariables();

import bodyParser from "body-parser";
import { errorHandlingMiddleware } from "@expensio/sharedlib";
import userRoutes from "./routes/userRoutes.js";
import pool from "./config/db.js";
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/api/users", userRoutes);
app.use(errorHandlingMiddleware);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`User Management Service is running on port ${PORT}`);

	// sendEmail({
	// 	from: `"Test Server" <${process.env.EMAIL_FOR_SMTP}>`, // Replace with your actual email
	// 	to: "krishwave66@gmail.com",
	// 	subject: "Test Email from Node Server",
	// 	html: "<h1>Hello World!</h1><p>This is a test email sent automatically from the server.</p>",
	// });
});

process.on("SIGINT", () => {
	pool.end(() => {
		console.log("Pool has ended");
	});
});
