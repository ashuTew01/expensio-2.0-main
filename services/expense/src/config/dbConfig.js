import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const dbPool = new Pool({
	connectionString:
		process.env.DATABASE_URL ||
		`postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`,
	ssl:
		process.env.NODE_ENV === "production"
			? { rejectUnauthorized: false }
			: false,
});

export default dbPool;
