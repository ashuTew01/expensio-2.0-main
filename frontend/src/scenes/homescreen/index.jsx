import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LandingPage from "../landingPage/index.jsx";

const HomeScreen = () => {
	const navigate = useNavigate();
	const { token } = useSelector((state) => state.auth);

	useEffect(() => {
		if (token) {
			navigate("/dashboard");
		}
	}, [navigate, token]);

	// Don't render the LandingPage if token is present
	if (token) {
		// return null or loading screen
		return null;
	}

	return <LandingPage />;
};

export default HomeScreen;
