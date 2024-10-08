// src/components/landingPage/FeaturesSection.jsx
import React from "react";
import { Box, Grid, Typography, Container } from "@mui/material";
import BuildIcon from "@mui/icons-material/Build";
import ChatIcon from "@mui/icons-material/Chat";
import SecurityIcon from "@mui/icons-material/Security";
import DataUsageIcon from "@mui/icons-material/DataUsage";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import CategoryIcon from "@mui/icons-material/Category";
import { motion } from "framer-motion";

const features = [
	{
		title: "Microservices Architecture",
		description:
			"Harness the power of microservices for unparalleled scalability and maintainability. Each service operates independently, ensuring seamless updates and deployments without impacting the entire system.",
		icon: <BuildIcon sx={{ fontSize: 50, color: "#1E90FF" }} />,
	},
	{
		title: "Kafka-Driven Event Bus",
		description:
			"Experience real-time data processing with our Apache Kafka-powered event-driven system. Efficiently handle events like `EXPENSE_CREATED` for parallel task processing and ultimate system decoupling.",
		icon: <DataUsageIcon sx={{ fontSize: 50, color: "#28A745" }} />,
	},
	{
		title: "Smart AI Chat Assistant",
		description:
			"Interact with our intelligent AI-driven chat assistant for effortless financial management. Add expenses, query data, and receive personalized insights through natural, conversational interactions.",
		icon: <ChatIcon sx={{ fontSize: 50, color: "#DC3545" }} />,
	},
	{
		title: "Advanced OTP Authentication",
		description:
			"Secure your account with rate-limited OTP authentication and robust account lockout mechanisms. Protect against unauthorized access with cutting-edge security features.",
		icon: <SecurityIcon sx={{ fontSize: 50, color: "#FFC107" }} />,
	},
	{
		title: "Comprehensive Financial Analytics",
		description:
			"Gain deep insights into your financial behavior with detailed tracking by month, category, mood, and cognitive triggers. Make informed decisions with our advanced analytics.",
		icon: <TrendingUpIcon sx={{ fontSize: 50, color: "#1E90FF" }} />,
	},
	{
		title: "Automated Transaction Categorization",
		description:
			"Let Expensio automatically categorize your transactions, including support for custom cognitive triggers that reflect your unique financial habits.",
		icon: <CategoryIcon sx={{ fontSize: 50, color: "#28A745" }} />,
	},
	{
		title: "Distributed Saga Pattern",
		description:
			"Ensure data consistency across multiple services with our implementation of the Distributed Saga Pattern. Experience reliable and atomic workflows in complex transactions.",
		icon: <BuildIcon sx={{ fontSize: 50, color: "#6A5ACD" }} />,
	},
	{
		title: "Event Replay Capability",
		description:
			"Never miss out on critical data with our event replay feature. New services can subscribe to historical events, ensuring they are always up-to-date.",
		icon: <DataUsageIcon sx={{ fontSize: 50, color: "#FF69B4" }} />,
	},
];

const FeaturesSection = () => {
	return (
		<Box
			id="features-section"
			sx={{
				py: { xs: 8, md: 12 },
				backgroundColor: "#0D0D0D",
				color: "#FFFFFF",
			}}
		>
			<Container maxWidth="lg">
				<Typography
					variant="h2"
					sx={{
						textAlign: "center",
						mb: 6,
						fontWeight: "bold",
						letterSpacing: "1px",
						textTransform: "uppercase",
					}}
				>
					Our Outstanding Features
				</Typography>
				<Grid container spacing={6}>
					{features.map((feature, idx) => (
						<Grid item xs={12} md={6} key={idx}>
							<motion.div
								initial={{ opacity: 0, y: 50 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6, delay: idx * 0.2 }}
							>
								<Box
									sx={{
										p: 4,
										backgroundColor: "#1A1A1A",
										borderRadius: "16px",
										boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.5)",
										transition: "transform 0.3s, box-shadow 0.3s",
										"&:hover": {
											transform: "translateY(-10px)",
											boxShadow: "0px 8px 30px rgba(0, 0, 0, 0.7)",
										},
										height: "100%",
									}}
								>
									<Box
										sx={{
											mb: 3,
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
										}}
									>
										{feature.icon}
									</Box>
									<Typography
										variant="h4"
										sx={{
											mb: 2,
											fontWeight: "600",
											letterSpacing: "0.5px",
											textAlign: "center",
										}}
									>
										{feature.title}
									</Typography>
									<Typography
										// variant="body1"
										sx={{
											color: "#B0B0B0",
											lineHeight: "1.8",
											textAlign: "center",
											fontSize: "0.96rem",
										}}
									>
										{feature.description}
									</Typography>
								</Box>
							</motion.div>
						</Grid>
					))}
				</Grid>
			</Container>
		</Box>
	);
};

export default FeaturesSection;
