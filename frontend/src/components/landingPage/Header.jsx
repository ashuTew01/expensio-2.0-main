// src/components/landingPage/Header.jsx
import React from "react";
import {
	AppBar,
	Toolbar,
	Typography,
	Button,
	Box,
	IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu"; // Using available Material-UI icon
import { useNavigate } from "react-router-dom";

const Header = () => {
	const navigate = useNavigate();

	const handleLoginButtonClick = () => {
		navigate("/login");
	};

	return (
		<AppBar
			position="fixed"
			sx={{
				backgroundColor: "#0D0D0D",
				color: "#FFFFFF",
				boxShadow: "none",
				borderBottom: "1px solid #333",
				zIndex: 1300, // Ensure header is on top
			}}
		>
			<Toolbar>
				<Typography
					variant="h5"
					sx={{
						flexGrow: 1,
						fontWeight: "bold",
						letterSpacing: "2px",
						cursor: "pointer",
						transition: "color 0.3s",
						"&:hover": {
							color: "#1E90FF",
						},
					}}
					onClick={() => navigate("/")}
				>
					EXPENSIO
				</Typography>
				<Box display={{ xs: "none", md: "block" }}>
					<Button
						variant="contained"
						sx={{
							backgroundColor: "#1E90FF",
							color: "#0D0D0D",
							fontWeight: "bold",
							marginLeft: 2,
							textTransform: "none",
							paddingX: 3,
							paddingY: 1,
							borderRadius: "8px",
							boxShadow: "0px 4px 15px rgba(30, 144, 255, 0.4)",
							transition: "background-color 0.3s, transform 0.3s",
							"&:hover": {
								backgroundColor: "#63B3ED",
								transform: "scale(1.05)",
								boxShadow: "0px 6px 20px rgba(30, 144, 255, 0.6)",
							},
						}}
						onClick={handleLoginButtonClick}
					>
						Sign In / Register
					</Button>
				</Box>
				<Box display={{ xs: "block", md: "none" }}>
					<IconButton
						edge="start"
						color="inherit"
						aria-label="menu"
						sx={{ mr: 2 }}
					>
						<MenuIcon />
					</IconButton>
				</Box>
			</Toolbar>
		</AppBar>
	);
};

export default Header;
