// User Service
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as userModel from "../models/userModel.js";

export const registerUser = async (userData) => {
	const { username, email, password, firstName, lastName } = userData;
	console.log(userData);
	const passwordHash = await bcrypt.hash(password, 10);
	const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, {
		expiresIn: "30d",
	});
	// console.log(verificationToken);
	return await userModel.createUser({
		username,
		email,
		passwordHash,
		firstName,
		lastName,
		verificationToken,
	});
};

export const authenticateUser = async (email, password) => {
	// console.log(email, password);
	const password_hash = await userModel.getPasswordHashByEmail(email);
	if (!password_hash) {
		return null;
	}
	const user = await userModel.getUserByEmail(email);
	if (user && (await bcrypt.compare(password, password_hash))) {
		return user;
	}
	return null;
};

//******** PASSWORD RESET STARTS ********** */
export const createPasswordResetToken = async (email) => {
	const user = await userModel.getUserByEmail(email);
	if (!user) {
		throw new Error("User not found");
	}
	const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, {
		expiresIn: "1h",
	});
	const query =
		"UPDATE users SET password_reset_token = $1, password_reset_token_expires = $2 WHERE email = $3";
	await pool.query(query, [resetToken, new Date(Date.now() + 3600000), email]);
	return resetToken;
};

export const resetPasswordService = async (token, newPassword) => {
	const decoded = jwt.verify(token, process.env.JWT_SECRET);
	const user = await userModel.getUserByEmail(decoded.email);
	if (
		!user ||
		user.password_reset_token !== token ||
		user.password_reset_token_expires < new Date()
	) {
		throw new Error("Invalid or expired token");
	}
	const passwordHash = await bcrypt.hash(newPassword, 10);
	const query =
		"UPDATE users SET password_hash = $1, password_reset_token = null, password_reset_token_expires = null WHERE email = $2";
	await pool.query(query, [passwordHash, decoded.email]);
};

//******** PASSWORD RESET ENDS ********** */

export const updateUserProfile = async (userId, userData) => {
	const { firstName, lastName, bio, dateOfBirth } = userData;
	const query = `
    UPDATE users SET first_name = $1, last_name = $2, bio = $3, date_of_birth = $4, updated_at = NOW()
    WHERE id = $5
    RETURNING id, username, email, first_name, last_name, bio, date_of_birth, profile_picture_url, is_active, is_verified, created_at, updated_at
  `;
	const values = [firstName, lastName, bio, dateOfBirth, userId];
	const { rows } = await pool.query(query, values);
	return rows[0];
};

export const getUserByEmail = userModel.getUserByEmail;
export const verifyUserEmail = userModel.verifyUserEmail;

export const deleteUserService = async (userId) => {
	return await userModel.deleteUser(userId);
};
