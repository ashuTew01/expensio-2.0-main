import pool from "../config/db.js";

export const findOtpRequestByPhoneModel = async (phone, client = pool) => {
	const query = `
        SELECT * FROM otp_requests WHERE phone = $1;
    `;
	const { rows } = await client.query(query, [phone]);
	return rows[0];
};

export const deleteOtpRequestsByPhoneModel = async (
	userPhone,
	client = pool
) => {
	console.log(userPhone);
	const query = "DELETE FROM otp_requests WHERE phone = $1";
	try {
		await client.query(query, [userPhone]);
	} catch (error) {
		console.error("Error deleting OTP requests:", error);
		throw new Error("Failed to delete OTP requests.");
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

	const { rows } = await client.query(query, values);
	return rows[0];
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
	await client.query(query, values);
};

export const markUserExistsModel = async (phone, client = pool) => {
	const query = `
        UPDATE otp_requests SET user_exists = TRUE WHERE phone = $1;
    `;
	await client.query(query, [phone]);
};

export const resetOtpRequestModel = async (phone, client = pool) => {
	const query = `
			UPDATE otp_requests
			SET otp = '0', request_count = 0, is_blocked_until = NULL
			WHERE phone = $1;
	`;
	await client.query(query, [phone]);
};
