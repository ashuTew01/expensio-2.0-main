import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import { TextField } from "@mui/material";
import { useSendOtpMutation } from "../../state/api";

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
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
    height: "50vh",
    textAlign: "center"
  },
  avatar: {
    margin: theme.spacing(1)
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
  },
  phoneInputContainer: {
    width: '100%',
  },
  phoneInput: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    outline: 'none',
    transition: 'border-color 0.3s',
    '&:focus': {
      borderColor: '#3f51b5',
      boxShadow: '0 0 0 1px #3f51b5',
    },
  },
}));



export default function PhoneNumberPage() {
  const classes = useStyles();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [sendOtp, {isLoading, error}] = useSendOtpMutation();
  const navigate = useNavigate();

  const onClickHandler = async () => {
    // Add your phone number submission logic here
    try {
      await sendOtp({phone: phoneNumber}).unwrap();

    } catch (error) {
      
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <CssBaseline />
      <div className={classes.paper}>
        <Grid
          container
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
              <div className={classes.phoneInputContainer}>
                <PhoneInput
                  placeholder="Enter phone number"
                  value={phoneNumber}
                  onChange={setPhoneNumber}
                  defaultCountry="IN"
                  inputComponent={(props) => <CustomInput {...props} />}
                />
              </div>
            </Grid>
            <Grid item>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={() => onClickHandler()}
              >
                Send OTP
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </Container>
  );
}

function CustomInput({ value, onChange, ...rest }) {
  return (
    <TextField
      variant="outlined"
      margin="normal"
      required
      fullWidth
      {...rest}
    />
  );
}
