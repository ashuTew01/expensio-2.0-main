// src/components/landingPage/Footer.jsx
import React from "react";
import {
	Box,
	Container,
	Grid,
	Typography,
	IconButton,
	Link,
} from "@mui/material";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import EmailIcon from "@mui/icons-material/Email";
import { HashLink } from "react-router-hash-link";

const Footer = () => {
	return (
		<Box
			sx={{
				backgroundColor: "#0D0D0D",
				color: "#FFFFFF",
				py: { xs: 6, md: 8 },
				borderTop: "1px solid #333",
			}}
		>
			<Container maxWidth="lg">
				<Grid container spacing={4}>
					{/* Logo and Description */}
					<Grid item xs={12} md={4}>
						<Typography
							variant="h5"
							sx={{
								fontWeight: "bold",
								letterSpacing: "2px",
								mb: 2,
							}}
						>
							EXPENSIO
						</Typography>
						<Typography
							variant="body2"
							sx={{ color: "#B0B0B0", lineHeight: "1.6" }}
						>
							Expensio is an advanced financial management platform leveraging
							cutting-edge technologies to provide unparalleled insights into
							your financial behavior.
						</Typography>
					</Grid>

					{/* Navigation Links */}
					<Grid item xs={12} md={4}>
						<Typography variant="h6" sx={{ mb: 2, fontWeight: "600" }}>
							Quick Links
						</Typography>
						<Box sx={{ display: "flex", flexDirection: "column" }}>
							{[
								{ text: "Home", to: "/#hero-section" },
								{ text: "Features", to: "/#features-section" },
								{
									text: "Technical Achievements",
									to: "/#technical-achievements-section",
								},
								{ text: "Team", to: "/#team-section" },
								{ text: "Contact", to: "/#contact-section" },
							].map((item, idx) => (
								<Link
									key={idx}
									component={HashLink}
									smooth
									to={item.to}
									scroll={(el) =>
										el.scrollIntoView({ behavior: "smooth", block: "start" })
									}
									sx={{
										color: "#B0B0B0",
										textDecoration: "none",
										mb: 1,
										cursor: "pointer",
										"&:hover": {
											color: "#1E90FF",
										},
									}}
								>
									{item.text}
								</Link>
							))}
						</Box>
					</Grid>

					{/* Contact and Social Media */}
					<Grid item xs={12} md={4}>
						<Typography variant="h6" sx={{ mb: 2, fontWeight: "600" }}>
							Get in Touch
						</Typography>
						<Typography variant="body2" sx={{ color: "#B0B0B0", mb: 2 }}>
							Have questions or want to collaborate? Reach out to us on social
							media or send us an email.
						</Typography>
						<Box sx={{ display: "flex", alignItems: "center" }}>
							<IconButton
								href="https://www.linkedin.com/in/ashutew0117//"
								target="_blank"
								rel="noopener noreferrer"
								sx={{
									color: "#1E90FF",
									"&:hover": {
										color: "#0e76a8",
									},
								}}
							>
								<LinkedInIcon />
							</IconButton>
							<IconButton
								href="https://github.com/ashuTew01"
								target="_blank"
								rel="noopener noreferrer"
								sx={{
									color: "#FFFFFF",
									"&:hover": {
										color: "#6e5494",
									},
								}}
							>
								<GitHubIcon />
							</IconButton>
							<IconButton
								href="mailto:ashutew987@gmail.com"
								sx={{
									color: "#FFFFFF",
									"&:hover": {
										color: "#EA4335",
									},
								}}
							>
								<EmailIcon />
							</IconButton>
						</Box>
					</Grid>
				</Grid>

				<Box
					sx={{
						mt: 6,
						borderTop: "1px solid #333",
						pt: 3,
						textAlign: "center",
					}}
				>
					<Typography variant="body2" sx={{ color: "#B0B0B0" }}>
						© {new Date().getFullYear()} Expensio. All rights reserved.
					</Typography>
				</Box>
			</Container>
		</Box>
	);
};

export default Footer;
