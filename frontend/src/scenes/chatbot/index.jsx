import React, { useState, useEffect, useRef } from "react";
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
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import CloseIcon from "@mui/icons-material/Close";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import "../chatbot/index.css"; // Custom styles for positioning
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { useDispatch, useSelector } from "react-redux";
import {
	addMessage,
	setTyping,
	setSocketConnected,
} from "../../state/chatSlice";
import { useNavigate } from "react-router-dom"; // For redirecting to full chat page
import { useSocket } from "../../context/SocketContext";
import LoadingIndicator from "../../components/LoadingIndicator";
import { api } from "../../state/api";

const ChatBot = () => {
	const [isOpen, setIsOpen] = useState(false); // To handle open/close state
	const [inputMessage, setInputMessage] = useState(""); // Input message state
	const socket = useSocket(); // Get the socket from the context
	const messageListRef = useRef(); // Ref for MessageList to enable auto-scroll
	const [isLoading, setIsLoading] = useState(true); // Loading state for socket setup

	const { messages, isTyping, socketConnected } = useSelector(
		(state) => state.chat
	);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	// Add logging for debugging purposes
	useEffect(() => {
		// Wait until the socket is initialized
		if (!socket) {
			// console.log("Socket not initialized yet");
			return;
		}

		// console.log("Socket is being set up...");

		// Register socket event listeners
		socket.on("connect", () => {
			dispatch(setSocketConnected(true));

			setIsLoading(false);
		});

		socket.on("response", (data) => {
			if (data.message) {
				dispatch(addMessage({ message: data.message, direction: "incoming" }));
				dispatch(setTyping(false));
			}
			dispatch(api.util.invalidateTags(["Tokens"]));
		});

		socket.on("wait", (data) => {
			if (data.message) {
				dispatch(addMessage({ message: data.message, direction: "incoming" }));
				dispatch(setTyping(true));
			}
		});

		socket.on("financial-data", (data) => {
			const formattedData = JSON.stringify(data.message, null, 2);
			dispatch(
				addMessage({
					message: `Financial Data:\n${formattedData}`,
					direction: "incoming",
				})
			);
			dispatch(setTyping(false));
		});

		socket.on("error", (data) => {
			dispatch(
				addMessage({ message: `Error: ${data.message}`, direction: "incoming" })
			);
			dispatch(setTyping(false));
		});

		// Show typing indicator when server is processing
		socket.on("typing", () => {
			dispatch(setTyping(true));
		});

		// Clean up event listeners when component unmounts
		return () => {
			if (socket) {
				socket.off("connect");
				socket.off("response");
				socket.off("financial-data");
				socket.off("typing");
				socket.off("error");
				socket.off("wait");
			}
		};
	}, [socket, dispatch]);

	useEffect(() => {
		if (messageListRef.current) {
			messageListRef.current.scrollToBottom("smooth");
		}
	}, [messages, isTyping]);

	const handleSend = () => {
		if (inputMessage.trim() !== "") {
			dispatch(addMessage({ message: inputMessage, direction: "outgoing" }));
			socket.emit("chat_message", inputMessage);
			setInputMessage("");
			dispatch(setTyping(true));
		}
	};

	const toggleChatWindow = () => {
		setIsOpen(!isOpen);
	};

	const expandToFullPage = () => {
		setIsOpen(!isOpen);
		navigate("smart-ai-chat");
	};

	if (!socket) {
		return (
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "300px",
					flexDirection: "column",
				}}
			>
				<LoadingIndicator />
				<Typography variant="h6" sx={{ marginTop: "1rem", color: "#666" }}>
					Connecting to SMART AI...
				</Typography>
			</Box>
		);
	}

	return (
		<Box
			className="chatbot-container"
			style={
				isOpen
					? { display: "flex", flexDirection: "column" }
					: { width: "178px" }
			}
		>
			{/* SMART AI Button - Width adjusted */}
			<Box
				style={
					isOpen
						? {
								display: "flex",
								justifyContent: "space-between",
								width: "100%",
							}
						: {}
				}
			>
				<IconButton
					className="chat-toggle-btn"
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

				{/* Button to navigate to full chat page */}
				{isOpen && (
					<IconButton
						className="chat-toggle-btn"
						onClick={expandToFullPage}
						style={{
							padding: "0.5rem 1.5rem",
							background:
								"linear-gradient(270deg, #b33a1f, #b37614, #008fb3, #2e5633)",
							backgroundSize: "400% 400%",
							animation: "gradient-flow 8s ease infinite",
							borderRadius: "30px",
							boxShadow: "3",
							transition: "all 0.3s ease",
							"&:hover": {
								animationDuration: "3s",
								boxShadow: "0 4px 12px rgba(0,0,0,0.8)",
								transform: "scale(1.01)",
							},
						}}
					>
						<OpenInFullIcon
							style={{
								fontSize: "2rem",
								color: "#ffffff",
								marginRight: "0.5rem",
							}}
						/>
					</IconButton>
				)}
			</Box>

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
													<ReactMarkdown remarkPlugins={[remarkGfm]}>
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
