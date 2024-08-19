#!/bin/bash

# Create the base directory
mkdir -p financial-data/src/{config,controllers,events/subscribers,models,routes,services,utils,tests}

# Create .env file
echo "Creating .env file..."
cat <<EOL > financial-data/.env
MONGO_URI=mongodb://localhost:27017/financialdata
RABBITMQ_URL=amqp://localhost
PORT=3002
EOL

# Create .gitignore file
echo "Creating .gitignore file..."
cat <<EOL > financial-data/.gitignore
node_modules
logs
.env
EOL

# Create package.json file
echo "Creating package.json file..."
cat <<EOL > financial-data/package.json
{
  "name": "financial-data",
  "version": "1.0.0",
  "description": "Financial Data Microservice",
  "type": "module",
  "main": "src/utils/app.js",
  "scripts": {
    "start": "node src/utils/app.js",
    "dev": "nodemon src/utils/app.js",
    "test": "echo \\"Error: no test specified\\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@expensio/sharedlib": "^1.0.1",
    "amqplib": "^0.10.4",
    "body-parser": "^1.20.2",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "joi": "^17.13.3",
    "mongoose": "^8.5.2"
  }
}
EOL

# Copy existing config files (db.js, rabbitmq.js, startRabbitMQ.js)
cp ./expense/src/config/db.js financial-data/src/config/db.js
cp ./expense/src/config/rabbitmq.js financial-data/src/config/rabbitmq.js
cp ./expense/src/config/startRabbitMQ.js financial-data/src/config/startRabbitMQ.js

# Update startRabbitMQ.js to reference the new service's event subscribers
sed -i 's/subscribeToUserDeleted/subscribeToUserDeleted/g' financial-data/src/config/startRabbitMQ.js

# Create financialDataController.js
echo "Creating financialDataController.js..."
cat <<EOL > financial-data/src/controllers/financialDataController.js
import { getFinancialData } from "../services/financialDataService.js";

export const fetchFinancialData = async (req, res) => {
    try {
        const { userId } = req.params;
        const data = await getFinancialData(userId);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
EOL

# Create financialDataService.js
echo "Creating financialDataService.js..."
cat <<EOL > financial-data/src/services/financialDataService.js
import FinancialData from "../models/FinancialData.js";

export const getFinancialData = async (userId) => {
    return FinancialData.findOne({ userId });
};
EOL

# Create FinancialData.js (model)
echo "Creating FinancialData.js..."
cat <<EOL > financial-data/src/models/FinancialData.js
import mongoose from "mongoose";

const financialDataSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    expenses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Expense"
        }
    ],
    // Add more fields as needed
});

const FinancialData = mongoose.model("FinancialData", financialDataSchema);
export default FinancialData;
EOL

# Create financialDataRoutes.js
echo "Creating financialDataRoutes.js..."
cat <<EOL > financial-data/src/routes/financialDataRoutes.js
import express from "express";
import { fetchFinancialData } from "../controllers/financialDataController.js";

const router = express.Router();

router.get("/financial-data/:userId", fetchFinancialData);

export default router;
EOL

# Create app.js
echo "Creating app.js..."
cat <<EOL > financial-data/src/utils/app.js
import express from "express";
import dotenv from "dotenv";
import financialDataRoutes from "../routes/financialDataRoutes.js";
import {
    errorHandlingMiddleware,
    initLogger,
    logError,
    logInfo
} from "@expensio/sharedlib";
import bodyParser from "body-parser";
import connectDB from "../config/db.js";
import cors from "cors";
import startRabbitMQ from "../config/startRabbitMQ.js";

// Load environment variables from .env file
dotenv.config();

// log setup
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logDirectory = path.join(__dirname, "..", "..", "logs");
initLogger(logDirectory);

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(errorHandlingMiddleware);
app.use(cors());

// Use routes
app.use("/api", financialDataRoutes);

const PORT = process.env.PORT || 3003;

const startServices = async () => {
    try {
        await startRabbitMQ();
        await connectDB();
    } catch (error) {
        logError("Failed to start services:", error);
        process.exit(1);
    }
};

startServices();

app.listen(PORT, () => {
    logInfo("Financial Data service is running on port " + PORT);
});
EOL

echo "Blueprint for Financial Data microservice created successfully."
