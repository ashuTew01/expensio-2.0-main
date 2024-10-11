// src/components/ConfirmationDialog.jsx

import React from "react";
import PropTypes from "prop-types";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Button,
	useMediaQuery,
	useTheme,
} from "@mui/material";

const ConfirmationDialog = ({
	open,
	title = "Confirm Action",
	message = "Are you sure you want to proceed?",
	onConfirm,
	onCancel,
	confirmText = "Confirm",
	cancelText = "Cancel",
	confirmButtonColor = "primary",
	cancelButtonColor = "secondary",
}) => {
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

	return (
		<Dialog
			open={open}
			onClose={onCancel}
			aria-labelledby="confirmation-dialog-title"
			aria-describedby="confirmation-dialog-description"
			fullScreen={fullScreen}
		>
			<DialogTitle id="confirmation-dialog-title" sx={{ fontSize: "1.2rem" }}>
				{title}
			</DialogTitle>
			<DialogContent>
				<DialogContentText id="confirmation-dialog-description">
					{message}
				</DialogContentText>
			</DialogContent>
			<DialogActions sx={{ pb: "1rem", pr: "1.2rem" }}>
				<Button
					variant="contained"
					onClick={onCancel}
					color={cancelButtonColor}
					sx={{
						backgroundColor: theme.palette.secondary.light,
						color: theme.palette.background.alt,
						fontSize: "11px",
						fontWeight: "bold",

						"&:hover": { backgroundColor: "#afafaf" },
					}}
				>
					{cancelText}
				</Button>
				<Button
					onClick={onConfirm}
					color={confirmButtonColor}
					variant="contained"
					autoFocus
				>
					{confirmText}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

ConfirmationDialog.propTypes = {
	open: PropTypes.bool.isRequired,
	title: PropTypes.string,
	message: PropTypes.string,
	onConfirm: PropTypes.func.isRequired,
	onCancel: PropTypes.func.isRequired,
	confirmText: PropTypes.string,
	cancelText: PropTypes.string,
	confirmButtonColor: PropTypes.oneOf([
		"inherit",
		"primary",
		"secondary",
		"success",
		"error",
		"info",
		"warning",
	]),
	cancelButtonColor: PropTypes.oneOf([
		"inherit",
		"primary",
		"secondary",
		"success",
		"error",
		"info",
		"warning",
	]),
};

export default ConfirmationDialog;
