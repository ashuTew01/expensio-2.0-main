import * as React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { styled } from "@mui/material/styles";
import { useSendOtpMutation } from "../../state/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { setIfUserExist } from "../../state/authSlice";

// Copyright component
function Copyright(props) {
	return (
		<Typography
			variant="body2"
			color="text.secondary"
			align="center"
			{...props}
		>
			{"Copyright © "}
			<Link color="inherit" href="#">
				Expensio
			</Link>{" "}
			{new Date().getFullYear()}
			{"."}
		</Typography>
	);
}

// Styled Components replacing makeStyles
const PaperContainer = styled("div")(({ theme }) => ({
	marginTop: theme.spacing(8),
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
	margin: theme.spacing(1),
}));

const SubmitButton = styled(Button)(({ theme }) => ({
	margin: theme.spacing(3, 0, 2),
	backgroundColor: "black",
}));

const GridContainer = styled(Grid)(({ theme }) => ({
	height: "50vh",
	textAlign: "center",
}));

const PhoneInputContainer = styled("div")({
	width: "100%",
});

export default function PhoneNumberPage() {
	const [phoneNumber, setPhoneNumber] = useState("");
	const [sendOtp, { isLoading, error }] = useSendOtpMutation();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const { userInfo } = useSelector((state) => state.auth);

	useEffect(() => {
		if (userInfo) {
			navigate("/dashboard");
		}
	}, [navigate, userInfo]);

	const onClickHandler = async () => {
		// console.log(phoneNumber);
		try {
			const response = await sendOtp({ phone: phoneNumber }).unwrap();
			toast.success(response.message);
			dispatch(setIfUserExist(response.userExists));

			if (response?.otp) {
				// console.log(response?.otp);
				navigate("/otp", { state: { phoneNumber, otp: response.otp } });
			} else {
				navigate("/otp", { state: { phoneNumber } });
			}
		} catch (err) {
			console.error(err);
			toast.error(err.data?.error || "Failed to send OTP");
		}
	};

	return (
		<Container component="main" maxWidth="sm">
			<CssBaseline />
			<PaperContainer>
				<GridContainer
					container
					justify="center"
					alignItems="center"
					spacing={3}
				>
					<Grid item container justify="center">
						<Grid item container alignItems="center" direction="column">
							<Grid item>
								<StyledAvatar>
									<LockOutlinedIcon />
								</StyledAvatar>
							</Grid>
							<Grid item>
								<Typography component="h1" variant="h5">
									Phone Number
								</Typography>
							</Grid>
						</Grid>
					</Grid>
					<Grid item xs={12} textAlign="center">
						<Paper elevation={0}>
							<Typography variant="h6">
								Please enter your phone number to receive a verification code
							</Typography>
						</Paper>
					</Grid>
					<Grid
						item
						xs={12}
						container
						justify="center"
						alignItems="center"
						direction="column"
					>
						<Grid container item spacing={3} justify="center">
							<PhoneInputContainer>
								<PhoneInput
									placeholder="Enter phone number"
									value={phoneNumber}
									onChange={setPhoneNumber}
									defaultCountry="IN"
								/>
							</PhoneInputContainer>
						</Grid>
						<Grid item>
							<SubmitButton
								type="submit"
								fullWidth
								variant="contained"
								color="primary"
								onClick={onClickHandler}
							>
								Send OTP
							</SubmitButton>
						</Grid>
					</Grid>
				</GridContainer>
			</PaperContainer>
			<ToastContainer />
		</Container>
	);
}
