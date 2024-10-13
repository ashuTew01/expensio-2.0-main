import React, { useState, useEffect, useRef } from "react";
import {
	Box,
	Typography,
	TextField,
	List,
	ListItem,
	IconButton,
	Fab,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../context/SocketContext";
import {
	addMessage,
	setTyping,
	setSocketConnected,
} from "../../state/chatSlice";
import { useTheme } from "@mui/material";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion, AnimatePresence } from "framer-motion"; // For animations
import { api } from "../../state/api";

const TypingIndicator = () => (
	<Box sx={{ display: "flex", alignItems: "center" }}>
		<Box
			sx={{
				width: 8,
				height: 8,
				backgroundColor: "#fff",
				borderRadius: "50%",
				marginRight: "4px",
				animation: "typing 1s infinite",
			}}
		/>
		<Box
			sx={{
				width: 8,
				height: 8,
				backgroundColor: "#fff",
				borderRadius: "50%",
				marginRight: "4px",
				animation: "typing 1s infinite 0.2s",
			}}
		/>
		<Box
			sx={{
				width: 8,
				height: 8,
				backgroundColor: "#fff",
				borderRadius: "50%",
				animation: "typing 1s infinite 0.4s",
			}}
		/>
		<style>
			{`@keyframes typing {
          0% { opacity: 0.2; }
          20% { opacity: 1; }
          100% { opacity: 0.2; }
      }`}
		</style>
	</Box>
);

