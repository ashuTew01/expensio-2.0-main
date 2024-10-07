// src/components/landingPage/HeroSection.jsx
import React from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
	const navigate = useNavigate();
	const handleGetStartedButtonClick = () => {
		navigate("/login");
	};
	return (
		<Box
			sx={{
				backgroundColor: "#0D0D0D",
				color: "#FFFFFF",
				py: { xs: 12, md: 20 },
				textAlign: "center",
				backgroundImage: "linear-gradient(135deg, #1a1a1a 0%, #333333 100%)",
				mt: 8, // To offset the fixed header
			}}
		>
			<Container maxWidth="lg">
				<Typography
					variant="h2"
					sx={{
						mb: 4,
						fontWeight: "bold",
						letterSpacing: "1px",
						lineHeight: "1.2",
						animation: "fadeInDown 1s ease-in-out",
					}}
				>
					Empower Your Financial Future with Expensio
				</Typography>
				<Typography
					variant="h5"
					sx={{
						mb: 6,
						color: "#B0B0B0",
						maxWidth: "700px",
						margin: "0 auto",
						lineHeight: "1.6",
						animation: "fadeInUp 1s ease-in-out 0.5s forwards",
						opacity: 0,
					}}
				>
					Track your expenses, set financial goals, and gain deep insights into
					your spending behavior with our state-of-the-art financial management
					platform.
				</Typography>
				<Box height={"20px"}></Box>
				<Button
					variant="contained"
					size="large"
					sx={{
						backgroundColor: "#28A745",
						color: "#FFFFFF",
						fontWeight: "bold",
						paddingX: 4,
						paddingY: 1.5,
						borderRadius: "50px",
						boxShadow: "0px 4px 15px rgba(40, 167, 69, 0.4)",
						transition: "background-color 0.3s, transform 0.3s",
						"&:hover": {
							backgroundColor: "#218838",
							transform: "scale(1.05)",
							boxShadow: "0px 6px 20px rgba(40, 167, 69, 0.6)",
						},
					}}
					onClick={handleGetStartedButtonClick}
				>
					Get Started
				</Button>
			</Container>
			{/* Keyframes for animations */}
			<style>
				{`
          @keyframes fadeInDown {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes fadeInUp {
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

export default HeroSection;
