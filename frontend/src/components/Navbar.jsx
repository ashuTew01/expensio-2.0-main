import React, { useState } from "react";
import {
	LightModeOutlined,
	DarkModeOutlined,
	Menu as MenuIcon,
	Search,
	ArrowDropDownOutlined,
	// LocalAtm, // Importing the LocalAtm icon for AI Tokens
	MonetizationOn,
} from "@mui/icons-material";
import FlexBetween from "../components/FlexBetween";
import { useDispatch } from "react-redux";
import { setMode } from "../state";
// import { useGetUserQuery } from "state/api";
import { removeCredentials } from "../state/authSlice";
// import { useLogoutMutation } from "state/api";
import aiTokenIcon from "../assets/ai_tokens.svg";

import {
	AppBar,
	Button,
	Box,
	Typography,
	IconButton,
	InputBase,
	Toolbar,
	Menu,
	MenuItem,
	Tooltip, // Importing Tooltip for hover text
	useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useGetUserAiTokensDetailQuery } from "../state/api";

const Navbar = ({ isSidebarOpen, setIsSidebarOpen }) => {
	const dispatch = useDispatch();
	const theme = useTheme();

	const userInfo = JSON.parse(localStorage.getItem("userInfoExpensio"));
	// const { image: userImage, name: userName } = userInfo;

	const userImage = "";
	const userName = userInfo.first_name;

	const [anchorEl, setAnchorEl] = useState(null);
	const isOpen = Boolean(anchorEl);
	const handleClick = (event) => setAnchorEl(event.currentTarget);

	const { data: userAiTokensDetail, isLoading: isLoadingUserAiTokens } =
		useGetUserAiTokensDetailQuery();
	const aiTokens = userAiTokensDetail?.data?.currentTokens;

	// const { data: userInfo, isLoading } = useGetUserQuery();
	// const user = userInfo?.user;
	const navigate = useNavigate();

	// const [logoutApiCall] = useLogoutMutation();

	const logoutHandler = async () => {
		try {
			// await logoutApiCall().unwrap();
			dispatch(removeCredentials());
			navigate("/login");
		} catch (error) {
			console.log(error);
			// toast.error("Couldn't log you out. Try again!");
		}
		setAnchorEl(null);
	};

	return (
		<AppBar
			sx={{
				position: "static",
				background: "none",
				boxShadow: "none",
			}}
		>
			<Toolbar sx={{ justifyContent: "space-between" }}>
				{/* Left Side */}
				<FlexBetween>
					<IconButton
						onClick={() => setIsSidebarOpen(!isSidebarOpen)}
						sx={{ marginRight: "1rem" }}
					>
						<MenuIcon />
					</IconButton>
					{/* <FlexBetween
            backgroundColor={theme.palette.background.alt}
            borderRadius="9px"
            gap="3px"
            p="0.1rem 1.5rem"
          >
            <InputBase placeholder="Search..." />
            <IconButton>
              <Search />
            </IconButton>
          </FlexBetween> */}
				</FlexBetween>

				{/* RIGHT SIDE */}
				<FlexBetween gap="1.5rem">
					<IconButton onClick={() => dispatch(setMode())}>
						{theme.palette.mode === "dark" ? (
							<DarkModeOutlined sx={{ fontSize: "25px" }} />
						) : (
							<LightModeOutlined sx={{ fontSize: "25px" }} />
						)}
					</IconButton>

					{/* AI Tokens Button */}
					<Tooltip title="AI Tokens" placement="bottom">
						<Box>
							<Button
								variant="contained"
								sx={{
									backgroundColor: theme.palette.secondary.light, // Light secondary color for elegance
									color: theme.palette.primary.dark, // Ensures icon and text are visible
									borderRadius: "50px", // Fully rounded for a pill shape
									py: "0.5rem", // Adequate padding
									px: "1.5rem", // Adequate padding
									minWidth: "50px", // Ensures the button isn't too small
									height: "50px", // Ensures consistent height
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									gap: "0.5rem", // Space between icon and number
									boxShadow: "none", // Removes default shadow
									"&:hover": {
										backgroundColor: theme.palette.secondary.main, // Slight color change on hover
										boxShadow: "none",
									},
								}}
								// disabled // Button is not clickable yet
							>
								<img
									src={aiTokenIcon}
									alt="AI Tokens"
									style={{ width: "25px", height: "25px" }}
								/>{" "}
								{/* Icon */}
								<Typography
									// variant="h5"
									sx={{
										fontWeight: "bold",
										fontSize: "1.15rem",
										color: theme.palette.primary.dark,
									}}
								>
									{aiTokens ? Math.floor(Number(aiTokens)) : "0"}
									{/* Display integer AI Tokens */}
								</Typography>
							</Button>
						</Box>
					</Tooltip>

					{/* User Profile Section */}
					<FlexBetween>
						<Button
							onClick={handleClick}
							sx={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								textTransform: "none",
								gap: "1rem",
							}}
						>
							<Box
								component="img"
								alt="profile"
								src="https://cdn-icons-png.flaticon.com/512/9187/9187604.png"
								height="32px"
								width="32px"
								borderRadius="50%"
								sx={{ objectFit: "cover" }}
							/>
							{true && ( // here write !isLoading later.
								<Box textAlign="left">
									<Typography
										fontWeight="bold"
										fontSize="0.85rem"
										sx={{ color: theme.palette.secondary[100] }}
									>
										{userName} {/*write user?.name not user.name */}
									</Typography>
								</Box>
							)}
							<ArrowDropDownOutlined
								sx={{ color: theme.palette.secondary[300], fontSize: "25px" }}
							/>
						</Button>
						<Menu
							anchorEl={anchorEl}
							open={isOpen}
							onClose={logoutHandler}
							anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
						>
							<MenuItem onClick={logoutHandler}>Log Out</MenuItem>
						</Menu>
					</FlexBetween>
				</FlexBetween>
			</Toolbar>
		</AppBar>
	);
};

export default Navbar;
