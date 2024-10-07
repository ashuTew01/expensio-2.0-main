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

	return (
		<Box m="1.5rem 2.5rem">
			{/* Header */}
			<Box
				component={Paper}
				elevation={3}
				sx={{
					display: "flex",
					alignItems: "center",
					padding: "16px",
					color: "#fff",
					backgroundColor: "#1f2937", // Darker background
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
					height: "calc(100vh - 100px)", // Subtracting more for proper height
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-between",
					padding: "20px", // Padding around chat
					background: "#111827", // Dark background for chat area
					borderRadius: "12px",
					boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", // Subtle shadow for chat area
				}}
			>
				{/* Message Area */}
				<Box
					ref={messageListRef}
					sx={{
						overflowY: "auto",
						padding: "0px 10px", // More padding for messages
						flexGrow: 1, // Allow the message area to grow
						borderRadius: "12px",
					}}
				>
					<List>
						{messages.map((msg, index) => (
							<ListItem
								key={index}
								sx={{
									display: "flex",
									justifyContent:
										msg.direction === "outgoing" ? "flex-end" : "flex-start",
									marginBottom: "15px", // Increased spacing between messages
								}}
							>
								<Box
									sx={{
										backgroundColor:
											msg.direction === "outgoing" ? "#34D399" : "#2563EB", // Outgoing: Green, Incoming: Blue
										color: "#fff",
										padding: "0px 15px", // Better padding inside message bubbles
										borderRadius: "25px", // More rounded corners for bubbles
										maxWidth: "60%",
										wordWrap: "break-word",
										boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Soft shadow for message bubbles
									}}
								>
									<ListItemText
										primary={msg.message}
										secondary={new Date().toLocaleTimeString([], {
											hour: "2-digit",
											minute: "2-digit",
										})}
										sx={{
											"& .MuiListItemText-secondary": {
												color: "rgba(255, 255, 255, 0.7)", // Lighter text color for the time
											},
										}}
									/>
								</Box>
							</ListItem>
						))}
					</List>
				</Box>
			</Box>

			{/* Input Area */}
			<Box
				display="flex"
				alignItems="center"
				padding="10px"
				position="fixed"
				width="80%"
				bottom="15px"
				transform="translateX(-50%)" // Center the input box
				backgroundColor="#1f2937" // Match background color of input with the header
				borderRadius="10px"
				boxShadow="0 4px 12px rgba(0, 0, 0, 0.2)" // Soft shadow for input
			>
				{/* TextField to take full width */}
				<Box sx={{ flexGrow: 1, marginRight: "15px" }}>
					<TextField
						label="Type a message..."
						fullWidth
						value={inputMessage}
						onChange={(e) => setInputMessage(e.target.value)}
						variant="outlined"
						sx={{
							// Dark background for input field
							borderRadius: "25px",
							"& .MuiOutlinedInput-root": {
								color: "#fff", // White text color
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
