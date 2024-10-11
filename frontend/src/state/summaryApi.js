import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { removeCredentials } from "./authSlice";

const reactAppBaseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

// Create a custom baseQuery that wraps fetchBaseQuery
const baseQuery = fetchBaseQuery({
	baseUrl: reactAppBaseUrl,
	prepareHeaders: (headers, { getState }) => {
		const token = getState().auth.token; // Access the token from Redux store
		if (token) {
			headers.set("Authorization", `Bearer ${token}`);
		}
		return headers;
	},
});

// Wrap the baseQuery to handle 401 Unauthorized responses
const baseQueryWithAuth = async (args, api, extraOptions) => {
	const result = await baseQuery(args, api, extraOptions);

	if (result.error && result.error.status === 401) {
		// Dispatch the logout action to clear credentials
		api.dispatch(removeCredentials());

		// Optionally, display a toast notification
		// toast.error("Session expired. Please log in again.");
	}

	return result;
};

export const summaryApi = createApi({
	reducerPath: "summaryApi",
	baseQuery: baseQueryWithAuth,
	endpoints: (builder) => ({
		getSummary: builder.query({
			query: ({ timePeriod, year, month }) => ({
				url: `financial-data/summary`,
				method: "GET",
				params: { timePeriod, year, month },
			}),
		}),
		buildSummary: builder.mutation({
			query: ({ timePeriod, year, month }) => ({
				url: `financial-data/summary/build`,
				method: "POST",
				params: { timePeriod, year, month },
			}),
		}),
	}),
});

export const {
	useGetSummaryQuery,
	useBuildSummaryMutation,
	useLazyGetSummaryQuery,
} = summaryApi;
