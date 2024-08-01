import express from "express";
import dotenv from "dotenv";
import expenseRoutes from "./routes/expenseRoutes.js";
import { errorHandlingMiddleware, initLogger } from "@expensio/sharedlib";
import bodyParser from "body-parser";
import connectDB from "./config/db.js";
import cors from "cors";

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
app.use(cors());

// Use routes
app.use("/api/expenses", expenseRoutes);

const PORT = process.env.PORT || 3001;
connectDB();

app.listen(PORT, () => {
	console.log("Server started on port " + PORT);

	/* Add data insertion functions below */
	/* WARNING: Comment them and move them out of app.listen after one time insertion.*/
});

// addPsychologicalTypes();
// addCategories();
