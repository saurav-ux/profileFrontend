import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const profileApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "https://profile-backend7.vercel.app/",
  }),
  reducerPath: "profileApi",
  endpoints: (builder) => ({
    domainData: builder.query({
      query: () => ({
        url: "/profile/domain",
        method: "GET",
      }),
    }),
    genderData: builder.query({
      query: () => ({
        url: "/profile/gender",
        method: "GET",
      }),
    }),

    profilePage: builder.query({
      query: (param) => ({
        url: `/sheet?page=${param.page}`,
        method: "GET",
      }),
    }),
    searchData: builder.query({
      query: (param) => ({
        url: `/search/${param.search}?&page=${param.page}&gender=${param.gender}&domain=${param.domain}&available=${param.avail}`,
        method: "GET",
      }),
    }),
  }),
});
export const {
  useDomainDataQuery,
  useGenderDataQuery,
  useProfilePageQuery,
  useSearchDataQuery,
} = profileApi;
