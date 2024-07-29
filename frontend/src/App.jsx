import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import Login from "./scenes/login";
// import Register from "./scenes/register";
import { CssBaseline, ThemeProvider } from "@mui/material";

// import "./App.css";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { themeSettings } from "./theme";

import HomeScreen from "./scenes/homescreen";
import Dashboard from "./scenes/dashboard";
import PrivateRoute from "./components/PrivateRoute";
import Layout from "./scenes/layout";
import PhoneNumberPage from "./scenes/phoneNumberPage";
// import AddExpenseScreen from "scenes/expense/add";
// import AddGoalScreen from "scenes/addGoal";
// import ExpenseListScreen from "scenes/expense/list";
// import AddExpenseThroughTextScreen from "scenes/expense/addText";
// import SummaryScreen from "scenes/summary";
// import ExpenseScreen from "scenes/expense/screen";

function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ToastContainer />

        <Routes>
          {/* <Route path="" element={<PrivateRoute />}> */}
            <Route element={<Layout />}>
              {" "}
              {/* will exist on every page. Eg, navbar and sidebar. */}
              <Route path="/dashboard" element={<Dashboard />} />
              {/* expense */}
              {/* <Route path="/expense/add" element={<AddExpenseScreen />} /> */}
              {/* <Route
                path="/expense/add/text"
                element={<AddExpenseThroughTextScreen />}
              /> */}
              {/* <Route path="/expense/:id" element={<ExpenseScreen />} /> */}
              {/* <Route path="/expense/list" element={<ExpenseListScreen />} /> */}
              {/* goals */}
              {/* <Route path="/goal/add" element={<AddGoalScreen />} /> */}
              {/* <Route path="/user/summary" element={<SummaryScreen />} /> */}
            </Route>
          {/* </Route> */}

          <Route>
            <Route index path="/" element={<HomeScreen />} />

            <Route path="/login" element={<PhoneNumberPage />} />
            {/* <Route path="/register" element={<Register />} /> */}
          </Route>
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