const FullChatPage = () => {
	const theme = useTheme();
	const [inputMessage, setInputMessage] = useState("");
	const socket = useSocket();
	const messageListRef = useRef();
	const { messages, isTyping } = useSelector((state) => state.chat);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		if (!socket) {
			return;
		}

		socket.on("connect", () => {
			dispatch(setSocketConnected(true));
		});

		socket.on("response", (data) => {
			if (data.message) {
				dispatch(
					addMessage({
						message: data.message,
						direction: "incoming",
						timestamp: new Date(),
					})
				);
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
					timestamp: new Date(),
				})
			);
			dispatch(setTyping(false));
		});

		socket.on("error", (data) => {
			dispatch(
				addMessage({
					message: `Error: ${data.message}`,
					direction: "incoming",
					timestamp: new Date(),
				})
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
				socket.off("wait");
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
			dispatch(
				addMessage({
					message: inputMessage,
					direction: "outgoing",
					timestamp: new Date(),
				})
			);
			socket.emit("chat_message", inputMessage);
			setInputMessage("");
			dispatch(setTyping(true));
		}
	};

	const goBack = () => {
		navigate(-1);
	};

	const handleKeyDown = (event) => {
		if (event.key === "Enter") {
			event.preventDefault();
			handleSend();
		}
	};

	return (
		<Box
			p="1.5rem 2.5rem"
			height="100vh"
			display="flex"
			flexDirection="column"
			sx={{ boxSizing: "border-box", overflow: "hidden" }}
		>
			{/* Header */}
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					padding: "16px",
					color: "#fff",
					backgroundColor: "transparent",
					borderRadius: "12px",
				}}
			>
				<IconButton onClick={goBack} sx={{ color: "#fff" }}>
					<ArrowBackIcon fontSize="large" />
				</IconButton>
				<Typography
					variant="h6"
					sx={{ marginLeft: "16px", fontWeight: "bold" }}
				>
					SMART AI - Your Personalized Financial Assistant
				</Typography>
			</Box>

			{/* Chat Area */}
			<Box
				sx={{
					flexGrow: 1,
					display: "flex",
					flexDirection: "column",
					background: theme.palette.background.default,
					borderRadius: "12px",
					overflow: "hidden",
					position: "relative",
				}}
			>
				{/* Assistant Image and Welcome Message */}
				<AnimatePresence>
					{messages.length === 0 && (
						<Box
							component={motion.div}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0, transition: { duration: 0.5 } }}
							sx={{
								flexShrink: 0,
								padding: "20px",
								backgroundColor: "transparent",
							}}
						>
							<Box
								sx={{
									display: "flex",
									alignItems: "center",
									marginBottom: "20px",
								}}
							>
								<img
									src="https://png.pngtree.com/png-vector/20230217/ourmid/pngtree-chip-ai-human-brain-intelligence-technology-chip-high-tech-circuit-board-png-image_6606248.png"
									alt="AI Assistant"
									style={{
										width: "60px",
										height: "60px",
										borderRadius: "50%",
										marginRight: "15px",
									}}
								/>
								<Typography variant="h5" sx={{ fontWeight: "bold" }}>
									Welcome to SMART AI!
								</Typography>
							</Box>
							<Typography variant="body1" sx={{ marginLeft: "75px" }}>
								Ask me anything about your finances.
							</Typography>
							<Typography variant="body1" sx={{ marginLeft: "75px" }}>
								I can help you track expenses, add income, provide financial
								insights, and do much more on the go.
							</Typography>
							<Typography
								variant="h6"
								sx={{
									marginLeft: "75px",
									marginTop: "10px",
									fontWeight: "bold",
								}}
							>
								Let's get started!
							</Typography>
						</Box>
					)}
				</AnimatePresence>

				{/* Messages */}
				<Box
					sx={{
						flexGrow: 1,
						overflowY: "auto",
						padding: "20px",
					}}
					ref={messageListRef}
				>
					<List sx={{ paddingTop: 0 }}>
						{messages.map((msg, index) => (
							<ListItem
								key={index}
								sx={{
									display: "flex",
									justifyContent:
										msg.direction === "outgoing" ? "flex-end" : "flex-start",
									marginBottom: "15px",
								}}
								component={motion.div}
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.3 }}
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
												: "transparent",
										color: "#fff",
										padding: "10px 15px",
										borderRadius: msg.direction === "outgoing" ? "15px" : "0px",
										maxWidth: "60%",
										wordWrap: "break-word",
										fontFamily: '"Inter", sans-serif',
										fontSize: "1rem",
										lineHeight: "1.5",
									}}
								>
									{msg.direction === "incoming" ? (
										// Render incoming message as markdown
										<ReactMarkdown remarkPlugins={[remarkGfm]}>
											{msg.message}
										</ReactMarkdown>
									) : (
										// Render outgoing message as plain text
										<Typography variant="body1">{msg.message}</Typography>
									)}
									{/* Message timestamp */}
									<Typography
										variant="caption"
										sx={{
											display: "block",
											marginTop: "5px",
											color: "rgba(255, 255, 255, 0.7)",
										}}
									>
										{msg.timestamp
											? new Date(msg.timestamp).toLocaleTimeString([], {
													hour: "2-digit",
													minute: "2-digit",
												})
											: ""}
									</Typography>
								</Box>

								{msg.direction === "outgoing" && (
									<Box sx={{ marginLeft: "10px" }}>
										{/* Outgoing Message - User Image */}
										<img
											src="https://cdn-icons-png.flaticon.com/512/9187/9187604.png"
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

						{/* Typing Indicator */}
						{isTyping && (
							<ListItem
								sx={{
									display: "flex",
									justifyContent: "flex-start",
									marginBottom: "15px",
								}}
							>
								<Box sx={{ marginRight: "10px" }}>
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
								<Box
									sx={{
										backgroundColor: "transparent",
										color: "#fff",
										padding: "10px 15px",
										maxWidth: "60%",
										fontFamily: '"Inter", sans-serif',
										fontSize: "1rem",
										lineHeight: "1.5",
									}}
								>
									<TypingIndicator />
								</Box>
							</ListItem>
						)}
					</List>
				</Box>
			</Box>

			{/* Input Area */}
			<Box
				display="flex"
				padding="10px"
				width="100%"
				sx={{
					backgroundColor: theme.palette.background.alt,
					borderRadius: "10px",
					position: "sticky",
					bottom: 0,
					marginTop: "auto",
				}}
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
							borderRadius: "25px",
							"& .MuiOutlinedInput-root": {
								color: "#fff",
								fontFamily: '"Inter", sans-serif',
							},
							"& .MuiOutlinedInput-notchedOutline": {
								borderColor: "#4A5568",
							},
							"&:hover .MuiOutlinedInput-notchedOutline": {
								borderColor: "#CBD5E0",
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
							backgroundColor: "#3B82F6",
							"&:hover": {
								backgroundColor: "#2563EB",
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
