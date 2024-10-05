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
import { Box, IconButton, Typography } from "@mui/material";
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
			<IconButton
				className="chat-toggle-btn"
				size="large"
				onClick={toggleChatWindow}
				sx={{
					padding: "0.5rem 1.5rem", // Adjusted padding for rectangle shape
					display: "flex",
					alignItems: "center",
					justifyContent: "space-around",
					background:
						"linear-gradient(270deg, #b33a1f, #b37614, #008fb3, #2e5633)", // Flowing multicolor gradient
					backgroundSize: "400% 400%", // Ensure background moves
					animation: "gradient-flow 8s ease infinite", // Animation for the flow
					borderRadius: "30px", // Adjusted border radius for a rectangle
					flexDirection: "row", // Icon and text aligned horizontally
					width: isOpen ? "80px" : "auto", // Define a fixed width to make it a rectangle
					boxShadow: 3, // Adds a slight shadow for a more polished look
					mb: isOpen ? "0.4rem" : 0, // Adjusted margin for spacing
					transition: "background 0.3s ease", // Smooth transition for hover effect
					"&:hover": {
						animationDuration: "4s", // Faster animation on hover
						boxShadow: "0 4px 12px rgba(0,0,0,0.8)", // Enhance shadow on hover
					},
				}}
			>
				{isOpen ? (
					<CloseIcon
						sx={{
							fontSize: "2rem",
							color: "#ffffff", // White for contrast on gradient
						}}
					/>
				) : (
					<>
						<ChatIcon
							sx={{
								fontSize: "2rem",
								color: "#ffffff", // White for contrast on gradient
								marginRight: "0.5rem", // Spacing between icon and text
							}}
						/>
						<Typography
							sx={{
								fontSize: "18px",
								color: "#ffffff", // White for contrast on gradient
								fontWeight: "bold",
							}}
						>
							SMART AI
						</Typography>
					</>
				)}
			</IconButton>

			{isOpen && (
				<Box
					className="chat-window"
					sx={{ boxShadow: 3, borderRadius: "10px" }}
				>
					<MainContainer>
						<ChatContainer>
							<ConversationHeader>
								<Avatar
									name="SMART AI"
									src="https://chatscope.io/storybook/react/assets/emily-xzL8sDL2.svg"
								/>
								<ConversationHeader.Content
									info="Get your Financial Queries Resolved!"
									userName="SMART AI"
								/>
							</ConversationHeader>

							{/* Conditionally render a message when there are no messages */}
							<MessageList>
								{messages.length === 0 ? (
									<Box
										sx={{
											display: "flex",
											justifyContent: "center",
											alignItems: "center",
											height: "80%", // Ensure it's centered within the chat window
											textAlign: "center",
											padding: "1rem",
										}}
									>
										<Typography
											variant="h6"
											sx={{
												color: "#666",
												fontWeight: "bold",
												fontSize: "1.2rem",
											}}
										>
											Welcome to SMART AI! <br />
											Ask me anything about your finances. <br />I can help you
											track expenses, add income, and provide financial insights
											on the go. Let's get started!
										</Typography>
									</Box>
								) : (
									messages.map((msg, index) => (
										<Message
											key={index}
											model={{
												message: msg.message,
												direction: msg.direction,
											}}
										/>
									))
								)}
							</MessageList>

							<MessageInput
								placeholder="Type your message here..."
								value={inputMessage}
								onChange={(val) => setInputMessage(val)}
								onSend={handleSend}
								attachButton={false}
							/>
						</ChatContainer>
					</MainContainer>
				</Box>
			)}
		</Box>
	);
};

export default ChatBot;
