import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const profileApi = createApi({
  baseQuery: fetchBaseQuery({
   // baseUrl:'https://profile7-iota.vercel.app/'
   //  baseUrl: 'http://localhost:5001/'
   baseUrl:'https://sanandbackend.vercel.app/'
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

    addTeamData: builder.query({
      query: (param) => ({
        url: `/addteam/${param.search}?&domain=${param.domain}&available=${param.avail}`,
        method: "GET",
      }),
    }),

    addTeam:builder.mutation({
      query:(data)=>({
        url: '/team',
        method: 'POST',
        body:data
      })
    }),
    getTeamData: builder.query({
      query: () => ({
        url: `/team`,
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
  useAddTeamDataQuery,
  useAddTeamMutation,
  useGetTeamDataQuery
} = profileApi;
