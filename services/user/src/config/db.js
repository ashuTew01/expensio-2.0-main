// Database Configuration
import pkg from "pg";
const { Pool } = pkg;
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

// Read SSL certificate from file
const pool = new Pool({
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database: process.env.DB_NAME,
	password: process.env.DB_PASSWORD,
	port: process.env.DB_PORT,
	ssl: {
		rejectUnauthorized: true,
		ca: process.env.DB_AIVEN_POSTGRES_CERT, // ssl certificate file.
	},
});

export default pool;
