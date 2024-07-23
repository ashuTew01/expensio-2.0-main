import fs from "fs";
import path from "path";
import pool from "./db.js";

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
		console.log(`Executed ${file}`);
	}

	pool.end();
};

const direction = process.argv[2];

if (!["up", "down"].includes(direction)) {
	console.error('Invalid migration direction. Please specify "up" or "down".');
	process.exit(1);
}

migrate(direction).catch((err) => {
	console.error("Migration error:", err);
	process.exit(1);
});
