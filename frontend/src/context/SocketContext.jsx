import React, {
	createContext,
	useContext,
	useRef,
	useEffect,
	useState,
} from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => {
	return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
	const [socket, setSocket] = useState(null); // State to store the socket instance
	const socketRef = useRef(null);

	useEffect(() => {
		// Initialize the socket connection
		const token = JSON.parse(localStorage.getItem("tokenExpensio"));
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
	}, []);

	// Pass the socket instance via context once it's initialized
	return (
		<SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
	);
};
