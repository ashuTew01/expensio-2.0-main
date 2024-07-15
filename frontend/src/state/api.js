import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { importMeta } from "vite";

const reactAppBaseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

const DEFAULT_HEADERS = {
  Authorization: `Bearer ${
    JSON.parse(localStorage.getItem("tokenExpensio"))?.token
  }`,
}; 

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: reactAppBaseUrl }),
  // prepareHeaders: (headers, { getState }) => {
  // 	const token = JSON.parse(localStorage.getItem("userInfoEcoTrack"))?.token; // Optional chaining for nullish coalescing
  // 	console.log(token);
  // 	// console.log("Above should be the token");
  // 	if (token) {
  // 		headers.set("Authorization", `Bearer ${token}`);
  // 	}

  // 	return headers;
  // },
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
        url: `expense/add`,
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
        url: `category`,
        method: "GET",
        headers: DEFAULT_HEADERS,
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

    getPsychologicalTypes: build.query({
      query: () => ({
        url: `psycho-types`,
        method: "GET",
        headers: DEFAULT_HEADERS,
      }),
    }),
    getAllExpenses: build.query({
      query: ({
        start_date,
        end_date,
        search,
        event,
        categoryCode,
        psychologicalTypeCode,
        mood,
        page,
        pageSize,
        id,
        goalId,
        userId,
      }) => ({
        url: `expense`,
        method: "GET",
        params: {
          start_date,
          end_date,
          search,
          event,
          categoryCode,
          psychologicalTypeCode,
          mood,
          page,
          pageSize,
          id,
          goalId,
          userId,
        },
        headers: DEFAULT_HEADERS,
      }),
    }),
    getExpenseById: build.query({
      query: ({ id }) => ({
        url: `expense/${id}`,
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
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,

  useGetUserQuery,
  useGetAllEventsQuery,
  useGetPsychologicalTypesQuery,

  useExpenseTestQuery,
  useGetExpenseByIdQuery,
  useGetUserSummaryQuery,
  useGetAllExpensesQuery,
  useSaveGoalMutation,

  useSaveExpensesMutation,
  useSaveExpensesThroughTextMutation,
  useTranscribeAudioMutation,
  useGetAllCategoriesQuery,
} = api;
