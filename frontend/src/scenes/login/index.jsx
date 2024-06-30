import * as React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
// import { useLoginMutation } from "../../state/api";
// import { setCredentials } from "../../state/authSlice";
import { toast } from "react-toastify";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { LinearProgress } from "@mui/material";

// Google Icon for the button
import GoogleIcon from "@mui/icons-material/Google";

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

export default function Login() {
	const theme = useTheme();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	// const [login, { isLoading }] = useLoginMutation();

	const { userInfo } = useSelector((state) => state.auth);
	const { search } = useLocation();
	const sp = new URLSearchParams(search);
	const redirect = sp.get("redirect") || "/dashboard";

	useEffect(() => {
		if (userInfo) {
			navigate(redirect);
		}
	}, [navigate, redirect, userInfo]);

	// const handleSubmit = async (event) => {
	//   event.preventDefault();
	//   const data = new FormData(event.currentTarget);
	//   const email = data.get("email");
	//   const password = data.get("password");

	//   try {
	//     const res = await login({ email, password }).unwrap();
	//     dispatch(setCredentials({ ...res }));
	//     navigate(redirect);
	//   } catch (err) {
	//     toast.error(err?.data?.message || err.error);
	//   }
	// };

	const handleGoogleLogin = () => {
		// Redirect user to your backend route that initiates Google OAuth
		window.location.href = "http://localhost:5000/auth/google";
	};

	return (
		<Container component="main" maxWidth="xs">
			<CssBaseline />
			<Box
				sx={{
					marginTop: 8,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				}}
			>
				<Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
					<LockOutlinedIcon />
				</Avatar>
				<Typography component="h1" variant="h5">
					Sign in
				</Typography>
				<Box
					component="form"
					//  onSubmit={handleSubmit}
					noValidate
					sx={{ mt: 1 }}
				>
					{/* <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          /> */}
					{/* <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button> */}
					{/* {isLoading && <LinearProgress />} */}
					{/* Google OAuth Button */}
					<Button
						startIcon={<GoogleIcon />}
						fullWidth
						variant="contained"
						onClick={handleGoogleLogin}
						sx={{ mt: 1, mb: 2, bgcolor: "error.main" }}
					>
						Sign in with Google
					</Button>
					{/* <Grid container>
            <Grid item>
              <Link href="/register" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid> */}
				</Box>
			</Box>
			<Copyright sx={{ mt: 8, mb: 4 }} />
		</Container>
	);
}
