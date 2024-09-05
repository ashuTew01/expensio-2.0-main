import { Server } from "socket.io";
import { handleUserInputController } from "../controllers/smartChatController.js";
import jwt from "jsonwebtoken";

let io;

export const initializeWebSocket = (server) => {
	io = new Server(server, {
		cors: {
			origin: "*",
		},
	});
	io.use((socket, next) => {
		const token = socket.handshake.query.token?.split(" ")[1]; // Extract Bearer token from query string

		if (token) {
			try {
				const decoded = jwt.verify(token, process.env.JWT_SECRET);
				socket.user = decoded;
				socket.token = token;
				next(); // Allow the connection
			} catch (error) {
				next(new Error("Authentication error: Invalid token"));
			}
		} else {
			next(new Error("Authentication error: No token provided"));
		}
	});

	io.on("connection", (socket) => {
		console.log(`New client connected: ${socket.id}`);

		// Listen for chat_message events and handle input
		socket.on("chat_message", (message) =>
			handleUserInputController(message, socket)
		);
		// Handle more custom events here

		socket.on("disconnect", () => {
			console.log(`Client disconnected: ${socket.id}`);
		});
	});
};

// This function can be used in other parts of the app to emit events
export const getIoInstance = () => {
	if (!io) {
		throw new Error("WebSocket not initialized");
	}
	return io;
};
