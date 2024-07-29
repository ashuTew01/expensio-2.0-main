import * as React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
// import { useLoginMutation } from "../../state/api";
// import { setCredentials } from "../../state/authSlice";
import { toast } from "react-toastify";
import OtpInput from "react-otp-input"
import Paper from "@mui/material/Paper";
import { makeStyles, useTheme } from "@material-ui/core/styles"

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

const useStyles = makeStyles(theme => ({
	grid: {
	//   backgroundColor: "grey",
	  height: "50vh",
	  textAlign: "center"
	},
	avatar: {
	  margin: theme.spacing(1),
	//   backgroundColor: theme.palette.secondary.main
	},
	submit: {
	  margin: theme.spacing(3, 0, 2),
	  background: "black"
	},
	paper: {
	  marginTop: theme.spacing(8),
	  display: "flex",
	  flexDirection: "column",
	  alignItems: "center"
	}
  }));

  const onClickHandler = () => {
	
  }

export default function PhoneNumberPage() {
	const theme = useTheme();
	const classes = useStyles();

	const [otp, setOtp] = React.useState("");

	const renderInput = (props) => (
		<input
		  {...props}
		  style={{
			width: '3rem',
			height: '3rem',
			margin: '0 1rem',
			fontSize: '2rem',
			borderRadius: 4,
			border: '1px solid rgba(0,0,0,0.3)',
			textAlign: 'center',
		  }}
		/>
	  );

	

	return (
	<Container component="main" maxWidth="sm">
      <CssBaseline />
      <div className={classes.paper}>
        <Grid
          container
        //   style={{ backgroundColor: "white" }}
          className={classes.grid}
          justify="center"
          alignItems="center"
          spacing={3}
        >
          <Grid item container justify="center">
            <Grid item container alignItems="center" direction="column">
              <Grid item>
                <Avatar className={classes.avatar}>
                  <LockOutlinedIcon />
                </Avatar>
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
              <Typography variant="h6">
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
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
				onClick={onClickHandler}
              >
                Verify
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </Container>
  );
}
