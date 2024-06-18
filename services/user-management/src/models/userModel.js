// User Model
import pool from "../config/db.js";

export const createUser = async (userData) => {
	const {
		username,
		email,
		passwordHash,
		firstName,
		lastName,
		verificationToken,
	} = userData;
	const query = `
    INSERT INTO users (username, email, password_hash, first_name, last_name, verification_token)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, username, email, first_name, last_name, created_at, updated_at, verification_token
  `;
	const values = [
		username,
		email,
		passwordHash,
		firstName,
		lastName,
		verificationToken,
	];
	const { rows } = await pool.query(query, values);
	return rows[0];
};

export const getUserByEmail = async (email) => {
	const query = `
			SELECT id, username, email, first_name, last_name, profile_picture_url, bio, date_of_birth, 
						 is_active, is_verified, created_at, updated_at 
			FROM users 
			WHERE email = $1
	`;
	const { rows } = await pool.query(query, [email]);
	return rows[0];
};

export const verifyUserEmail = async (email) => {
	const query = "UPDATE users SET is_verified = true WHERE email = $1";
	await pool.query(query, [email]);
};

export const deleteUser = async (userId) => {
	const query = "DELETE FROM users WHERE id = $1";
	const result = await pool.query(query, [userId]);
	return result.rowCount; // returns nRows deleted
};

export const getPasswordHashByEmail = async (email) => {
	const query = "SELECT password_hash FROM users WHERE email = $1";
	try {
		const { rows } = await pool.query(query, [email]);
		if (rows.length > 0) {
			return rows[0].password_hash;
		} else {
			return null;
		}
	} catch (error) {
		console.error("Error fetching password hash: ", error);
		throw error;
	}
};
