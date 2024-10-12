import pool from "../config/db.js";
import jwt from "jsonwebtoken";
import { DatabaseError, NotFoundError } from "@expensio/sharedlib";

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
        RETURNING id, phone, first_name, last_name, username, email, profile_picture_url, bio, date_of_birth;
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
		throw new DatabaseError("Failed to create user.");
	}
};

export const findUserByPhoneModel = async (phone, client = pool) => {
	const query = `
        SELECT id, phone, first_name, last_name, username, email, profile_picture_url, bio, date_of_birth FROM users WHERE phone = $1;
    `;
	try {
		const { rows } = await client.query(query, [phone]);
		if (rows.length === 0) {
			throw new NotFoundError("User not found.");
		}
		return rows[0];
	} catch (error) {
		throw new DatabaseError("Failed to find user by phone.");
	}
};

export const findUserByEmailModel = async (email, client = pool) => {
	const query = `
		SELECT id, phone, first_name, last_name, username, email, profile_picture_url, bio, date_of_birth FROM users WHERE email = $1;
	`;
	try {
		const { rows } = await client.query(query, [email]);
		if (rows.length === 0) {
			throw new NotFoundError("User not found.");
		}
		return rows[0];
	} catch (error) {
		throw new DatabaseError("Failed to find user by email.");
	}
};

export const findIfUserExistsByPhoneOrEmailModel = async (
	phone,
	email,
	client = pool
) => {
	let query;
	let values;

	if (email) {
		// If email is provided, query by email
		query = `
			SELECT id FROM users WHERE email = $1;
		`;
		values = [email];
	} else if (phone) {
		// If email is not provided, query by phone
		query = `
			SELECT id FROM users WHERE phone = $1;
		`;
		values = [phone];
	} else {
		// If neither email nor phone is provided, throw an error
		throw new Error("Either phone or email must be provided.");
	}

	try {
		const { rows } = await client.query(query, values);
		return rows.length !== 0;
	} catch (error) {
		throw new DatabaseError("Failed to find user by phone or email.");
	}
};

export const findUserByIdModel = async (userId, client = pool) => {
	const query =
		"SELECT id, phone, first_name, last_name,  username,  email, profile_picture_url, bio, date_of_birth FROM users WHERE id = $1";
	try {
		const result = await client.query(query, [userId]);
		if (result.rows.length === 0) {
			throw new NotFoundError("User not found.");
		}
		return result.rows[0];
	} catch (error) {
		throw new DatabaseError("Failed to find user by ID.");
	}
};

export const verifyUserEmailModel = async (email, client = pool) => {
	const query =
		"UPDATE users SET is_email_verified = true WHERE email = $1 RETURNING *";
	try {
		const result = await client.query(query, [email]);
		if (result.rowCount === 0) {
			throw new NotFoundError("Email not found for verification.");
		}
	} catch (error) {
		throw new DatabaseError("Failed to verify user email.");
	}
};

export const deleteUserModel = async (userId, client = pool) => {
	const query = "DELETE FROM users WHERE id = $1";
	try {
		const result = await client.query(query, [userId]);
		if (result.rowCount === 0) {
			throw new NotFoundError("User not found.");
		}
		return result.rowCount;
	} catch (error) {
		throw new DatabaseError("Failed to delete user.");
	}
};

export const deleteUserByPhoneOrEmailModel = async (
	phone,
	email,
	client = pool
) => {
	let query;
	let values;

	if (email) {
		// If email is provided, delete based on email
		query = "DELETE FROM users WHERE email = $1";
		values = [email];
	} else if (phone) {
		// If email is not provided, delete based on phone
		query = "DELETE FROM users WHERE phone = $1";
		values = [phone];
	} else {
		// If neither phone nor email is provided, throw an error
		throw new Error("Either phone or email must be provided.");
	}

	try {
		await client.query(query, values);
	} catch (error) {
		throw new DatabaseError("Failed to delete user by phone or email.");
	}
};

export const softDeleteUserModel = async (userId, client = pool) => {
	const query = "UPDATE users SET deleted = TRUE WHERE id = $1;";
	try {
		const result = await client.query(query, [userId]);
		if (result.rowCount === 0) {
			throw new NotFoundError("User not found.");
		}
		return result.rowCount;
	} catch (error) {
		throw new DatabaseError("Failed to delete user.");
	}
};

export const undoSoftDeleteUserModel = async (userId, client = pool) => {
	const query = "UPDATE users SET deleted = FALSE WHERE id = $1;";
	try {
		const result = await client.query(query, [userId]);
		if (result.rowCount === 0) {
			throw new NotFoundError("User not found.");
		}
		return result.rowCount;
	} catch (error) {
		throw new DatabaseError("Failed to delete user.");
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
            first_name = COALESCE($3, first_name),
            last_name = COALESCE($4, last_name),
            profile_picture_url = COALESCE($5, profile_picture_url),
            bio = COALESCE($6, bio),
            date_of_birth = COALESCE($7, date_of_birth),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING username, email, first_name, last_name, profile_picture_url, bio, date_of_birth;
    `;
	const values = [
		userId,
		username,
		first_name,
		last_name,
		profile_picture_url,
		bio,
		date_of_birth,
	];

	try {
		const { rows } = await client.query(query, values);
		if (rows.length === 0) {
			throw new NotFoundError("User not found for update.");
		}
		return rows[0];
	} catch (error) {
		throw new DatabaseError("Failed to update user profile.");
	}
};
