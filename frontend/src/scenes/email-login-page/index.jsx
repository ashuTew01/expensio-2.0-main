// src/pages/auth/EmailLoginPage.jsx
import React, { useState, useEffect } from "react";
import {
	CssBaseline,
	Box,
	Typography,
	TextField,
	Button,
	Grid,
	Link,
} from "@mui/material";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { useSendOtpMutation } from "../../state/api";
import { useDispatch, useSelector } from "react-redux";
import { setIfUserExist } from "../../state/authSlice";
import { toast, ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";
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

const StyledTextField = styled(TextField)(({ theme }) => ({
	"& .MuiInputBase-input": {
		color: "#fff",
	},
	"& label": {
		color: "#aaa",
	},
	"& label.Mui-focused": {
		color: "#fff",
	},
	"& .MuiInput-underline:after": {
		borderBottomColor: "#fff",
	},
	"& .MuiOutlinedInput-root": {
		"& fieldset": {
			borderColor: "#aaa",
		},
		"&:hover fieldset": {
			borderColor: "#fff",
		},
		"&.Mui-focused fieldset": {
			borderColor: "#fff",
		},
	},
}));

const EmailLoginPage = () => {
	const [email, setEmail] = useState("");
	const [sendOtp] = useSendOtpMutation();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const { userInfo } = useSelector((state) => state.auth);

	useEffect(() => {
		if (userInfo) {
			navigate("/dashboard");
		}
	}, [navigate, userInfo]);

	const onClickHandler = async () => {
		if (!email) {
			toast.error("Please enter a valid email address");
			return;
		}

		try {
			const response = await sendOtp({ email }).unwrap();
			toast.success(response.message);
			dispatch(setIfUserExist(response.userExists));

			navigate("/otp", { state: { email } });
		} catch (err) {
			console.error(err);
			toast.error(err.data?.error || "Failed to send OTP");
		}
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
					Welcome to Expensio
				</Typography>
				<Typography
					variant="body1"
					align="center"
					gutterBottom
					sx={{ color: "#ccc" }}
				>
					Please enter your email to receive a verification code
				</Typography>
				<Box component="form" noValidate sx={{ mt: 1 }}>
					<StyledTextField
						variant="outlined"
						margin="normal"
						required
						fullWidth
						id="email"
						label="Email Address"
						name="email"
						autoComplete="email"
						autoFocus
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<StyledButton
						type="button"
						fullWidth
						variant="contained"
						// color={"#f5bd02"}
						onClick={onClickHandler}
						component={motion.button}
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
					>
						Send OTP
					</StyledButton>
					<Grid container justifyContent="center" sx={{ mt: 2 }}>
						<Grid item>
							<Link href="/" variant="body2" sx={{ color: "#fff" }}>
								{"Back to Home"}
							</Link>
						</Grid>
					</Grid>
				</Box>
			</GlassCard>
		</BackgroundContainer>
	);
};

export default EmailLoginPage;
