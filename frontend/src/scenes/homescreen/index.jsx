import { Button } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { setCredentials } from "../../state/authSlice";
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
          console.log(token);
          const response = await fetch(`${baseUrl}/general/currentUser`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            const userData = await response.json();
            dispatch(setCredentials(userData));
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

  const redirectToLogin = () => {
    navigate("/login");
  };

  // const redirectToRegister = () => {
  //   navigate("/register");
  // };
  // !isLoading && console.log(data);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      to
      <h1>EXPENSIO</h1>
      <Button variant="contained" onClick={redirectToLogin}>
        Login
      </Button>
      {/* <Button variant="contained" onClick={redirectToRegister}>
        Register
      </Button> */}
    </div>
  );
};

export default HomeScreen;
