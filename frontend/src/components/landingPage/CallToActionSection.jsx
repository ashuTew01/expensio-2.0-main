// src/components/landingPage/CallToActionSection.jsx
import React from "react";
import { Box, Container, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const CallToActionSection = () => {
	const navigate = useNavigate();
	const handleStartNow = () => {
		navigate("/login");
	};

	return (
		<Box
			id="contact-section"
			sx={{
				position: "relative",
				py: { xs: 12, md: 20 },
				textAlign: "center",
				color: "#FFFFFF",
				overflow: "hidden",
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
					backgroundImage:
						"url('https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')",
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
						Ready to Transform Your Financial Journey?
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
						Join{" "}
						<span style={{ color: "#1E90FF", fontWeight: "bold" }}>
							Expensio
						</span>{" "}
						today and unlock the power of advanced financial management. Dive
						deep into your spending habits, set ambitious goals, and let our
						intelligent assistant guide you every step of the way.
					</Typography>
					<Box height="25px" />
					<Button
						variant="contained"
						size="large"
						sx={{
							backgroundColor: "#1E90FF",
							color: "#FFFFFF",
							fontWeight: "bold",
							paddingX: 5,
							paddingY: 1.8,
							borderRadius: "50px",
							boxShadow: "0px 4px 15px rgba(30, 144, 255, 0.4)",
							transition: "background-color 0.3s, transform 0.3s",
							"&:hover": {
								backgroundColor: "#63B3ED",
								transform: "scale(1.05)",
								boxShadow: "0px 6px 20px rgba(30, 144, 255, 0.6)",
							},
						}}
						onClick={handleStartNow}
					>
						Get Started Now
					</Button>
				</motion.div>
			</Container>
		</Box>
	);
};

export default CallToActionSection;
