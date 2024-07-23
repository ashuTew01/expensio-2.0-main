import pool from "../config/db.js";
import jwt from "jsonwebtoken";

export const createUserModel = async (userData, client = pool) => {
	const {
		phone,
		firstName,
		username,
		lastName,
		email,
		profilePictureUrl,
		bio,
		dateOfBirth,
	} = userData;
	const email_verification_token = email
		? jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "30d" })
		: null;
	const query = `
        INSERT INTO users (phone, first_name, username, last_name, email, profile_picture_url, bio, date_of_birth, email_verification_token)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *;
    `;
	const values = [
		phone,
		firstName,
		username,
		lastName,
		email,
		profilePictureUrl,
		bio,
		dateOfBirth,
		email_verification_token,
	];
	try {
		const { rows } = await client.query(query, values);
		return rows[0];
	} catch (error) {
		console.error("Error creating user:", error);
		throw new Error("Failed to create user.");
	}
};

export const findUserByPhoneModel = async (phone, client = pool) => {
	const query = `
        SELECT id, username, email, first_name, last_name, profile_picture_url, bio, date_of_birth,
                is_email_verified, created_at, updated_at FROM users WHERE phone = $1;
    `;
	try {
		const { rows } = await client.query(query, [phone]);
		return rows[0];
	} catch (error) {
		console.error("Error finding user by phone:", error);
		throw new Error("Failed to find user by phone.");
	}
};

export const findUserByIdModel = async (userId, client = pool) => {
	const query = "SELECT * FROM users WHERE id = $1";
	try {
		const result = await client.query(query, [userId]);
		return result.rows[0];
	} catch (error) {
		console.error("Error finding user by ID:", error);
		throw new Error("Failed to find user by ID.");
	}
};

export const verifyUserEmailModel = async (email, client = pool) => {
	const query = "UPDATE users SET is_email_verified = true WHERE email = $1";
	try {
		await client.query(query, [email]);
	} catch (error) {
		console.error(`Error verifying user email: ${email} \n`, error);
		throw new Error("Failed to verify user email.");
	}
};

export const deleteUserModel = async (userId, client = pool) => {
	const query = "DELETE FROM users WHERE id = $1";
	try {
		const result = await client.query(query, [userId]);
		return result.rowCount;
	} catch (error) {
		console.error("Error deleting user:", error);
		throw new Error("Failed to delete user.");
	}
};

export const updateUserProfileModel = async (
	userId,
	updates,
	client = pool
) => {
	const {
		username,
		email,
		first_name,
		last_name,
		profile_picture_url,
		bio,
		date_of_birth,
	} = updates;

	const query = `
        UPDATE users
        SET
            username = COALESCE($2, username),
            email = COALESCE($3, email),
            first_name = COALESCE($4, first_name),
            last_name = COALESCE($5, last_name),
            profile_picture_url = COALESCE($6, profile_picture_url),
            bio = COALESCE($7, bio),
            date_of_birth = COALESCE($8, date_of_birth),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING username, email, first_name, last_name, profile_picture_url, bio, date_of_birth;
    `;
	const values = [
		userId,
		username,
		email,
		first_name,
		last_name,
		profile_picture_url,
		bio,
		date_of_birth,
	];

	try {
		const { rows } = await client.query(query, values);
		return rows[0];
	} catch (error) {
		console.error("Error updating user profile:", error);
		throw new Error("Failed to update user profile.");
	}
};
