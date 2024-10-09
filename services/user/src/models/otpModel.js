import pool from "../config/db.js";
import { DatabaseError, logError, NotFoundError } from "@expensio/sharedlib";

export const findOtpRequestByPhoneModel = async (phone, client = pool) => {
	const query = `SELECT * FROM otp_requests WHERE phone = $1;`;
	try {
		const { rows } = await client.query(query, [phone]);
		return rows[0];
	} catch (error) {
		throw new DatabaseError("Failed to retrieve OTP request from the database");
	}
};

export const findOtpRequestByEmailModel = async (email, client = pool) => {
	const query = `SELECT * FROM otp_requests WHERE email = $1;`;
	try {
		const { rows } = await client.query(query, [email]);
		return rows[0];
	} catch (error) {
		throw new DatabaseError(
			"Failed to retrieve OTP requests from the database"
		);
	}
};

export const updateOtpRequestPhoneModel = async (
	phone,
	email,
	client = pool
) => {
	const query = `
        UPDATE otp_requests 
        SET phone = $1 
        WHERE email = $2 
        RETURNING *;
    `;
	try {
		const { rows } = await client.query(query, [phone, email]);
		return rows[0];
	} catch (error) {
		logError(error);
		throw new DatabaseError(
			"Failed to update OTP requests' phone in the database using email"
		);
	}
};

export const updateOtpRequestEmailModel = async (
	phone,
	email,
	client = pool
) => {
	const query = `
        UPDATE otp_requests 
        SET email = $1 
        WHERE phone = $2 
        RETURNING *;
    `;
	try {
		const { rows } = await client.query(query, [email, phone]);
		return rows[0];
	} catch (error) {
		logError(error);
		throw new DatabaseError(
			"Failed to update OTP requests' phone in the database using phone"
		);
	}
};

export const deleteOtpRequestsByPhoneModel = async (
	userPhone,
	client = pool
) => {
	const query = "DELETE FROM otp_requests WHERE phone = $1 RETURNING *;";
	try {
		const result = await client.query(query, [userPhone]);
		if (result.rowCount === 0) {
			throw new NotFoundError(
				`No OTP request found for phone ${userPhone} to delete.`
			);
		}
	} catch (error) {
		throw new DatabaseError(
			"Failed to delete OTP requests due to a database error."
		);
	}
};

export const createOrUpdateOtpRequestModel = async (
	{ phone, email, otp, last_request_time, otp_expiry, request_count },
	client = pool
) => {
	let query;
	let values;

	if (email) {
		// If email is provided, use it for insert/update
		query = `
		INSERT INTO otp_requests (email, otp, last_request_time, otp_expiry, request_count)
		VALUES ($1, $2, $3, $4, $5)
		ON CONFLICT (email) DO UPDATE
		SET otp = EXCLUDED.otp, last_request_time = EXCLUDED.last_request_time, otp_expiry = EXCLUDED.otp_expiry, request_count = EXCLUDED.request_count
		RETURNING *;
	  `;
		values = [email, otp, last_request_time, otp_expiry, request_count];
	} else if (phone) {
		// If email is not provided, fallback to phone
		query = `
		INSERT INTO otp_requests (phone, otp, last_request_time, otp_expiry, request_count)
		VALUES ($1, $2, $3, $4, $5)
		ON CONFLICT (phone) DO UPDATE
		SET otp = EXCLUDED.otp, last_request_time = EXCLUDED.last_request_time, otp_expiry = EXCLUDED.otp_expiry, request_count = EXCLUDED.request_count
		RETURNING *;
	  `;
		values = [phone, otp, last_request_time, otp_expiry, request_count];
	} else {
		// If neither email nor phone is provided, throw an error
		throw new Error("Either phone or email must be provided.");
	}

	try {
		const { rows } = await client.query(query, values);
		return rows[0];
	} catch (error) {
		throw new DatabaseError(
			"Failed to create or update OTP request in the database"
		);
	}
};

export const updateOtpRequestModel = async (
	phone,
	email,
	{ is_blocked_until, request_count },
	client = pool
) => {
	let query;
	let values;

	if (email) {
		// If email is provided, update based on email
		query = `
		UPDATE otp_requests 
		SET is_blocked_until = $1, request_count = $2 
		WHERE email = $3;
	  `;
		values = [is_blocked_until, request_count, email];
	} else if (phone) {
		// If no email, update based on phone
		query = `
		UPDATE otp_requests 
		SET is_blocked_until = $1, request_count = $2 
		WHERE phone = $3;
	  `;
		values = [is_blocked_until, request_count, phone];
	} else {
		throw new Error("Either email or phone must be provided");
	}
	try {
		const { rowCount } = await client.query(query, values);
		if (rowCount === 0) {
			throw new NotFoundError(
				`No OTP request found for given phone/email to update.`
			);
		}
	} catch (error) {
		throw new DatabaseError("Failed to update OTP request in the database");
	}
};

export const markUserExistsModel = async (phone, email, client = pool) => {
	let query;
	let values;

	if (email) {
		// If email is provided, update based on email
		query = `
			UPDATE otp_requests SET user_exists = TRUE WHERE email = $1 RETURNING *;
		`;
		values = [email];
	} else if (phone) {
		// If email is not provided, update based on phone
		query = `
			UPDATE otp_requests SET user_exists = TRUE WHERE phone = $1 RETURNING *;
		`;
		values = [phone];
	} else {
		// If neither phone nor email is provided, throw an error
		throw new Error("Either phone or email must be provided.");
	}

	const result = await client.query(query, values);

	if (result.rowCount === 0) {
		throw new NotFoundError(
			`No OTP request found for ${email ? "email " + email : "phone " + phone} to update.`
		);
	}
};

export const markUserDoesNotExistsModel = async (phone, client = pool) => {
	const query = `
			UPDATE otp_requests SET user_exists = FALSE WHERE phone = $1 RETURNING *;
	`;
	const result = await client.query(query, [phone]);
	if (result.rowCount === 0) {
		throw new NotFoundError(
			`No OTP request found for phone ${phone} to update.`
		);
	}
};

export const resetOtpRequestModel = async (phone, email, client = pool) => {
	let query;
	let values;

	if (email) {
		// If email is provided, reset OTP request based on email
		query = `
			UPDATE otp_requests
			SET otp = '0', request_count = 0, is_blocked_until = NULL
			WHERE email = $1 RETURNING *;
		`;
		values = [email];
	} else if (phone) {
		// If email is not provided, reset OTP request based on phone
		query = `
			UPDATE otp_requests
			SET otp = '0', request_count = 0, is_blocked_until = NULL
			WHERE phone = $1 RETURNING *;
		`;
		values = [phone];
	} else {
		// If neither phone nor email is provided, throw an error
		throw new Error("Either phone or email must be provided.");
	}

	const result = await client.query(query, values);

	if (result.rowCount === 0) {
		throw new NotFoundError(
			`No OTP request found for ${email ? "email " + email : "phone " + phone} to reset.`
		);
	}
};
