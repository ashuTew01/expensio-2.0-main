import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const googleAuthApi = createApi({
  reducerPath: "googleAuthApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/" }),
  endpoints: (builder) => ({
    initiateGoogleAuth: builder.query({
      query: () => "auth/google",
    }),
    getProfile: builder.query({
      query: () => ({
        url: "auth/profile",
        method: "GET",
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
      }),
    }),
  }),
});

export const { useInitiateGoogleAuthQuery, useGetProfileQuery } = googleAuthApi;
