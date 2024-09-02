import * as React from "react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import * as yup from "yup";
import { Formik, Field, Form } from "formik";
import { useVerifyOtpMutation } from "../../state/api";
import { setUserInfo, setToken } from "../../state/authSlice";
import { useDispatch } from "react-redux";


const formSchema = yup.object().shape({
  firstName: yup.string().required("This is a required field."),
  lastName: yup.string(),
  username: yup.string().required("This is a required field."),
  email: yup.string().email("Invalid email entered").required("This is a required field."),
  bio: yup.string(),
  dateOfBirth: yup.date().nullable(),
  phone: yup.string()
    .matches(/^\+91[789]\d{9}$/, "Invalid phone number. Must start with +91 followed by 10 digits starting with 7, 8, or 9.")
    .required("This is a required field."),
});


const useStyles = makeStyles(theme => ({
  grid: {
    height: "50vh",
    textAlign: "center"
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

const currentDate = new Date().toISOString().split('T')[0];


export default function UserDataForm() {
  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [otp] = useState(location.state?.otp || "");
  const phone = location.state?.phoneNumber || ""; // Extract phone number from location.state
  const [verifyOtp, { isLoading, error }] = useVerifyOtpMutation(); 

  console.log(phone);
  // Use Formik to handle form state and submission
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      console.log(values.phone);
      const response = await verifyOtp({ phone: values.phone, otp, userData: values }).unwrap();
      if (response.token) {
        dispatch(setUserInfo(response.user));
        dispatch(setToken(response.token));
        toast.success(response.message);
        navigate("/dashboard"); // Redirect to home or another page
      } else {
        toast.error(response.message || "Failed to verify OTP");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error submitting user data");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <CssBaseline />
      <div className={classes.paper}>
        <Grid
          container
          className={classes.grid}
          justifyContent="center"
          alignItems="center"
          spacing={3}
        >
          <Grid item container justifyContent="center">
            <Grid item container alignItems="center" direction="column">
              <Grid item>
                <Typography component="h1" variant="h5">
                  User Information
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Paper elevation={0}>
              <Typography variant="h6">
                Please provide your details to complete registration
              </Typography>
            </Paper>
          </Grid>
          <Grid
            item
            xs={12}
            container
            justifyContent="center"
            alignItems="center"
            direction="column"
          >
            <Grid item>
              <Formik
                initialValues={{
                  firstName: '',
                  lastName: '',
                  username: '',
                  email: '',
                  bio: '',
                  dateOfBirth: currentDate,
                  phone: phone, // Set phone number from location.state
                }}
                validationSchema={formSchema}
                onSubmit={handleSubmit}
              >
                {({ errors, touched, handleChange, handleBlur, values, isSubmitting }) => (
                  <Form>
                    <Field
                      as={TextField}
                      name="firstName"
                      label="First Name"
                      fullWidth
                      margin="normal"
                      value={values.firstName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.firstName && !!errors.firstName}
                      helperText={touched.firstName && errors.firstName}
                      required
                    />
                    <Field
                      as={TextField}
                      name="lastName"
                      label="Last Name"
                      fullWidth
                      margin="normal"
                      value={values.lastName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.lastName && !!errors.lastName}
                      helperText={touched.lastName && errors.lastName}
                    />
                    <Field
                      as={TextField}
                      name="username"
                      label="Username"
                      fullWidth
                      margin="normal"
                      value={values.username}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.username && !!errors.username}
                      helperText={touched.username && errors.username}
                      required
                    />
                    <Field
                      as={TextField}
                      name="email"
                      label="Email"
                      type="email"
                      fullWidth
                      margin="normal"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.email && !!errors.email}
                      helperText={touched.email && errors.email}
                      required
                    />
                    <Field
                      as={TextField}
                      name="phoneNumber"
                      label="Phone Number"
                      fullWidth
                      margin="normal"
                      value={values.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.phone && !!errors.phone}
                      helperText={touched.phone && errors.phone}
                      required
                      disabled
                    />
                    <Field
                      as={TextField}
                      name="dateOfBirth"
                      label="Date of Birth"
                      type="date"
                      fullWidth
                      margin="normal"
                      value={values.dateOfBirth}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.dateOfBirth && !!errors.dateOfBirth}
                      helperText={touched.dateOfBirth && errors.dateOfBirth}
                    />
                    <Field
                      as={TextField}
                      name="bio"
                      label="Bio"
                      multiline
                      rows={4}
                      fullWidth
                      margin="normal"
                      value={values.bio}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.bio && !!errors.bio}
                      helperText={touched.bio && errors.bio}
                    />
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="primary"
                      className={classes.submit}
                      disabled={isSubmitting || isLoading}
                    >
                      Submit
                    </Button>
                    {error && toast.error("Failed to verify OTP")}
                  </Form>
                )}
              </Formik>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </Container>
  );
}