import React, { useState, useEffect, useRef } from "react";
import {
	Box,
	Paper,
	Typography,
	TextField,
	List,
	ListItem,
	ListItemText,
	Divider,
	Fab,
	IconButton,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../context/SocketContext"; // Use the same socket
import {
	addMessage,
	setTyping,
	setSocketConnected,
} from "../../state/chatSlice"; // Redux actions
import { useTheme } from "@mui/material";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const FullChatPage = () => {
	const theme = useTheme();
	const [inputMessage, setInputMessage] = useState(""); // Input message state
	const socket = useSocket(); // Get the socket from the context
	const messageListRef = useRef(); // Ref for MessageList to enable auto-scroll
	const { messages, isTyping } = useSelector((state) => state.chat);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(true); // Loading state for socket setup

	useEffect(() => {
		if (!socket) {
			return;
		}

		socket.on("connect", () => {
			dispatch(setSocketConnected(true));
			setIsLoading(false); // Set isLoading to false once setup is complete
		});

		socket.on("response", (data) => {
			if (data.message) {
				dispatch(addMessage({ message: data.message, direction: "incoming" }));
				dispatch(setTyping(false));
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

		socket.on("typing", () => {
			dispatch(setTyping(true));
		});

		return () => {
			if (socket) {
				socket.off("connect");
				socket.off("response");
				socket.off("financial-data");
				socket.off("typing");
				socket.off("error");
			}
		};
	}, [socket, dispatch]);

	// Auto-scroll to the bottom when messages or typing indicator changes
	useEffect(() => {
		if (messageListRef.current) {
			messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
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

	const goBack = () => {
		navigate(-1); // Navigate back to the previous page
	};

	const handleKeyDown = (event) => {
		if (event.key === "Enter") {
			event.preventDefault(); // Prevents a new line from being added
			handleSend(); // Calls the handleSend function
		}
	};

	return (
		<Box m="1.5rem 2.5rem" height="100vh">
			{/* Header */}
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					padding: "16px",
					color: "#fff",
					backgroundColor: theme.palette.background.alt, // Darker background
					borderRadius: "12px", // Rounded corners for header
					boxShadow: "0 4px 12px rgba(0,0,0,0.15)", // Subtle shadow for depth
				}}
			>
				<IconButton onClick={goBack} sx={{ color: "#fff" }}>
					<ArrowBackIcon fontSize="large" />
				</IconButton>
				<Typography
					variant="h6"
					sx={{ marginLeft: "16px", fontWeight: "bold" }}
				>
					SMART AI - Full Chat
				</Typography>
			</Box>

			{/* Chat Area */}
			<Box
				sx={{
					// Subtracting more for proper height
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-between",
					// padding: "20px", // Padding around chat
					background: "#111827", // Dark background for chat area
					borderRadius: "12px",
					// boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", // Subtle shadow for chat area
					backgroundColor: "transparent",
				}}
			>
				{/* Message Area */}
				<Box
					ref={messageListRef}
					sx={{
						overflowY: "auto",
						padding: "30px", // More padding for messages
						flexGrow: 1, // Allow the message area to grow
						// marginBottom: "3px",
						backgroundColor: "transparent",
					}}
				>
					{messages.length > 0 && (
						<List>
							{messages.map((msg, index) => (
								<ListItem
									key={index}
									sx={{
										display: "flex",
										justifyContent:
											msg.direction === "outgoing" ? "flex-end" : "flex-start",
										marginBottom: "15px",
										backgroundColor: theme.palette.background.default,
									}}
								>
									{msg.direction === "incoming" && (
										<Box sx={{ marginRight: "10px" }}>
											{/* Incoming Message - AI Image */}
											<img
												src="https://png.pngtree.com/png-vector/20230217/ourmid/pngtree-chip-ai-human-brain-intelligence-technology-chip-high-tech-circuit-board-png-image_6606248.png"
												alt="AI"
												style={{
													width: "40px",
													height: "40px",
													borderRadius: "50%",
												}}
											/>
										</Box>
									)}

									<Box
										sx={{
											backgroundColor:
												msg.direction === "outgoing"
													? theme.palette.background.alt
													: "transparent", // No background for incoming messages
											color: msg.direction === "outgoing" ? "#fff" : "#fff", // White text for outgoing, default text color for incoming
											padding: "0px 15px",
											borderRadius: "25px",
											maxWidth: "60%",
											wordWrap: "break-word",
											fontFamily: '"Inter", sans-serif', // Apply Inter font
											fontSize: "1rem", // Default font size for messages
											lineHeight: "1.5", // Improve readability with line height
											// boxShadow:
											// 	msg.direction === "outgoing"
											// 		? "0px 4px 10px rgba(0, 0, 0, 0.1)"
											// 		: "none", // Shadow for outgoing messages only
										}}
									>
										{msg.direction === "incoming" ? (
											// Render incoming message as markdown
											<ReactMarkdown remarkPlugins={[remarkGfm]}>
												{msg.message}
											</ReactMarkdown>
										) : (
											// Render outgoing message as plain text
											<ListItemText
												primary={msg.message}
												secondary={new Date().toLocaleTimeString([], {
													hour: "2-digit",
													minute: "2-digit",
												})}
												sx={{
													"& .MuiListItemText-primary": {
														fontFamily: '"Inter", sans-serif', // Apply Inter font
														fontSize: "1rem", // Default font size for messages
														lineHeight: "1.5",
														marginBottom: "2px",
													},
													"& .MuiListItemText-secondary": {
														color: "rgba(255, 255, 255, 0.7)", // Lighter text color for time
													},
												}}
											/>
										)}
									</Box>

									{msg.direction === "outgoing" && (
										<Box sx={{ marginLeft: "10px" }}>
											{/* Outgoing Message - User Image */}
											<img
												src="/user.png"
												alt="User"
												style={{
													width: "40px",
													height: "40px",
													borderRadius: "50%",
												}}
											/>
										</Box>
									)}
								</ListItem>
							))}
						</List>
					)}
				</Box>
			</Box>

			{/* Input Area */}
			<Box
				display="flex"
				// padding="10px"
				position="fixed"
				bottom="10px"
				width="100%"
				transform="translateX(-50%)" // Center the input box
				// backgroundColor="#1f2937" // Match background color of input with the header
				borderRadius="10px"
				// boxShadow="0 4px 12px rgba(0, 0, 0, 0.2)" // Soft shadow for input
			>
				{/* TextField to take full width */}
				<Box sx={{ flexGrow: 1, marginRight: "15px" }}>
					<TextField
						label="Type a message..."
						fullWidth
						value={inputMessage}
						onChange={(e) => setInputMessage(e.target.value)}
						onKeyDown={handleKeyDown}
						variant="outlined"
						sx={{
							// Dark background for input field
							borderRadius: "25px",
							"& .MuiOutlinedInput-root": {
								color: "#fff", // White text color
								fontFamily: '"Inter", sans-serif',
							},
							"& .MuiOutlinedInput-notchedOutline": {
								borderColor: "#4A5568", // Border color for input
							},
							"&:hover .MuiOutlinedInput-notchedOutline": {
								borderColor: "#CBD5E0", // Border color on hover
							},
						}}
					/>
				</Box>

				{/* Send Button */}
				<Box>
					<Fab
						color="primary"
						aria-label="send"
						onClick={handleSend}
						sx={{
							backgroundColor: "#3B82F6", // Lighter blue for send button
							"&:hover": {
								backgroundColor: "#2563EB", // Darker blue on hover
							},
						}}
					>
						<SendIcon />
					</Fab>
				</Box>
			</Box>
		</Box>
	);
};

export default FullChatPage;
