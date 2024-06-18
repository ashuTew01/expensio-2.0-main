import dotenv from "dotenv";
import pg from "pg";
dotenv.config();
const { Pool } = pg;

const pool = new Pool({
	connectionString: `postgresql://${process.env.DB_USER}:${encodeURIComponent(
		process.env.DB_PASSWORD
	)}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`,
});

pool.query("SELECT NOW()", (err, res) => {
	if (err) {
		console.error("Connection test failed:", err);
	} else {
		console.log("Connection test succeeded:", res.rows);
	}
	pool.end();
});
