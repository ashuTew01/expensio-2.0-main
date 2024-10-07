// src/components/landingPage/FeaturesSection.jsx
import React from "react";
import { Box, Grid, Typography, Container } from "@mui/material";
import BuildIcon from "@mui/icons-material/Build"; // Using available Material-UI icons
import ChatIcon from "@mui/icons-material/Chat";
import SecurityIcon from "@mui/icons-material/Security";
import DataUsageIcon from "@mui/icons-material/DataUsage";

const features = [
	{
		title: "Microservices Architecture",
		description:
			"Transitioned to a microservices architecture using Node.js and Express, enhancing scalability and maintainability. Each service operates independently, allowing seamless updates and deployments without affecting the entire system.",
		icon: <BuildIcon sx={{ fontSize: 50, color: "#1E90FF" }} />,
	},
	{
		title: "Kafka-Driven Event Bus",
		description:
			"Implemented an Apache Kafka-powered event-driven system for real-time data processing. Events like `EXPENSE_CREATED` are efficiently consumed by multiple services, ensuring parallel task handling and system decoupling.",
		icon: <DataUsageIcon sx={{ fontSize: 50, color: "#28A745" }} />,
	},
	{
		title: "Smart Chat Assistant with NLP",
		description:
			"Integrated an intelligent NLP-driven chat assistant that understands and processes user queries. Users can effortlessly add expenses, query financial data, and receive personalized insights through conversational interactions.",
		icon: <ChatIcon sx={{ fontSize: 50, color: "#DC3545" }} />,
	},
	{
		title: "Advanced OTP Authentication",
		description:
			"Secured user access with a rate-limited OTP authentication system, restricting to 3 requests per period. Enhanced account lockout and recovery mechanisms ensure robust security against unauthorized access.",
		icon: <SecurityIcon sx={{ fontSize: 50, color: "#FFC107" }} />,
	},
	{
		title: "Comprehensive Financial Data Tracking",
		description:
			"Our Financial Data service meticulously tracks expenses and income by month, category, mood, and cognitive triggers. Gain deep insights into spending patterns and financial behavior for informed decision-making.",
		icon: <DataUsageIcon sx={{ fontSize: 50, color: "#1E90FF" }} />,
	},
	{
		title: "Automated Categorization",
		description:
			"Expensio automatically categorizes transactions, supporting custom cognitive triggers that reflect unique financial habits. This ensures accurate and insightful financial tracking tailored to individual user behavior.",
		icon: <BuildIcon sx={{ fontSize: 50, color: "#28A745" }} />,
	},
];

const FeaturesSection = () => {
	return (
		<Container
			maxWidth="lg"
			sx={{ py: { xs: 8, md: 12 }, backgroundColor: "#121212" }}
		>
			<Typography
				variant="h3"
				sx={{
					textAlign: "center",
					mb: 6,
					color: "#FFFFFF",
					fontWeight: "700",
					letterSpacing: "1px",
				}}
			>
				Key Features
			</Typography>
			<Grid container spacing={6}>
				{features.map((feature, idx) => (
					<Grid item xs={12} md={6} key={idx}>
						<Box
							sx={{
								p: 5,
								backgroundColor: "#1E1E1E",
								borderRadius: "16px",
								boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.5)",
								transition: "transform 0.3s, box-shadow 0.3s",
								"&:hover": {
									transform: "translateY(-10px)",
									boxShadow: "0px 8px 30px rgba(0, 0, 0, 0.7)",
								},
							}}
						>
							<Box sx={{ mb: 3 }}>{feature.icon}</Box>
							<Typography
								variant="h5"
								sx={{
									mb: 2,
									color: "#FFFFFF",
									fontWeight: "600",
									letterSpacing: "0.5px",
								}}
							>
								{feature.title}
							</Typography>
							<Typography
								variant="body1"
								sx={{ color: "#B0B0B0", lineHeight: "1.6" }}
							>
								{feature.description}
							</Typography>
						</Box>
					</Grid>
				))}
			</Grid>
		</Container>
	);
};

export default FeaturesSection;
