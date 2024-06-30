import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

//setting up store.
import { configureStore } from "@reduxjs/toolkit";
import globalReducer from "./state";
import authReducer from "./state/authSlice";
import { Provider } from "react-redux";

import { setupListeners } from "@reduxjs/toolkit/query";
import { api } from "./state/api"; //LINE X1
import { googleAuthApi } from "./state/googleAuth";

const store = configureStore({
  reducer: {
    global: globalReducer,
    [api.reducerPath]: api.reducer, //LINE X2
    [googleAuthApi.reducerPath]: googleAuthApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefault) =>
    getDefault().concat(api.middleware).concat(googleAuthApi.middleware),
});
setupListeners(store.dispatch);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>
);
