#!/bin/bash

# Create the base directory for the orchestrator service
mkdir -p orchestrator-service/src/{config,controllers,events,models,routes,services,utils,tests}

# Create .env file
echo "Creating .env file..."
cat <<EOL > orchestrator-service/.env
MONGO_URI=mongodb://localhost:27017/orchestrator
RABBITMQ_URL=amqp://localhost
PORT=3003
EOL

# Create .gitignore file
echo "Creating .gitignore file..."
cat <<EOL > orchestrator-service/.gitignore
node_modules
logs
.env
EOL

# Create package.json file
echo "Creating package.json file..."
cat <<EOL > orchestrator-service/package.json
{
  "name": "orchestrator-service",
  "version": "1.0.0",
  "description": "Saga Orchestrator Service",
  "type": "module",
  "main": "src/utils/app.js",
  "scripts": {
    "start": "node src/utils/app.js",
    "dev": "nodemon src/utils/app.js",
    "test": "echo \\"Error: no test specified\\" && exit 1"
  },
  "dependencies": {
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

# Copy existing RabbitMQ config files from other services
cp ./expense/src/config/rabbitmq.js orchestrator-service/src/config/rabbitmq.js
cp ./expense/src/config/startRabbitMQ.js orchestrator-service/src/config/startRabbitMQ.js

# Create orchestratorController.js
echo "Creating orchestratorController.js..."
cat <<EOL > orchestrator-service/src/controllers/orchestratorController.js
import { startUserDeletionSaga } from "../services/orchestratorService.js";

export const initiateUserDeletion = async (req, res) => {
    try {
        const { userId } = req.body;
        await startUserDeletionSaga(userId);
        res.status(200).json({ message: "User deletion process started." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
EOL

# Create orchestratorService.js
echo "Creating orchestratorService.js..."
cat <<EOL > orchestrator-service/src/services/orchestratorService.js
import { sendDeleteUserCommand, sendDeleteExpensesCommand } from "../events/sagaCommands.js";

export const startUserDeletionSaga = async (userId) => {
    // Step 1: Start by sending a command to delete the user
    await sendDeleteUserCommand(userId);

    // Step 2: If successful, proceed to delete the expenses
    await sendDeleteExpensesCommand(userId);

    // Additional steps and state management can be implemented here
};
EOL

# Create sagaCommands.js
echo "Creating sagaCommands.js..."
cat <<EOL > orchestrator-service/src/events/sagaCommands.js
import { publishToQueue } from "../config/rabbitmq.js";

export const sendDeleteUserCommand = async (userId) => {
    const command = {
        type: "DELETE_USER",
        userId
    };
    await publishToQueue("user-service-commands", command);
};

export const sendDeleteExpensesCommand = async (userId) => {
    const command = {
        type: "DELETE_EXPENSES",
        userId
    };
    await publishToQueue("expense-service-commands", command);
};
EOL

# Create app.js
echo "Creating app.js..."
cat <<EOL > orchestrator-service/src/utils/app.js
import express from "express";
import dotenv from "dotenv";
import { initiateUserDeletion } from "../controllers/orchestratorController.js";
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

// Routes
app.post("/api/saga/user-deletion", initiateUserDeletion);

const PORT = process.env.PORT || 3004;

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
    logInfo("Orchestrator service is running on port " + PORT);
});
EOL

echo "Orchestrator Service blueprint created successfully."
