import { useState } from "react";
import {
	BrowserRouter,
	Routes,
	Route,
	Navigate,
	useNavigate,
} from "react-router-dom";
// import Login from "./scenes/login";
// import Register from "./scenes/register";
import { CssBaseline, ThemeProvider } from "@mui/material";

// import "./App.css";
import "./index.css";
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
import OtpPage from "./scenes/otpPage";
import UserDataForm from "./scenes/userDataFormPage";
import AddExpenseScreen from "./scenes/expense/add";
import ExpenseListScreen from "./scenes/expense/list";
import ExpenseScreen from "./scenes/expense/screen";
import IncomeListScreen from "./scenes/income/list";
import AddIncomeScreen from "./scenes/income/add";
import SummaryScreen from "./scenes/summary";
import ExpenseFinancialData from "./scenes/expense-financial-data";
import IncomeFinancialData from "./scenes/income-financial-data";
import FullChatPage from "./scenes/full-page-chat";

import { SocketProvider } from "./context/SocketContext";
import EmailLoginPage from "./scenes/email-login-page";
import IncomeScreen from "./scenes/income/screen";

function App() {
	const mode = useSelector((state) => state.global.mode);
	const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

	return (
		<SocketProvider>
			<BrowserRouter>
				<ThemeProvider theme={theme}>
					<CssBaseline />
					<ToastContainer />

					<Routes>
						<Route path="" element={<PrivateRoute />}>
							<Route element={<Layout />}>
								{" "}
								{/* will exist on every page. Eg, navbar and sidebar. */}
								<Route path="/dashboard" element={<Dashboard />} />
								<Route path="/expense/add" element={<AddExpenseScreen />} />
								{/* expense */}
								{/* <Route path="/expense/add" element={<AddExpenseScreen />} /> */}
								{/* <Route
                path="/expense/add/text"
                element={<AddExpenseThroughTextScreen />}
              /> */}
								<Route path="/expense/:id" element={<ExpenseScreen />} />
								<Route path="/expense/list" element={<ExpenseListScreen />} />
								{/* income */}
								<Route path="/income/list" element={<IncomeListScreen />} />
								<Route path="/income/add" element={<AddIncomeScreen />} />
								<Route path="/income/:id" element={<IncomeScreen />} />
								{/* Summary routes */}
								<Route path="/user/summary" element={<SummaryScreen />} />
								<Route
									path="/user/expense-financial-data"
									element={<ExpenseFinancialData />}
								/>
								<Route
									path="/user/income-financial-data"
									element={<IncomeFinancialData />}
								/>
								{/* chat page */}
								<Route path="/smart-ai-chat" element={<FullChatPage />} />
								{/* goals */}
								{/* <Route path="/goal/add" element={<AddGoalScreen />} /> */}
								{/* <Route path="/user/summary" element={<SummaryScreen />} /> */}
							</Route>
						</Route>

						<Route>
							<Route index path="/" element={<HomeScreen />} />

							<Route path="/login" element={<EmailLoginPage />} />
							<Route path="/otp" element={<OtpPage />} />
							<Route path="/user-data-form" element={<UserDataForm />} />
						</Route>
					</Routes>
				</ThemeProvider>
			</BrowserRouter>
		</SocketProvider>
	);
}

export default App;
