import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const reactAppBaseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

const DEFAULT_HEADERS = {
	Authorization: `Bearer ${JSON.parse(localStorage.getItem("tokenExpensio"))}`,
};

export const summaryApi = createApi({
	reducerPath: "summaryApi",
	baseQuery: fetchBaseQuery({ baseUrl: reactAppBaseUrl }),
	endpoints: (builder) => ({
		getSummary: builder.query({
			query: ({ timePeriod, year, month }) => ({
				url: `financial-data/summary`,
				method: "GET",
				params: { timePeriod, year, month },
				headers: DEFAULT_HEADERS,
			}),
		}),
		buildSummary: builder.mutation({
			query: ({ timePeriod, year, month }) => ({
				url: `financial-data/summary/build`,
				method: "POST",
				params: { timePeriod, year, month },
				headers: DEFAULT_HEADERS,
			}),
		}),
	}),
});

export const {
	useGetSummaryQuery,
	useBuildSummaryMutation,
	useLazyGetSummaryQuery,
} = summaryApi;
