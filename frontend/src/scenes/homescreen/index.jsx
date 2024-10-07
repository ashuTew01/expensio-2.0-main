import { Button } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import LandingPage from "../landingPage/index.jsx";
// import { useExpenseTestQuery } from "../../state/api";

const HomeScreen = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const dispatch = useDispatch();
	const { userInfo } = useSelector((state) => state.auth);
	// const [data, isLoading] = useExpenseTestQuery();

	useEffect(() => {
		// Function to extract the token and store it
		if (userInfo) {
			navigate("/dashboard");
		}
		const handleAuthentication = async () => {
			const searchParams = new URLSearchParams(window.location.search);
			const token = searchParams.get("token");

			if (token) {
				localStorage.setItem("tokenExpensio", JSON.stringify({ token }));

				const baseUrl = process.env.REACT_APP_BASE_URL;

				try {
					// console.log(token);
					const response = await fetch(`${baseUrl}/general/currentUser`, {
						method: "GET",
						headers: {
							Authorization: `Bearer ${token}`,
							"Content-Type": "application/json",
						},
					});

					if (response.ok) {
						const userData = await response.json();
						// dispatch(setCredentials(userData));
					} else {
						throw new Error("Failed to fetch user data");
					}
				} catch (error) {
					console.error("Error fetching user data:", error);
				}

				navigate("/dashboard"); // Redirect to dashboard or other internal route
			}
		};

		handleAuthentication();
	}, [location, navigate, dispatch, userInfo]);

	const redirectToLandingPage = () => {
		navigate("/");
	};

	// const redirectToRegister = () => {
	//   navigate("/register");
	// };
	// !isLoading && console.log(data);
	return <LandingPage />;
};

export default HomeScreen;
