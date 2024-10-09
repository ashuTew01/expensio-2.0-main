// src/pages/auth/OtpPage.jsx
import React, { useState } from "react";
import {
	Container,
	CssBaseline,
	Box,
	Typography,
	Button,
	Grid,
	Link,
} from "@mui/material";
import { styled } from "@mui/system";
import { useNavigate, useLocation } from "react-router-dom";
import { useVerifyOtpMutation } from "../../state/api";
import { useDispatch, useSelector } from "react-redux";
import { setToken, setUserInfo } from "../../state/authSlice";
import { toast, ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";
import OtpInput from "react-otp-input";
import backgroundImage from "/auth-background.jpg"; // Replace with your image path

const BackgroundContainer = styled(Box)({
	minHeight: "100vh",
	backgroundImage: `url(${backgroundImage})`,
	backgroundSize: "cover",
	backgroundPosition: "center",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
});

const GlassCard = styled(Box)(({ theme }) => ({
	backdropFilter: "blur(10px)",
	backgroundColor: "rgba(255, 255, 255, 0.1)",
	padding: theme.spacing(6),
	borderRadius: theme.spacing(2),
	boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
	maxWidth: 500,
	width: "100%",
}));

const StyledButton = styled(Button)(({ theme }) => ({
	marginTop: theme.spacing(4),
	padding: theme.spacing(1.5),
	fontSize: "1.2rem",
	fontWeight: "bold",
	borderRadius: theme.spacing(1),
	backgroundColor: "#238efa",
}));

const OtpPage = () => {
	const [otp, setOtp] = useState("");
	const navigate = useNavigate();
	const location = useLocation();
	const dispatch = useDispatch();

	const email = location.state?.email || "";
	const userExists = useSelector((state) => state.auth.userExists);
	const [verifyOtp] = useVerifyOtpMutation();

	const onClickHandler = async () => {
		try {
			if (otp.length === 6) {
				// Assuming OTP length is 6
				if (!userExists) {
					navigate("/user-data-form", { state: { email, otp } });
				} else {
					const response = await verifyOtp({
						email,
						otp,
					}).unwrap();

					if (response.token) {
						dispatch(setUserInfo(response.user));
						dispatch(setToken(response.token));
						toast.success(response.message);
						navigate("/dashboard"); // Redirect to home or another page
					} else {
						toast.error(response.message || "Failed to verify OTP");
					}
				}
			} else {
				toast.error("Please enter a valid 6-digit OTP");
			}
		} catch (err) {
			console.error(err);
			toast.error("Failed to handle OTP");
		}
	};

	// Styles for the OTP input fields
	const inputStyle = {
		width: "3rem",
		height: "3rem",
		margin: "0 0.5rem",
		fontSize: "2rem",
		borderRadius: "8px",
		border: "1px solid rgba(255, 255, 255, 0.3)",
		backgroundColor: "rgba(255, 255, 255, 0.1)",
		color: "#fff",
		textAlign: "center",
		outline: "none",
	};

	const containerStyle = {
		display: "flex",
		justifyContent: "center",
		marginBottom: "2rem",
	};

	// Provide a default renderInput function
	const renderInput = (props, index) => {
		return <input {...props} key={index} />;
	};

	return (
		<BackgroundContainer>
			<CssBaseline />
			<ToastContainer />
			<GlassCard
				component={motion.div}
				initial={{ opacity: 0, y: 50 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 1 }}
			>
				<Typography
					variant="h4"
					align="center"
					gutterBottom
					sx={{ color: "#fff" }}
				>
					Verify Your Email
				</Typography>
				<Typography
					variant="body1"
					align="center"
					sx={{ color: "#ccc", mb: 4 }}
				>
					Enter the 6-digit code sent to your email
				</Typography>
				<OtpInput
					value={otp}
					onChange={setOtp}
					numInputs={6}
					isInputNum
					shouldAutoFocus
					inputStyle={inputStyle}
					containerStyle={containerStyle}
					renderInput={renderInput} // Added this line
				/>
				<StyledButton
					type="button"
					fullWidth
					variant="contained"
					color="primary"
					onClick={onClickHandler}
					component={motion.button}
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
				>
					Verify OTP
				</StyledButton>
				<Grid container justifyContent="center" sx={{ mt: 2 }}>
					<Grid item>
						<Link href="/login" variant="body2" sx={{ color: "#fff" }}>
							{"Back to Login"}
						</Link>
					</Grid>
				</Grid>
			</GlassCard>
		</BackgroundContainer>
	);
};

export default OtpPage;
