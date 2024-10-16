// src/components/landingPage/NotesSection.jsx
import React from "react";
import { Box, Container, Typography } from "@mui/material";
import { motion } from "framer-motion";
// import backgroundImage from "/warning-background.jpg";
const NotesSection = () => {
	return (
		<Box
			id="notes-section"
			sx={{
				position: "relative",
				py: { xs: 12, md: 20 },
				textAlign: "center",
				color: "#FFFFFF",
				overflow: "hidden",
				// height: "500px",
			}}
		>
			{/* Background Image */}
			<Box
				sx={{
					position: "absolute",
					top: 0,
					left: 0,
					width: "100%",
					height: "100%",
					// backgroundImage: backgroundImage,
					backgroundColor: "#2f2f2f",
					backgroundSize: "cover",
					backgroundPosition: "center",
					filter: "brightness(40%)",
					zIndex: -1,
				}}
			></Box>

			<Container maxWidth="md">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8 }}
				>
					<Typography
						variant="h2"
						sx={{
							mb: 4,
							fontWeight: "bold",
							letterSpacing: "1px",
							color: "#FFFFFF",
							textTransform: "uppercase",
						}}
					>
						⚠️ This is a beta version. Here are some things to keep in mind ⚠️
					</Typography>
					<Typography
						variant="h5"
						sx={{
							mb: 6,
							color: "#FFFFFF",
							lineHeight: "1.6",
							maxWidth: "700px",
							margin: "0 auto",
						}}
					>
						<ul>
							<li key="1">
								Best viewed on desktop/laptop for now; mobile responsiveness is
								in progress.
							</li>
							<li key="3">
								AI tokens can’t be purchased yet, but new users get free tokens
								on signup. Non-AI features work without tokens.{" "}
								{"You can contact the developers for AI tokens.".toUpperCase()}
							</li>
							<li key="4">
								You can test the app using a guest account, but avoid entering
								any confidential info.
							</li>
							<li key="5">
								Due to cost limitations, some features are rate-limited, and the
								site might go offline briefly if costs spike.
							</li>
						</ul>
					</Typography>
				</motion.div>
			</Container>
		</Box>
	);
};

export default NotesSection;
