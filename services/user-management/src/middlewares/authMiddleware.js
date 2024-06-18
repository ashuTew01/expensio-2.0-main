// Auth Middleware
import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
	const token = req.header("Authorization").replace("Bearer ", "");
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded;
		next();
	} catch (error) {
		res.status(401).json({ error: "Please authenticate." });
	}
};

export default authMiddleware;
