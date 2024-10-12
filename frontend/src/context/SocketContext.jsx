import React, {
	createContext,
	useContext,
	useRef,
	useEffect,
	useState,
} from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => {
	return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
	const [socket, setSocket] = useState(null); // State to store the socket instance
	const socketRef = useRef(null);

	const token = useSelector((state) => state.auth.token);

	useEffect(() => {
		// If the token doesn't exist, don't make the socket connection
		if (!token) {
			console.log("Token not found, socket connection will not be made.");
			return; // Early exit if no token is present
		}

		// Initialize the socket connection
		socketRef.current = io("http://expensio.com", {
			path: "/ws/smart-chat",
			query: {
				token: `Bearer ${token}`,
			},
		});

		// Once the socket is initialized, set it in state
		setSocket(socketRef.current);

		// Optionally log the socket connection status
		socketRef.current.on("connect", () => {
			console.log("Socket connected:", socketRef.current.id);
		});
		socketRef.current.on("disconnect", () => {
			console.log("Socket disconnected");
		});

		return () => {
			if (socketRef.current) {
				socketRef.current.disconnect();
			}
		};
	}, [token]);

	// Pass the socket instance via context once it's initialized
	return (
		<SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
	);
};
