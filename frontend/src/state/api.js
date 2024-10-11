import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { v4 as uuidv4 } from "uuid"; // Import UUID generator

const reactAppBaseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

const serializeQueryParams = (params) => {
	const searchParams = new URLSearchParams();

	Object.entries(params).forEach(([key, value]) => {
		if (value === undefined || value === null || value === "") return;

		if (Array.isArray(value)) {
			value.forEach((val) => {
				searchParams.append(key, val);
			});
		} else {
			searchParams.append(key, value);
		}
	});

	return searchParams.toString();
};

export const api = createApi({
	baseQuery: fetchBaseQuery({
		baseUrl: reactAppBaseUrl,
		prepareHeaders: (headers, { getState }) => {
			const token = getState().auth.token; // Access the token from Redux store
			if (token) {
				headers.set("Authorization", `Bearer ${token}`);
			}
			return headers;
		},
	}),
	reducerPath: "adminApi",
	tagTypes: ["User", "Dashboard"],
	endpoints: (build) => ({
		expenseTest: build.query({
			query: () => ({
				url: "expense/test",
				method: "GET",
				// headers: DEFAULT_HEADERS,
			}),
		}),
		saveExpenses: build.mutation({
			query: (data) => {
				const idempotencyKey = uuidv4(); // Generate a new idempotency key inside the query function
				return {
					url: `expense/`,
					method: "POST",
					body: data,
					headers: {
						"Idempotency-Key": idempotencyKey, // Add the idempotency key to the headers
					},
				};
			},
		}),
		saveExpensesThroughText: build.mutation({
			query: (data) => ({
				url: `expense/add/text`,
				method: "POST",
				body: data,
			}),
		}),
		transcribeAudio: build.mutation({
			query: (audioFile) => ({
				url: "general/audio-to-text",
				method: "POST",
				body: audioFile,
			}),
		}),
		getAllExpenseCategories: build.query({
			query: () => ({
				url: `expense/category/all`,
				method: "GET",
			}),
		}),
		getAllEvents: build.query({
			query: () => ({
				url: `event/all`,
				method: "GET",
			}),
		}),

		getUserSummary: build.query({
			query: () => ({
				url: `general/summary`,
				method: "GET",
			}),
		}),

		getAllCognitiveTriggers: build.query({
			query: () => ({
				url: `expense/cognitive/all`,
				method: "GET",
			}),
		}),
		getAllIncomeCategories: build.query({
			query: () => ({
				url: `income/category/all`,
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
			}) => {
				const queryParams = {
					...(start_date && { start_date }),
					...(end_date && { end_date }),
					...(search && { search }),
					...(categoryCode && { categoryCode }),
					...(cognitiveTriggerCodes.length > 0 && { cognitiveTriggerCodes }),
					...(mood && { mood }),
					...(page && { page }),
					...(pageSize && { pageSize }),
					...(id && { id }),
				};

				const serializedParams = serializeQueryParams(queryParams);

				return {
					url: `expense?${serializedParams}`,
					method: "GET",
				};
			},
		}),
		getExpenseById: build.query({
			query: ({ id }) => ({
				url: `expense`,
				method: "GET",
				params: { id },
			}),
		}),
		deleteExpenses: build.mutation({
			query: (expenseIds) => ({
				url: `expense`,
				method: "DELETE",
				body: { expenses: expenseIds },
			}),
		}),
		// income
		getAllIncome: build.query({
			query: ({
				start_date,
				end_date,
				search,
				category_code,
				page,
				page_size,
				id,
			}) => ({
				url: `income`,
				method: "GET",
				params: {
					...(start_date && { start_date }),
					...(end_date && { end_date }),
					...(search && { search }),
					...(category_code && { category_code }),
					...(page && { page }),
					...(page_size && { page_size }),
					...(id && { id }),
				},
			}),
		}),
		saveIncome: build.mutation({
			query: (data) => {
				const idempotencyKey = uuidv4(); // Generate a new idempotency key inside the query function
				return {
					url: `income/`,
					method: "POST",
					body: data,
					headers: {
						"Idempotency-Key": idempotencyKey, // Add the idempotency key to the headers
					},
				};
			},
		}),
		deleteIncomes: build.mutation({
			query: (incomeIds) => ({
				url: `income`,
				method: "DELETE",
				body: { incomes: incomeIds },
			}),
		}),
		getExpenseFinancialData: build.mutation({
			query: (data) => ({
				url: `financial-data/expense`,
				method: "POST",
				body: data,
			}),
		}),
		getIncomeFinancialData: build.mutation({
			query: (data) => ({
				url: `financial-data/income`,
				method: "POST",
				body: data,
			}),
		}),
		// PUT GOALS QUERIES HERE
		saveGoal: build.mutation({
			query: (data) => ({
				url: `goal/add`,
				method: "POST",
				body: data,
			}),
		}),
		sendOtp: build.mutation({
			query: (data) => ({
				url: `user/send-otp`,
				method: "POST",
				body: data,
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
			}),
		}),

		getUserAiTokensDetail: build.query({
			query: () => ({
				url: "smart-ai/user/ai-tokens-detail",
				method: "GET",
			}),
			refetchOnFocus: true,
			refetchOnReconnect: true,
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
	useDeleteExpensesMutation,

	useDeleteIncomesMutation,

	// financial data
	useGetExpenseFinancialDataMutation,
	useGetIncomeFinancialDataMutation,

	useGetAllIncomeQuery,
	useGetAllIncomeCategoriesQuery,

	useSaveGoalMutation,

	useGetDasboardQuery,

	useSaveExpensesMutation,
	useSaveIncomeMutation,
	useSaveExpensesThroughTextMutation,
	useTranscribeAudioMutation,
	useGetAllExpenseCategoriesQuery,

	useSendOtpMutation,
	useVerifyOtpMutation,

	//smart ai
	useGetUserAiTokensDetailQuery,
} = api;
