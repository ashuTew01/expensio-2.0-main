import jwt from "jsonwebtoken";

const generateToken = (payload) => {
	return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "5d" });
};

export default generateToken;
