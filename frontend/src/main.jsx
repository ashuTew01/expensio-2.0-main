import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

//setting up store.
import { configureStore } from "@reduxjs/toolkit";
import globalReducer from "./state";
import authReducer from "./state/authSlice";
import chatReducer from "./state/chatSlice";
import { Provider } from "react-redux";

import { setupListeners } from "@reduxjs/toolkit/query";
import { api } from "./state/api"; //LINE X1

import { summaryApi } from "./state/summaryApi";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const store = configureStore({
	reducer: {
		global: globalReducer,
		[api.reducerPath]: api.reducer,
		[summaryApi.reducerPath]: summaryApi.reducer,
		auth: authReducer,
		chat: chatReducer,
	},
	middleware: (getDefault) =>
		getDefault().concat(api.middleware).concat(summaryApi.middleware),
});
setupListeners(store.dispatch);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<Provider store={store}>
		<React.StrictMode>
			<LocalizationProvider dateAdapter={AdapterDateFns}>
				<App />
			</LocalizationProvider>
		</React.StrictMode>
	</Provider>
);
