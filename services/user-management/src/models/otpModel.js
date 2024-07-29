import pool from "../config/db.js";
import DatabaseError from "../errors/DatabaseError.js";
import NotFoundError from "../errors/NotFoundError.js";

export const findOtpRequestByPhoneModel = async (phone, client = pool) => {
	const query = `SELECT * FROM otp_requests WHERE phone = $1;`;
	try {
		const { rows } = await client.query(query, [phone]);
		return rows[0];
	} catch (error) {
		throw new DatabaseError("Failed to retrieve OTP request from the database");
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
	{ phone, otp, last_request_time, otp_expiry, request_count },
	client = pool
) => {
	const query = `
			INSERT INTO otp_requests (phone, otp, last_request_time, otp_expiry, request_count)
			VALUES ($1, $2, $3, $4, $5)
			ON CONFLICT (phone) DO UPDATE
			SET otp = EXCLUDED.otp, last_request_time = EXCLUDED.last_request_time, otp_expiry = EXCLUDED.otp_expiry, request_count = EXCLUDED.request_count
			RETURNING *;
	`;
	const values = [phone, otp, last_request_time, otp_expiry, request_count];
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
	{ is_blocked_until, request_count },
	client = pool
) => {
	const query = `
			UPDATE otp_requests SET is_blocked_until = $1, request_count = $2 WHERE phone = $3;
	`;
	const values = [is_blocked_until, request_count, phone];
	try {
		const { rowCount } = await client.query(query, values);
		if (rowCount === 0) {
			throw new NotFoundError(
				`No OTP request found for phone ${phone} to update.`
			);
		}
	} catch (error) {
		throw new DatabaseError("Failed to update OTP request in the database");
	}
};

export const markUserExistsModel = async (phone, client = pool) => {
	const query = `
			UPDATE otp_requests SET user_exists = TRUE WHERE phone = $1 RETURNING *;
	`;
	const result = await client.query(query, [phone]);
	if (result.rowCount === 0) {
		throw new NotFoundError(
			`No OTP request found for phone ${phone} to update.`
		);
	}
};

export const resetOtpRequestModel = async (phone, client = pool) => {
	const query = `
			UPDATE otp_requests
			SET otp = '0', request_count = 0, is_blocked_until = NULL
			WHERE phone = $1 RETURNING *;
	`;
	const result = await client.query(query, [phone]);
	if (result.rowCount === 0) {
		throw new NotFoundError(
			`No OTP request found for phone ${phone} to reset.`
		);
	}
};
