// src/scenes/navbar/index.jsx
import React, { useState } from "react";
import {
	Menu as MenuIcon,
	ArrowDropDownOutlined,
	Add as AddIcon, // Importing the Add icon
} from "@mui/icons-material";
import FlexBetween from "../components/FlexBetween";
import { useDispatch } from "react-redux";
import { removeCredentials } from "../state/authSlice";
import aiTokenIcon from "../assets/ai_tokens.svg";

import {
	AppBar,
	Button,
	Box,
	Typography,
	IconButton,
	Toolbar,
	Menu,
	MenuItem,
	Tooltip,
	useTheme,
	Popover,
	Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useGetUserAiTokensDetailQuery } from "../state/api";
import { toast } from "react-toastify";

const Navbar = ({ isSidebarOpen, setIsSidebarOpen, isFixed }) => {
	const dispatch = useDispatch();
	const theme = useTheme();

	const userInfo = JSON.parse(localStorage.getItem("userInfoExpensio"));

	const userName = userInfo.first_name;

	const [anchorElUser, setAnchorElUser] = useState(null);
	const isOpenUserMenu = Boolean(anchorElUser);
	const handleUserMenuClick = (event) => setAnchorElUser(event.currentTarget);
	const handleUserMenuClose = () => setAnchorElUser(null);

	const [anchorElAdd, setAnchorElAdd] = useState(null);
	const isOpenAddMenu = Boolean(anchorElAdd);
	const handleAddMenuClick = (event) => setAnchorElAdd(event.currentTarget);
	const handleAddMenuClose = () => setAnchorElAdd(null);

	const { data: userAiTokensDetail, isLoading: isLoadingUserAiTokens } =
		useGetUserAiTokensDetailQuery();
	const aiTokens = userAiTokensDetail?.data?.currentTokens;

	const navigate = useNavigate();

	const logoutHandler = async () => {
		try {
			dispatch(removeCredentials());
			window.location.href = "/";
		} catch (error) {
			toast.error("Couldn't log you out. Try again!");
		}
		handleUserMenuClose();
	};

	const handleAddExpense = () => {
		navigate("/expense/add");
		handleAddMenuClose();
	};

	const handleAddIncome = () => {
		navigate("/income/add");
		handleAddMenuClose();
	};

	return (
		<AppBar
			position={isFixed ? "fixed" : "static"}
			sx={{
				background: "none",
				boxShadow: "none",
				zIndex: isFixed ? (theme) => theme.zIndex.drawer + 1 : undefined,
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
					{/* Left side content can go here */}
				</FlexBetween>

				{/* RIGHT SIDE */}
				<FlexBetween gap="1.5rem">
					{/* Plus Button */}
					<IconButton
						onClick={handleAddMenuClick}
						sx={{
							backgroundColor: theme.palette.secondary.light,
							color: theme.palette.primary.dark,
							"&:hover": {
								backgroundColor: theme.palette.secondary.main,
							},
						}}
					>
						<AddIcon />
					</IconButton>
					<Popover
						open={isOpenAddMenu}
						anchorEl={anchorElAdd}
						onClose={handleAddMenuClose}
						anchorOrigin={{
							vertical: "bottom",
							horizontal: "center",
						}}
						transformOrigin={{
							vertical: "top",
							horizontal: "center",
						}}
						PaperProps={{
							sx: {
								p: 2,
								backgroundColor: "rgba(0, 0, 0, 0.7)",
								boxShadow: theme.shadows[3],
								borderRadius: "8px",
								minWidth: "250px",
								maxWidth: "400px",
							},
						}}
					>
						<Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
							Don't want to fill a form?
						</Typography>
						<Typography variant="body2" sx={{ mb: 2 }}>
							Try using our Smart AI. It can help you add expenses/income,
							provide financial insights, and do much more on the go.
						</Typography>
						<Divider sx={{ mb: 2 }} />
						<Box display="flex" flexDirection="row" gap={1}>
							<Button
								variant="contained"
								color="primary"
								onClick={handleAddExpense}
								fullWidth
								sx={{
									backgroundColor: theme.palette.secondary.light,
									color: theme.palette.background.alt,
									fontSize: "11px",
									fontWeight: "bold",
									padding: "10px 20px",
									"&:hover": { backgroundColor: "#afafaf" },
								}}
							>
								Add Expense
							</Button>
							<Button
								variant="contained"
								color="primary"
								onClick={handleAddIncome}
								fullWidth
								sx={{
									backgroundColor: theme.palette.secondary.light,
									color: theme.palette.background.alt,
									fontSize: "11px",
									fontWeight: "bold",
									padding: "10px 20px",
									"&:hover": { backgroundColor: "#afafaf" },
								}}
							>
								Add Income
							</Button>
						</Box>
					</Popover>

					{/* AI Tokens Button */}
					<Tooltip title="AI Tokens" placement="bottom">
						<Box>
							<Button
								variant="contained"
								sx={{
									backgroundColor: theme.palette.secondary.light,
									color: theme.palette.primary.dark,
									borderRadius: "50px",
									py: "0.5rem",
									px: "1.5rem",
									minWidth: "50px",
									height: "50px",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									gap: "0.5rem",
									boxShadow: "none",
									"&:hover": {
										backgroundColor: theme.palette.secondary.main,
										boxShadow: "none",
									},
								}}
							>
								<img
									src={aiTokenIcon}
									alt="AI Tokens"
									style={{ width: "25px", height: "25px" }}
								/>{" "}
								{/* Icon */}
								<Typography
									sx={{
										fontWeight: "bold",
										fontSize: "1.15rem",
										color: theme.palette.primary.dark,
									}}
								>
									{aiTokens ? Math.floor(Number(aiTokens)) : "0"}
								</Typography>
							</Button>
						</Box>
					</Tooltip>

					{/* User Profile Section */}
					<FlexBetween>
						<Button
							onClick={handleUserMenuClick}
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
										{userName}
									</Typography>
								</Box>
							)}
							<ArrowDropDownOutlined
								sx={{ color: theme.palette.secondary[300], fontSize: "25px" }}
							/>
						</Button>
						<Menu
							anchorEl={anchorElUser}
							open={isOpenUserMenu}
							onClose={handleUserMenuClose}
							anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
						>
							<MenuItem onClick={logoutHandler}>Log Out</MenuItem>
							<MenuItem onClick={() => navigate("/user/update-profile")}>
								Update Profile
							</MenuItem>
						</Menu>
					</FlexBetween>
				</FlexBetween>
			</Toolbar>
		</AppBar>
	);
};

export default Navbar;
