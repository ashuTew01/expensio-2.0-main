// src/components/landingPage/TechnicalAchievements.jsx
import React from "react";
import { Box, Grid, Typography, Container } from "@mui/material";
import CloudQueueIcon from "@mui/icons-material/CloudQueue";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import SecurityIcon from "@mui/icons-material/Security";
import CodeIcon from "@mui/icons-material/Code";
import RepeatIcon from "@mui/icons-material/Repeat";
import { motion } from "framer-motion";

const techDetails = [
	{
		title: "Event-Driven Microservices Architecture with Kafka",
		description:
			"Expensio utilizes a microservices architecture with Kafka at its core, enabling efficient real-time event handling and ensuring that services operate independently for better scalability and performance.",
		icon: <CodeIcon sx={{ fontSize: 50, color: "#1E90FF" }} />,
	},
	{
		title: "Event Replay & Dead Letter Queue",
		description:
			"Expensio supports event replay for new services to catch up on historical data. Failed events are handled through a Dead Letter Queue, ensuring no data loss and robust system reliability.",
		icon: <RepeatIcon sx={{ fontSize: 50, color: "#FF69B4" }} />,
	},
	{
		title: "Distributed Saga Pattern",
		description:
			"The Distributed Saga Pattern ensures consistency across financial transactions involving multiple services. This approach guarantees data reliability and system-wide consistency.",
		icon: <SyncAltIcon sx={{ fontSize: 50, color: "#DC3545" }} />,
	},
	{
		title: "Kubernetes Orchestration",
		description:
			"Expensio is fully containerized using Docker and orchestrated with Kubernetes, allowing seamless scaling, stable deployments, and maintaining high availability even during peak loads.",
		icon: <CloudQueueIcon sx={{ fontSize: 50, color: "#28A745" }} />,
	},
	{
		title: "OTP Authentication with Rate Limiting",
		description:
			"Expensio ensures secure account access through rate-limited OTP authentication, protecting users from brute-force attacks and ensuring data security with strong encryption and account lockout features.",
		icon: <SecurityIcon sx={{ fontSize: 50, color: "#FFC107" }} />,
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
