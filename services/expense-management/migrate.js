import fs from "fs";
import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pg;

const pool = new Pool({
	connectionString: `postgresql://${process.env.DB_USER}:${encodeURIComponent(
		process.env.DB_PASSWORD
	)}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`,
});

const migrate = async () => {
	const client = await pool.connect();
	try {
		const sql = fs.readFileSync(
			"migrations/001_create_expenses_table.sql",
			"utf8"
		);
		await client.query(sql);
		console.log("Migration completed successfully.");
	} catch (err) {
		console.error("Migration failed:", err);
	} finally {
		client.release();
	}
};

migrate();
