// src/components/landingPage/TechnicalAchievements.jsx
import React from "react";
import { Box, Grid, Typography, Container } from "@mui/material";
import CloudQueueIcon from "@mui/icons-material/CloudQueue";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import SecurityIcon from "@mui/icons-material/Security";
import StorageIcon from "@mui/icons-material/Storage";
import CodeIcon from "@mui/icons-material/Code";
import RepeatIcon from "@mui/icons-material/Repeat";
import { motion } from "framer-motion";

const techDetails = [
	{
		title: "Advanced Microservices Architecture",
		description:
			"Utilized Node.js and Express to develop a robust microservices architecture. Each service operates independently, enabling seamless updates, deployments, and horizontal scaling without impacting the entire system.",
		icon: <CodeIcon sx={{ fontSize: 50, color: "#1E90FF" }} />,
	},
	{
		title: "Kafka-Powered Event Bus",
		description:
			"Implemented Apache Kafka for a highly efficient, event-driven system. Facilitated real-time data processing and communication between services, ensuring system decoupling and scalability.",
		icon: <CloudQueueIcon sx={{ fontSize: 50, color: "#28A745" }} />,
	},
	{
		title: "Distributed Saga Pattern",
		description:
			"Implemented the Distributed Saga Pattern to manage complex transactions across multiple microservices. This ensures data consistency and integrity in distributed workflows, enhancing reliability.",
		icon: <SyncAltIcon sx={{ fontSize: 50, color: "#DC3545" }} />,
	},
	{
		title: "Secure OTP Authentication",
		description:
			"Enhanced security with rate-limited OTP authentication and robust account lockout mechanisms. Utilized PostgreSQL for secure user data management and implemented encrypted data storage.",
		icon: <SecurityIcon sx={{ fontSize: 50, color: "#FFC107" }} />,
	},
	{
		title: "Containerization with Docker & Kubernetes",
		description:
			"Containerized microservices using Docker and orchestrated deployments with Kubernetes. Achieved seamless scaling, management, and high availability in a cloud-native environment.",
		icon: <CodeIcon sx={{ fontSize: 50, color: "#1E90FF" }} />, // Replace with Docker/Kubernetes icons if available
	},
	{
		title: "Idempotent and Transactional Services",
		description:
			"Designed services to be idempotent, ensuring safe event processing without duplicates. Leveraged MongoDB transactions to maintain data consistency across services.",
		icon: <StorageIcon sx={{ fontSize: 50, color: "#28A745" }} />,
	},
	{
		title: "Event Replay Capability",
		description:
			"Enabled event replay for new services, allowing them to subscribe to historical events. This ensures no data is missed and services stay updated with past and present events.",
		icon: <RepeatIcon sx={{ fontSize: 50, color: "#FF69B4" }} />,
	},
	{
		title: "AI-Driven Smart Chat Assistant",
		description:
			"Integrated an intelligent AI engine to power the Smart Chat Assistant. Users can interact naturally to manage finances, with the system intelligently processing and responding to queries.",
		icon: <CodeIcon sx={{ fontSize: 50, color: "#6A5ACD" }} />,
	},
];

const TechnicalAchievements = () => {
	return (
		<Box
			id="technical-achievements-section"
			sx={{
				py: { xs: 8, md: 12 },
				backgroundColor: "#121212",
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
					Technical Achievements
				</Typography>
				<Grid container spacing={6}>
					{techDetails.map((tech, idx) => (
						<Grid item xs={12} md={6} key={idx}>
							<motion.div
								initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
								whileInView={{ opacity: 1, x: 0 }}
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
										{tech.icon}
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
										{tech.title}
									</Typography>
									<Typography
										variant="body1"
										sx={{
											color: "#B0B0B0",
											lineHeight: "1.8",
											textAlign: "center",
											fontSize: "0.96rem",
										}}
									>
										{tech.description}
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

export default TechnicalAchievements;
