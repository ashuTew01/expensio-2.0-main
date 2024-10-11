import React from "react";
import { Outlet, Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = () => {
	const navigate = useNavigate();

	const { userInfo } = useSelector((state) => state.auth);
	// console.log("User info:", userInfo);
	// console.log(userInfoEcoTrack);
	// const userInfoTemp = { name: "Ashutosh" };
	return userInfo ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
