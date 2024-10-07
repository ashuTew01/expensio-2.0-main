// src/components/landingPage/CallToActionSection.jsx
import React from "react";
import { Box, Container, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const CallToActionSection = () => {
	const navigate = useNavigate();
	const handleStartNow = () => {
		navigate("/login");
	};

	return (
		<Box
			sx={{
				py: { xs: 12, md: 20 },
				textAlign: "center",
				backgroundColor: "#0D0D0D",
				color: "#FFFFFF",
				backgroundImage: "linear-gradient(135deg, #1a1a1a 0%, #333333 100%)",
			}}
		>
			<Container maxWidth="md">
				<Typography
					variant="h3"
					sx={{
						mb: 4,
						fontWeight: "700",
						letterSpacing: "1px",
						color: "#1E90FF",
						animation: "fadeIn 1s ease-in-out",
					}}
				>
					Ready to Take Control of Your Finances?
				</Typography>
				<Typography
					variant="h6"
					sx={{
						mb: 6,
						color: "#B0B0B0",
						lineHeight: "1.6",
						animation: "fadeIn 1s ease-in-out 0.5s",
						opacity: 0,
					}}
				>
					Join Expensio today and gain unparalleled insights into your financial
					behavior. Manage your expenses, set financial goals, and interact with
					our Smart Chat Assistant for real-time assistance.
				</Typography>
				<Button
					variant="contained"
					size="large"
					sx={{
						backgroundColor: "#DC3545",
						color: "#FFFFFF",
						fontWeight: "bold",
						paddingX: 4,
						paddingY: 1.5,
						borderRadius: "50px",
						boxShadow: "0px 4px 15px rgba(220, 53, 69, 0.4)",
						transition: "background-color 0.3s, transform 0.3s",
						"&:hover": {
							backgroundColor: "#C82333",
							transform: "scale(1.05)",
							boxShadow: "0px 6px 20px rgba(220, 53, 69, 0.6)",
						},
					}}
					onClick={handleStartNow}
				>
					Start Now
				</Button>
			</Container>
			{/* Keyframes for animations */}
			<style>
				{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
			</style>
		</Box>
	);
};

export default CallToActionSection;
