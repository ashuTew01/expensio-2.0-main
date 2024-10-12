// src/pages/auth/EmailLoginPage.jsx
import React, { useEffect } from "react";
import {
	CssBaseline,
	Box,
	Typography,
	TextField,
	Button,
	Grid,
	Link,
	CircularProgress,
} from "@mui/material";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { useSendOtpMutation } from "../../state/api";
import { useDispatch, useSelector } from "react-redux";
import { setIfUserExist, setToken, setUserInfo } from "../../state/authSlice";
import { toast, ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import { useFormik } from "formik";
import * as Yup from "yup";
import "react-toastify/dist/ReactToastify.css";
import backgroundImage from "/auth-background.jpg"; // Replace with your image path

// Styled Components
const BackgroundContainer = styled(Box)(({ theme }) => ({
	minHeight: "100vh",
	backgroundImage: `url(${backgroundImage})`,
	backgroundSize: "cover",
	backgroundPosition: "center",
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	justifyContent: "center",
	position: "relative",
	padding: theme.spacing(2),
}));

const Header = styled(Box)(({ theme }) => ({
	position: "absolute",
	top: theme.spacing(2),
	right: theme.spacing(2),
	display: "flex",
	gap: theme.spacing(2),
	[theme.breakpoints.down("sm")]: {
		top: theme.spacing(1),
		right: theme.spacing(1),
		flexDirection: "column",
		gap: theme.spacing(1),
	},
}));

const GlassCard = styled(Box)(({ theme }) => ({
	backdropFilter: "blur(10px)",
	backgroundColor: "rgba(255, 255, 255, 0.1)",
	padding: theme.spacing(6),
	borderRadius: theme.spacing(2),
	boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
	maxWidth: 500,
	width: "100%",
	zIndex: 1,
}));

const StyledButton = styled(Button)(({ theme }) => ({
	padding: theme.spacing(1.5),
	fontSize: "1.2rem",
	fontWeight: "bold",
	borderRadius: theme.spacing(1),
	backgroundColor: "#238efa",
	color: "#fff",
	"&:hover": {
		backgroundColor: "#1c6ed8",
	},
	transition: "background-color 0.3s ease",
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
	"& .MuiFormHelperText-root": {
		color: "#ff6b6b",
	},
}));

const GuestLoginStyledButton = styled(StyledButton)(({ theme }) => ({
	backgroundColor: "#2079d4",
	padding: theme.spacing(1), // Reduced padding for a smaller button
	fontSize: "0.85rem", // Smaller font size
	minWidth: "150px", // Ensure the button isn't too small in width
	"&:hover": {
		backgroundColor: "#45a049",
	},
}));

const EmailLoginPage = () => {
	const [sendOtp, { isLoading }] = useSendOtpMutation();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const { userInfo } = useSelector((state) => state.auth);

	useEffect(() => {
		if (userInfo) {
			navigate("/dashboard");
		}
	}, [navigate, userInfo]);

	// Define Yup validation schema
	const validationSchema = Yup.object({
		email: Yup.string()
			.email("Enter a valid email")
			.required("Email is required"),
	});

	// Initialize Formik
	const formik = useFormik({
		initialValues: {
			email: "",
		},
		validationSchema: validationSchema,
		onSubmit: async (values) => {
			try {
				const response = await sendOtp({ email: values.email }).unwrap();
				toast.success(response.message);
				dispatch(setIfUserExist(response.userExists));
				navigate("/otp", { state: { email: values.email } });
			} catch (err) {
				console.error(err);
				toast.error(err.data?.error || "Failed to send OTP");
			}
		},
	});

	// Define the guest user information
	const guestUserInfo = {
		id: 0,
		phone: "+911234567890",
		first_name: "Guest",
		last_name: "User",
		username: "guest",
		email: "guest@test.com",
		profile_picture_url: null,
		bio: "This is the official guest user, intended for checking out features.",
	};

	const handleGuestLogin = () => {
		dispatch(setToken("guest"));
		dispatch(setUserInfo(guestUserInfo));
		toast.success("Logged in as Guest!");
		navigate("/dashboard"); // Replace with your desired route
	};

	return (
		<BackgroundContainer>
			<CssBaseline />
			<ToastContainer />

			{/* Header with Guest Login Button */}
			<Header>
				<GuestLoginStyledButton
					variant="outlined"
					onClick={handleGuestLogin}
					component={motion.button}
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					aria-label="Guest Login"
				>
					<Typography>Guest Login</Typography>
				</GuestLoginStyledButton>
			</Header>

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
				<Box
					component="form"
					noValidate
					sx={{ mt: 1 }}
					onSubmit={formik.handleSubmit}
				>
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
						value={formik.values.email}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						error={formik.touched.email && Boolean(formik.errors.email)}
						helperText={formik.touched.email && formik.errors.email}
					/>
					<StyledButton
						type="submit"
						fullWidth
						variant="contained"
						component={motion.button}
						disabled={isLoading || !formik.isValid || !formik.dirty}
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						sx={{ mt: 3, mb: 2 }}
					>
						{isLoading ? (
							<CircularProgress size={24} color="inherit" />
						) : (
							"Send OTP"
						)}
					</StyledButton>
					<Grid container justifyContent="center">
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
