import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import {
	MainContainer,
	ChatContainer,
	MessageList,
	Message,
	MessageInput,
	Avatar,
	ConversationHeader,
} from "@chatscope/chat-ui-kit-react";
import { Box, IconButton } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import "../chatbot/index.css"; // Custom styles for positioning

const ChatBot = () => {
	const [isOpen, setIsOpen] = useState(false); // To handle open/close state
	const [messages, setMessages] = useState([]); // Messages state
	const [inputMessage, setInputMessage] = useState(""); // Input message state
	const [socketConnected, setSocketConnected] = useState(false); // Socket connection state
	const socket = useRef(null); // Using useRef to persist socket instance

	useEffect(() => {
		// Establish socket connection
		const token = JSON.parse(localStorage.getItem("tokenExpensio"));
		socket.current = io("http://expensio.com", {
			path: "/ws/smart-chat",
			query: {
				token: `Bearer ${token}`,
			},
		});

		socket.current.on("connect", () => {
			setSocketConnected(true);
			console.log(`Connected with id: ${socket.current.id}`);
		});

		socket.current.on("response", (data) => {
			if (data.message) {
				setMessages((prev) => [
					...prev,
					{ message: data.message, direction: "incoming" },
				]);
			}
		});

		socket.current.on("financial-data", (data) => {
			const formattedData = JSON.stringify(data.message, null, 2);
			setMessages((prev) => [
				...prev,
				{ message: `Financial Data:\n${formattedData}`, direction: "incoming" },
			]);
		});

		socket.current.on("error", (data) => {
			setMessages((prev) => [
				...prev,
				{ message: `Error: ${data.message}`, direction: "incoming" },
			]);
		});

		socket.current.on("disconnect", () => {
			setSocketConnected(false);
		});

		return () => {
			if (socket.current) socket.current.disconnect();
		};
	}, []);

	const handleSend = () => {
		if (inputMessage.trim() !== "") {
			setMessages((prev) => [
				...prev,
				{ message: inputMessage, direction: "outgoing" },
			]);
			socket.current.emit("chat_message", inputMessage); // Send message to server
			setInputMessage(""); // Clear input
		}
	};

	const toggleChatWindow = () => {
		setIsOpen(!isOpen);
	};

	return (
		<Box className="chatbot-container">
			<IconButton className="chat-toggle-btn" onClick={toggleChatWindow}>
				{isOpen ? <CloseIcon /> : <ChatIcon />}
			</IconButton>
			{isOpen && (
				<Box className="chat-window">
					<MainContainer>
						<ChatContainer>
							<ConversationHeader>
								<Avatar
									name="Emily"
									src="https://chatscope.io/storybook/react/assets/emily-xzL8sDL2.svg"
								/>
								<ConversationHeader.Content
									info="Active 10 mins ago"
									userName="Emily"
								/>
							</ConversationHeader>
							<MessageList>
								{messages.map((msg, index) => (
									<Message
										key={index}
										model={{ message: msg.message, direction: msg.direction }}
									/>
								))}
							</MessageList>
							<MessageInput
								placeholder="Type your message here..."
								value={inputMessage}
								onChange={(val) => setInputMessage(val)}
								onSend={handleSend}
								attachButton={false}
								style={{ textAlign: "left" }}
							/>
						</ChatContainer>
					</MainContainer>
				</Box>
			)}
		</Box>
	);
};

export default ChatBot;
