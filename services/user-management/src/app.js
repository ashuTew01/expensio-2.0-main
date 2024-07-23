import express from "express";
import dotenv from "dotenv";
dotenv.config();
import bodyParser from "body-parser";
import errorHandler from "./middlewares/errorHandler.js";
import userRoutes from "./routes/userRoutes.js";
import pool from "./config/db.js";
import { sendEmail } from "./services/emailService.js";
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/api/users", userRoutes);
app.use(errorHandler);

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
