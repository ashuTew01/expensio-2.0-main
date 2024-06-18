import fs from "fs";
import path from "path";
import pool from "./db.js";

const migrate = async () => {
	const migrationsDir = path.join(path.resolve(), "src/migrations");
	const files = fs.readdirSync(migrationsDir);

	for (const file of files) {
		const filePath = path.join(migrationsDir, file);
		const sql = fs.readFileSync(filePath, "utf-8");
		await pool.query(sql);
		console.log(`Executed ${file}`);
	}

	pool.end();
};

migrate().catch((err) => {
	console.error(err);
	process.exit(1);
});
