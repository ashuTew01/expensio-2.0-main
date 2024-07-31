import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import expenseRoutes from "./routes/expenseRoutes.js";
import { errorHandlingMiddleware, initLogger } from "@expensio/sharedlib";
import bodyParser from "body-parser";

// Load environment variables from .env file
dotenv.config();

//log setup
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logDirectory = path.join(__dirname, "..", "logs");
initLogger(logDirectory);

const app = express();

// Middleware to parse JSON
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(errorHandlingMiddleware);

// Use routes
app.use("/api/expenses", expenseRoutes);

// MongoDB connection
mongoose
	.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log("MongoDB connected");
		app.listen(process.env.PORT || 5000, () => {
			console.log(`Server running on port ${process.env.PORT || 5000}`);
		});
	})
	.catch((err) => console.error(err));
