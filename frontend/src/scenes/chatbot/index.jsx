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
	TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import { Box, IconButton, Typography, Collapse } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import "../chatbot/index.css"; // Custom styles for positioning
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const ChatBot = () => {
	const [isOpen, setIsOpen] = useState(false); // To handle open/close state
	const [messages, setMessages] = useState([]); // Messages state
	const [inputMessage, setInputMessage] = useState(""); // Input message state
	const [socketConnected, setSocketConnected] = useState(false); // Socket connection state
	const socket = useRef(null); // Using useRef to persist socket instance
	const [isTyping, setIsTyping] = useState(false); // Typing indicator state

	const messageListRef = useRef(); // Ref for MessageList to enable auto-scroll

	const renderers = {
		ol: ({ ordered, children }) => (
			<ul className="custom-ordered-list">{children}</ul>
		),
		li: ({ children }) => <li>{children}</li>,
		// You can add more custom renderers if needed
	};

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
				setIsTyping(false); // Stop typing indicator when message is received
			}
		});

		socket.current.on("financial-data", (data) => {
			const formattedData = JSON.stringify(data.message, null, 2);
			setMessages((prev) => [
				...prev,
				{
					message: `Financial Data:\n${formattedData}`,
					direction: "incoming",
				},
			]);
			setIsTyping(false);
		});

		socket.current.on("error", (data) => {
			setMessages((prev) => [
				...prev,
				{ message: `Error: ${data.message}`, direction: "incoming" },
			]);
			setIsTyping(false);
		});

		// Show typing indicator when server is processing
		socket.current.on("typing", () => {
			setIsTyping(true);
		});

		socket.current.on("disconnect", () => {
			setSocketConnected(false);
		});

		return () => {
			if (socket.current) socket.current.disconnect();
		};
	}, []);

	useEffect(() => {
		// Auto-scroll to bottom when messages or typing indicator changes
		if (messageListRef.current) {
			messageListRef.current.scrollToBottom("smooth");
		}
	}, [messages, isTyping]);

	const handleSend = () => {
		if (inputMessage.trim() !== "") {
			setMessages((prev) => [
				...prev,
				{ message: inputMessage, direction: "outgoing" },
			]);
			socket.current.emit("chat_message", inputMessage); // Send message to server
			setInputMessage(""); // Clear input
			setIsTyping(true); // Start typing indicator
		}
	};

	const toggleChatWindow = () => {
		setIsOpen(!isOpen);
	};

	return (
		<Box className="chatbot-container">
			{/* SMART AI Button - Width adjusted */}
			<IconButton
				className="chat-toggle-btn"
				size="large"
				onClick={toggleChatWindow}
				sx={{
					padding: "0.5rem 1.5rem",
					display: "flex",
					alignItems: "center",
					justifyContent: "space-around",
					background:
						"linear-gradient(270deg, #b33a1f, #b37614, #008fb3, #2e5633)",
					backgroundSize: "400% 400%",
					animation: "gradient-flow 8s ease infinite",
					borderRadius: "30px",
					flexDirection: "row",
					width: isOpen ? "80px" : "fit-content",
					boxShadow: 3,
					mb: isOpen ? "0.4rem" : 0,
					transition: "all 0.3s ease",
					"&:hover": {
						animationDuration: "3s",
						boxShadow: "0 4px 12px rgba(0,0,0,0.8)",
						transform: "scale(1.01)",
					},
				}}
			>
				{isOpen ? (
					<CloseIcon
						sx={{
							fontSize: "2rem",
							color: "#ffffff",
						}}
					/>
				) : (
					<>
						<ChatIcon
							sx={{
								fontSize: "2rem",
								color: "#ffffff",
								marginRight: "0.5rem",
							}}
						/>
						<Typography
							sx={{
								fontSize: "18px",
								color: "#ffffff",
								fontWeight: "bold",
							}}
						>
							SMART AI
						</Typography>
					</>
				)}
			</IconButton>

			{/* Chat Window */}
			<Collapse in={isOpen} timeout={300}>
				<Box
					className="chat-window"
					sx={{
						boxShadow: 3,
						borderRadius: "10px",
					}}
				>
					<MainContainer>
						<ChatContainer>
							<ConversationHeader>
								<Avatar
									name="SMART AI"
									src="https://png.pngtree.com/png-vector/20230217/ourmid/pngtree-chip-ai-human-brain-intelligence-technology-chip-high-tech-circuit-board-png-image_6606248.png"
								/>
								<ConversationHeader.Content
									info="Your Financial Assistant"
									userName="SMART AI"
								/>
							</ConversationHeader>

							{/* Message List */}
							<MessageList
								className="message-list"
								ref={messageListRef} // Attach ref for auto-scroll
								typingIndicator={
									isTyping && (
										<TypingIndicator content="SMART AI is typing..." />
									)
								}
							>
								{messages.length === 0 ? (
									<Box
										sx={{
											display: "flex",
											justifyContent: "center",
											alignItems: "center",
											height: "80%",
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
									<>
										{messages.map((msg, index) => (
											<Message
												key={index}
												model={{
													// message: msg.message,
													direction: msg.direction,
													sentTime: new Date().toLocaleTimeString([], {
														hour: "2-digit",
														minute: "2-digit",
													}),
													position: "normal",
												}}
												// Add a custom class to style messages
												className={
													msg.direction === "outgoing"
														? "message-outgoing"
														: "message-incoming"
												}
											>
												<Message.CustomContent>
													<ReactMarkdown
														// components={renderers}
														remarkPlugins={[remarkGfm]}
													>
														{msg.message}
													</ReactMarkdown>
												</Message.CustomContent>
											</Message>
										))}
									</>
								)}
							</MessageList>

							<MessageInput
								placeholder="Type your message here..."
								value={inputMessage}
								onChange={(val) => setInputMessage(val)}
								onSend={handleSend}
								attachButton={false}
								autoFocus
							/>
						</ChatContainer>
					</MainContainer>
				</Box>
			</Collapse>
		</Box>
	);
};

export default ChatBot;
