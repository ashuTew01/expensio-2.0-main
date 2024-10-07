import * as React from "react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import OtpInput from "react-otp-input";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";

import { useTheme } from "@mui/material/styles"; // Still using MUI's useTheme

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Grid from "@mui/material/Grid";
import { useVerifyOtpMutation } from "../../state/api";
import { useDispatch, useSelector } from "react-redux";
import { setToken, setUserInfo } from "../../state/authSlice";

// Styled components instead of makeStyles
const GridContainer = styled(Grid)`
	height: 50vh;
	text-align: center;
`;

const StyledAvatar = styled(Avatar)`
	margin: ${(props) => props.theme.spacing(1)};
`;

const SubmitButton = styled(Button)`
	margin: ${(props) => props.theme.spacing(3, 0, 2)};
	background-color: black;
`;

const PaperContainer = styled("div")(({ theme }) => ({
	marginTop: theme.spacing(8),
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
}));

export default function OtpPage() {
	const theme = useTheme();
	const navigate = useNavigate();
	const location = useLocation();
	const dispatch = useDispatch();

	const userExists = useSelector((state) => state.auth.userExists);
	const [verifyOtp, { isLoading, error }] = useVerifyOtpMutation();

	const [otp, setOtp] = useState("");
	const [phoneNumber] = useState(location.state?.phoneNumber || "");

	const onClickHandler = async () => {
		try {
			if (otp.length === 6) {
				// Assuming OTP length is 6
				if (!userExists) {
					navigate("/user-data-form", { state: { phoneNumber, otp } });
				} else {
					const response = await verifyOtp({
						phone: phoneNumber,
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

	const renderInput = (props) => (
		<input
			{...props}
			style={{
				width: "3rem",
				height: "3rem",
				margin: "0 1rem",
				fontSize: "2rem",
				borderRadius: 4,
				border: "1px solid rgba(0,0,0,0.3)",
				textAlign: "center",
			}}
		/>
	);

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
									Verification Code
								</Typography>
							</Grid>
						</Grid>
					</Grid>
					<Grid item xs={12} textAlign="center">
						<Paper elevation={0}>
							<Typography
								variant="h6"
								backgroundColor={theme.palette.background.default}
							>
								Please enter the verification code sent to your mobile
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
							<OtpInput
								value={otp}
								onChange={(otp) => setOtp(otp)}
								numInputs={6}
								renderInput={renderInput}
								separator={
									<span>
										<strong>.</strong>
									</span>
								}
							/>
						</Grid>
						<Grid item>
							<SubmitButton
								type="submit"
								fullWidth
								variant="contained"
								color="primary"
								onClick={onClickHandler}
							>
								Next
							</SubmitButton>
						</Grid>
					</Grid>
				</GridContainer>
			</PaperContainer>
		</Container>
	);
}
