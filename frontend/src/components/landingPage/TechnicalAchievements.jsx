// src/components/landingPage/TechnicalAchievements.jsx
import React from "react";
import { Box, Grid, Typography, Container } from "@mui/material";
import CloudQueueIcon from "@mui/icons-material/CloudQueue"; // Using available Material-UI icons
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import SecurityIcon from "@mui/icons-material/Security";
import StorageIcon from "@mui/icons-material/Storage";
// import DockerIcon from "@mui/icons-material/Docker"; // Note: Material-UI may not have a Docker icon; using alternative
import CodeIcon from "@mui/icons-material/Code";

const techDetails = [
	{
		title: "Microservices Architecture",
		description:
			"Implemented a robust microservices architecture using Node.js and Express, enabling independent deployment and scalability of services such as User, Expense, Income, Financial Data, Dashboard, and Smart Chat Assistant.",
		icon: <CodeIcon sx={{ fontSize: 50, color: "#1E90FF" }} />,
	},
	{
		title: "Kafka-Driven Event Bus",
		description:
			"Leveraged Apache Kafka for an event-driven system, facilitating efficient message brokering and real-time data processing. This ensures seamless communication between microservices and supports event replay capabilities.",
		icon: <CloudQueueIcon sx={{ fontSize: 50, color: "#28A745" }} />,
	},
	{
		title: "Distributed Saga Pattern",
		description:
			"Implemented the Distributed Saga Pattern to manage complex transactions across multiple services, ensuring data consistency and atomicity in distributed workflows.",
		icon: <SyncAltIcon sx={{ fontSize: 50, color: "#DC3545" }} />,
	},
	{
		title: "Advanced Security Measures",
		description:
			"Ensured data integrity and security with rate-limited OTP authentication, account lockout mechanisms, and encrypted data storage using MongoDB and PostgreSQL.",
		icon: <SecurityIcon sx={{ fontSize: 50, color: "#FFC107" }} />,
	},
	{
		title: "Containerization with Docker & Kubernetes",
		description:
			"Containerized each microservice using Docker and orchestrated deployments with Kubernetes, facilitating seamless scaling, management, and high availability in a cloud-native environment.",
		icon: <SyncAltIcon sx={{ fontSize: 50, color: "#1E90FF" }} />, // If DockerIcon is unavailable, use another relevant icon
	},
	{
		title: "Idempotent and Transactional Services",
		description:
			"Designed all services to be idempotent, ensuring safe event processing without duplicates. Utilized MongoDB transactions to maintain data consistency across services.",
		icon: <StorageIcon sx={{ fontSize: 50, color: "#28A745" }} />,
	},
];

const TechnicalAchievements = () => {
	return (
		<Container
			maxWidth="lg"
			sx={{ py: { xs: 8, md: 12 }, backgroundColor: "#0D0D0D" }}
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
				Technical Achievements
			</Typography>
			<Grid container spacing={6}>
				{techDetails.map((tech, idx) => (
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
							<Box sx={{ mb: 3 }}>{tech.icon}</Box>
							<Typography
								variant="h5"
								sx={{
									mb: 2,
									color: "#FFFFFF",
									fontWeight: "600",
									letterSpacing: "0.5px",
								}}
							>
								{tech.title}
							</Typography>
							<Typography
								variant="body1"
								sx={{ color: "#B0B0B0", lineHeight: "1.6" }}
							>
								{tech.description}
							</Typography>
						</Box>
					</Grid>
				))}
			</Grid>
		</Container>
	);
};

export default TechnicalAchievements;
