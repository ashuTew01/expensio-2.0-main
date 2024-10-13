import React from "react";
import {
	Box,
	Typography,
	TextField,
	Button,
	Grid,
	CircularProgress,
	useTheme,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as yup from "yup";
import { useUpdateUserProfileMutation } from "../state/api"; // Assumed API hook
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../state/authSlice";

const UpdateProfileForm = () => {
	const theme = useTheme();
	const dispatch = useDispatch();

	// API Mutation Hook
	const [updateUserProfile, { isLoading, isError }] =
		useUpdateUserProfileMutation();

	const { userInfo } = useSelector((state) => state.auth);
	// Validation Schema
	const validationSchema = yup.object().shape({
		first_name: yup.string().required("First name is required."),
		last_name: yup.string(),
		bio: yup.string(),
	});

	// Initial values
	const initialValues = {
		first_name: userInfo.first_name,
		last_name: userInfo.last_name,
		bio: userInfo.bio,
	};

	// Handle form submission
	const handleSubmit = async (values, { setSubmitting, resetForm }) => {
		try {
			const response = await updateUserProfile(values).unwrap();

			if (response) {
				toast.success("Profile updated successfully!");
				dispatch(
					setUserInfo({
						...userInfo,
						first_name: response.user.first_name,
						last_name: response.user.last_name,
						bio: response.user.bio,
					})
				);

				resetForm();
			} else {
				toast.error("Failed to update profile. Please try again.");
			}
		} catch (error) {
			console.error("Error updating profile:", error);
			toast.error("Failed to update profile. Please try again.");
		} finally {
			setSubmitting(false);
		}
	};

	const backgroundColorStyle = {
		backgroundColor: theme.palette.background.default,
	};

	return (
		<Box mt={3}>
			<Typography
				variant="h3"
				sx={{ color: theme.palette.secondary[100], fontWeight: "bold" }}
			>
				Update Profile
			</Typography>
			<Box mt={3}>
				<Formik
					initialValues={initialValues}
					validationSchema={validationSchema}
					onSubmit={handleSubmit}
					enableReinitialize={true}
				>
					{({
						values,
						errors,
						touched,
						handleChange,
						handleBlur,
						isSubmitting,
					}) => (
						<Form>
							<Grid container spacing={2}>
								{/* First Name Field */}
								<Grid item xs={12} sm={6}>
									<TextField
										sx={{
											...backgroundColorStyle,
											"& .MuiFormHelperText-root": {
												backgroundColor: theme.palette.background.alt, // Light red background for error message
												color: "red", // Text color for error message
												padding: "4px 8px", // Add some padding for better spacing
												borderRadius: "4px", // Rounded corners for the error message background
												margin: 0, // Remove margin to ensure it aligns with the input field
												width: "100%", // Ensure the background covers the full width
												boxSizing: "border-box", // Ensure padding doesn't affect width calculations
											},
										}}
										label="First Name"
										name="first_name"
										variant="outlined"
										value={values.first_name}
										onChange={handleChange}
										onBlur={handleBlur}
										required
										fullWidth
										error={touched.first_name && Boolean(errors.first_name)}
										helperText={touched.first_name && errors.first_name}
									/>
								</Grid>

								{/* Last Name Field */}
								<Grid item xs={12} sm={6}>
									<TextField
										sx={{
											...backgroundColorStyle,
											"& .MuiFormHelperText-root": {
												backgroundColor: theme.palette.background.alt, // Light red background for error message
												color: "red", // Text color for error message
												padding: "4px 8px", // Add some padding for better spacing
												borderRadius: "4px", // Rounded corners for the error message background
												margin: 0, // Remove margin to ensure it aligns with the input field
												width: "100%", // Ensure the background covers the full width
												boxSizing: "border-box", // Ensure padding doesn't affect width calculations
											},
										}}
										label="Last Name"
										name="last_name"
										variant="outlined"
										value={values.last_name}
										onChange={handleChange}
										onBlur={handleBlur}
										fullWidth
										error={touched.last_name && Boolean(errors.last_name)}
										helperText={touched.last_name && errors.last_name}
									/>
								</Grid>

								{/* Bio Field */}
								<Grid item xs={6}>
									<TextField
										sx={backgroundColorStyle}
										label="Bio"
										name="bio"
										variant="outlined"
										value={values.bio}
										onChange={handleChange}
										onBlur={handleBlur}
										fullWidth
										multiline
										rows={3}
										error={touched.bio && Boolean(errors.bio)}
										helperText={touched.bio && errors.bio}
									/>
								</Grid>
							</Grid>

							{/* Submit Button */}
							<Button
								type="submit"
								variant="outlined"
								color="secondary"
								disabled={isSubmitting || isLoading}
								sx={{ mt: 2, fontSize: 15, p: 2, paddingInline: 4 }}
							>
								{isLoading ? <CircularProgress size={24} /> : "Update Profile"}
							</Button>

							{/* Error Message */}
							{isError && (
								<Typography variant="body1" color="error" sx={{ mt: 2 }}>
									Error updating profile. Please try again.
								</Typography>
							)}
						</Form>
					)}
				</Formik>
			</Box>
		</Box>
	);
};

export default UpdateProfileForm;
