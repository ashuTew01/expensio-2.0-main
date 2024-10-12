// src/components/landingPage/FeaturesSection.jsx
import React from "react";
import { Box, Grid, Typography, Container } from "@mui/material";

import InsightsIcon from "@mui/icons-material/Insights";
import PsychologyIcon from "@mui/icons-material/Psychology";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import BarChartIcon from "@mui/icons-material/BarChart";
import PieChartIcon from "@mui/icons-material/PieChart";
import { motion } from "framer-motion";

const features = [
	{
		title: "Revolutionary Financial Insights at Your Fingertips",
		description: `Expensio doesn’t just track your expenses—it revolutionizes how you understand your finances. Get real-time, beautifully visualized insights that show you exactly where your money is going, helping you take full control of your financial destiny like never before.`,
		icon: <InsightsIcon sx={{ fontSize: 50, color: "#1E90FF" }} />, // Changed to InsightsIcon
	},
	{
		title: "Unlock the Secrets of Your Spending Habits",
		description:
			"Ever wonder why you spend the way you do? Expensio decodes the psychology behind your purchases with cutting-edge Cognitive Trigger Analysis. Discover how subtle factors like social influence or impulse buying drive your decisions—and how to master them for ultimate financial freedom.",
		icon: <PsychologyIcon sx={{ fontSize: 50, color: "#FF5733" }} />, // Changed to PsychologyIcon
	},
	{
		title: "Your Personal AI Financial Guru",
		description:
			"Meet your AI-powered financial assistant—an always-on, super-intelligent guide that helps you manage your money effortlessly. Add expenses, get instant advice, and gain deep insights just by chatting. It’s like having your own financial advisor 24/7!",
		icon: <SmartToyIcon sx={{ fontSize: 50, color: "#DC3545" }} />, // Changed to SmartToyIcon
	},
	{
		title: "Tailored Financial Strategies with Summaries",
		description:
			"Experience a financial summary like never before. Expensio analyzes your spending, moods, and cognitive triggers to create a dynamic, actionable view of your financial behavior. Whether saving or cutting expenses, Expensio offers targeted strategies through visually stunning summaries, empowering you to make smarter decisions.",
		icon: <BarChartIcon sx={{ fontSize: 50, color: "#FFC107" }} />, // Changed to BarChartIcon
	},
	{
		title: "Next-Level Category Breakdown",
		description:
			"Dive deep into hyper-detailed category analysis. With stunning visual breakdowns, see where every rupee goes—from housing to personal care splurges. Get the clarity you need to fine-tune your budget and maximize your savings like a pro.",
		icon: <PieChartIcon sx={{ fontSize: 50, color: "#28A745" }} />, // Changed to PieChartIcon
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
