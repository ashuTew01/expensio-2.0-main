// redux/chatSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	messages: [],
	isTyping: false,
	socketConnected: false,
};

const chatSlice = createSlice({
	name: "chat",
	initialState,
	reducers: {
		addMessage: (state, action) => {
			state.messages.push(action.payload);
		},
		setTyping: (state, action) => {
			state.isTyping = action.payload;
		},
		setSocketConnected: (state, action) => {
			state.socketConnected = action.payload;
		},
		setMessages: (state, action) => {
			state.messages = action.payload;
		},
	},
});

export const { addMessage, setTyping, setSocketConnected, setMessages } =
	chatSlice.actions;

export default chatSlice.reducer;
