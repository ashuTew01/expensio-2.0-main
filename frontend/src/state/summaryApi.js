import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const reactAppBaseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

export const summaryApi = createApi({
	reducerPath: "summaryApi",
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
