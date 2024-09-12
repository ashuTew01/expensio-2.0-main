import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const reactAppBaseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

const DEFAULT_HEADERS = {
	Authorization: `Bearer ${JSON.parse(localStorage.getItem("tokenExpensio"))}`,
};

export const api = createApi({
	baseQuery: fetchBaseQuery({ baseUrl: reactAppBaseUrl }),
	reducerPath: "adminApi",
	tagTypes: ["User", "Dashboard"],
	endpoints: (build) => ({
		expenseTest: build.query({
			query: () => ({
				url: "expense/test",
				method: "GET",
				headers: DEFAULT_HEADERS,
			}),
		}),
		saveExpenses: build.mutation({
			query: (data) => ({
				url: `expense/`,
				method: "POST",
				body: data,
				headers: DEFAULT_HEADERS,
			}),
		}),
		saveExpensesThroughText: build.mutation({
			query: (data) => ({
				url: `expense/add/text`,
				method: "POST",
				body: data,
				headers: DEFAULT_HEADERS,
			}),
		}),
		transcribeAudio: build.mutation({
			query: (audioFile) => ({
				url: "general/audio-to-text",
				method: "POST",
				body: audioFile,
				// Do not manually set Content-Type for FormData; let the browser handle it
				headers: {
					...DEFAULT_HEADERS,
				},
			}),
		}),
		getAllCategories: build.query({
			query: () => ({
				url: `expense/category/all`,
				method: "GET",
			}),
		}),
		getAllEvents: build.query({
			query: () => ({
				url: `event/all`,
				method: "GET",
				headers: DEFAULT_HEADERS,
			}),
		}),

		getUserSummary: build.query({
			query: () => ({
				url: `general/summary`,
				method: "GET",
				headers: DEFAULT_HEADERS,
			}),
		}),

		getAllCognitiveTriggers: build.query({
			query: () => ({
				url: `expense/cognitive/all`,
				method: "GET",
			}),
		}),
		getAllExpenses: build.query({
			query: ({
				start_date,
				end_date,
				search,
				categoryCode,
				cognitiveTriggerCodes, // change it to cognitiveTriggerCodes (array)
				mood,
				page,
				pageSize,
				id,
			}) => ({
				url: `expense`,
				method: "GET",
				params: {
					...(start_date && { start_date }),
					...(end_date && { end_date }),
					...(search && { search }),
					...(categoryCode && { categoryCode }),
					...(cognitiveTriggerCodes && { cognitiveTriggerCodes }), // this ensures only non-empty values are passed
					...(mood && { mood }),
					...(page && { page }),
					...(pageSize && { pageSize }),
					...(id && { id }),
				},
				headers: DEFAULT_HEADERS,
			}),
		}),
		getExpenseById: build.query({
			query: ({ id }) => ({
				url: `expense`,
				method: "GET",
				params: { id },
				headers: DEFAULT_HEADERS,
			}),
		}),
		// PUT GOALS QUERIES HERE
		saveGoal: build.mutation({
			query: (data) => ({
				url: `goal/add`,
				method: "POST",
				body: data,
				headers: DEFAULT_HEADERS,
			}),
		}),
		sendOtp: build.mutation({
			query: (data) => ({
				url: `user/send-otp`,
				method: "POST",
				body: data,
				headers: DEFAULT_HEADERS,
			}),
		}),
		verifyOtp: build.mutation({
			query: (data) => ({
				url: `user/verify-otp`,
				method: "POST",
				body: data,
			}),
		}),
		getDasboard: build.query({
			query: () => ({
				url: "dashboard",
				method: "GET",
				headers: DEFAULT_HEADERS,
			}),
		}),
	}),
});

export const {
	useLoginMutation,
	useRegisterMutation,
	useLogoutMutation,

	useGetUserQuery,
	useGetAllEventsQuery,
	useGetAllCognitiveTriggersQuery,

	useExpenseTestQuery,
	useGetExpenseByIdQuery,
	useGetUserSummaryQuery,
	useGetAllExpensesQuery,
	useSaveGoalMutation,

	useGetDasboardQuery,

	useSaveExpensesMutation,
	useSaveExpensesThroughTextMutation,
	useTranscribeAudioMutation,
	useGetAllCategoriesQuery,

	useSendOtpMutation,
	useVerifyOtpMutation,
} = api;
