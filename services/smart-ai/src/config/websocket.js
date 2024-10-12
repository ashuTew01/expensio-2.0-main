import { Server } from "socket.io";
import { handleUserInputController } from "../controllers/smartChatController.js";
import { logInfo } from "@expensio/sharedlib";
import jwt from "jsonwebtoken";

let io;

/**
 * Initializes the WebSocket server and sets up authentication using Bearer tokens.
 * @param {http.Server} server The HTTP server to attach the WebSocket server to.
 * @returns {void}
 */
export const initializeWebSocket = (server) => {
	io = new Server(server, {
		path: "/ws/smart-chat",
		cors: {
			origin: "*",
		},
	});
	io.use((socket, next) => {
		const token = socket.handshake.query.token?.split(" ")[1]; // Extract Bearer token from query string

		if (token) {
			try {
				if (token === "guest") {
					socket.user = {
						id: 0,
						phone: "+911234567890",
						email: "guest@test.com",
					};
				} else {
					const decoded = jwt.verify(token, process.env.JWT_SECRET);
					socket.user = decoded;
				}
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
		logInfo(`New client connected, Socket ID: ${socket.id}`);

		// Listen for chat_message events and handle input
		socket.on("chat_message", (message) =>
			handleUserInputController(message, socket)
		);
		// Handle more custom events here

		socket.on("disconnect", () => {
			logInfo(`Client disconnected: ${socket.id}`);
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
