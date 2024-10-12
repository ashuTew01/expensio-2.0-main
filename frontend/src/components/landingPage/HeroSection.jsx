// src/components/landingPage/HeroSection.jsx
import React from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Typewriter } from "react-simple-typewriter";
import { useDispatch } from "react-redux";
import { setToken, setUserInfo } from "../../state/authSlice";

// Define the guest user information
const guestUserInfo = {
	id: 0,
	phone: "+911234567890",
	first_name: "Guest",
	last_name: "User",
	username: "guest",
	email: "guest@test.com",
	profile_picture_url: null,
	bio: "This is the official guest user, intended for checking out features.",
};

const HeroSection = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const handleGetStartedButtonClick = () => {
		navigate("/login");
	};

	const handleGuestLogin = () => {
		dispatch(setToken("guest"));
		dispatch(setUserInfo(guestUserInfo));
		// Optionally, navigate to a dashboard or home page after guest login
		// navigate("/dashboard");
	};

	return (
		<Box
			id="hero-section"
			sx={{
				position: "relative",
				color: "#FFFFFF",
				textAlign: "center",
				mt: { xs: 8, md: 0 }, // Offset for fixed header on mobile
				height: "100vh",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
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
						"url('https://images.unsplash.com/photo-1561414927-6d86591d0c4f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')",
					backgroundSize: "cover",
					backgroundPosition: "center",
					filter: "brightness(50%)",
					zIndex: -1,
				}}
			></Box>

			<Container maxWidth="md">
				<Typography
					// variant="h1"
					sx={{
						mb: 4,
						fontWeight: "bold",
						fontSize: { xs: "2rem", md: "3rem" },
						letterSpacing: "2px",
						lineHeight: "1.2",
						textTransform: "uppercase",
						animation: "fadeInDown 1s ease-in-out",
					}}
				>
					Empower Your Financial Future with{" "}
					<span style={{ color: "#1E90FF" }}>Expensio</span>
				</Typography>
				<Typography
					variant="h4"
					sx={{
						mb: 6,
						color: "#FFFFFF",
						lineHeight: "1.6",
						animation: "fadeInUp 1s ease-in-out 0.5s forwards",
					}}
				>
					<Typewriter
						words={[
							"Advanced Microservices Architecture.",
							"Kafka-Driven Event Bus.",
							"Smart AI Chat Assistant.",
							"Real-time Financial Insights.",
							"Secure OTP Authentication.",
						]}
						loop={true}
						cursor
						cursorStyle="_"
						typeSpeed={70}
						deleteSpeed={50}
						delaySpeed={1000}
					/>
				</Typography>
				{/* Buttons Container */}
				<Box
					sx={{
						display: "flex",
						flexDirection: { xs: "column", sm: "row" },
						alignItems: "center",
						justifyContent: "center",
						gap: 2, // Space between buttons
						mb: 4, // Space below the buttons
					}}
				>
					{/* Get Started Button */}
					<Button
						variant="contained"
						size="large"
						sx={{
							backgroundColor: "#1E90FF",
							color: "#FFFFFF",
							fontWeight: "bold",
							paddingX: 4,
							paddingY: 1.5,
							borderRadius: "50px",
							boxShadow: "0px 4px 15px rgba(30, 0, 0, 0.4)",
							transition: "background-color 0.3s, transform 0.3s",
							"&:hover": {
								backgroundColor: "#63B3ED",
								transform: "scale(1.05)",
								boxShadow: "0px 6px 20px rgba(30, 144, 255, 0.6)",
							},
							width: { xs: "100%", sm: "auto" }, // Full width on small screens
						}}
						onClick={handleGetStartedButtonClick}
					>
						Get Started
					</Button>

					{/* Guest Login Button */}
					<Button
						variant="outlined"
						size="large"
						sx={{
							backgroundColor: "transparent",
							color: "#1E90FF",
							fontWeight: "bold",
							paddingX: 4,
							paddingY: 1.5,
							borderRadius: "50px",
							border: "2px solid #1E90FF",
							boxShadow: "0px 4px 15px rgba(30, 0, 0, 0.2)",
							transition: "background-color 0.3s, transform 0.3s, color 0.3s",
							"&:hover": {
								backgroundColor: "#1E90FF",
								color: "#FFFFFF",
								transform: "scale(1.05)",
								boxShadow: "0px 6px 20px rgba(30, 144, 255, 0.4)",
							},
							width: { xs: "100%", sm: "auto" }, // Full width on small screens
						}}
						onClick={handleGuestLogin}
					>
						Guest Login
					</Button>
				</Box>

				{/* "Wanna Try?" Text */}
				<Typography
					variant="subtitle1"
					sx={{
						mb: 4,
						color: "#FFFFFF",
						fontWeight: "500",
						opacity: 0, // Set initial opacity to 0
						animation: "fadeInUp 1s ease-in-out 0.7s forwards",
					}}
				>
					Wanna Try? Just login as guest and start using our app.
				</Typography>
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
