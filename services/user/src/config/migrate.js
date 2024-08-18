import fs from "fs";
import path from "path";
import pool from "./db.js";
import { logError, logInfo } from "@expensio/sharedlib";

const migrate = async (direction) => {
	const migrationsDir = path.join(
		path.resolve(),
		`src/migrations/${direction}`
	);
	const files = fs.readdirSync(migrationsDir);

	for (const file of files) {
		const filePath = path.join(migrationsDir, file);
		const sql = fs.readFileSync(filePath, "utf-8");
		await pool.query(sql);
		logInfo(`Executed ${file}`);
	}

	pool.end();
};

const direction = process.argv[2];

if (!["up", "down"].includes(direction)) {
	logError('Invalid migration direction. Please specify "up" or "down".');
	process.exit(1);
}

migrate(direction).catch((err) => {
	logError("Migration error:", err);
	process.exit(1);
});
