import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  avatar?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface SignupRequest {
  name: string
  email: string
  password: string
}

export interface AuthResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: User | null;
  error: string | null;
  timestamp: string;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL ,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token
      if (token) {
        headers.set("authorization", `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getUserProfile: builder.query<AuthResponse, void>({
      query: () => ({
        url: "/profile",
        method: "GET",
      }),
      //providesTags: ["User"],
    }),
    login: builder.mutation<AuthResponse, null>({
      query: () => ({
        url: "/profile",
        method: "POST",
        //body: credentials,
      }),
    }),
    // signup: builder.mutation<AuthResponse, SignupRequest>({
    //   query: (userData) => ({
    //     url: "/signup",
    //     method: "POST",
    //     body: userData,
    //   }),
    // }),
    forgotPassword: builder.mutation<{ message: string }, { email: string }>({
      query: (data) => ({
        url: "/forgot-password",
        method: "POST",
        body: data,
      }),
    }),
    updateProfile: builder.mutation<User, Partial<User>>({
      query: (userData) => ({
        url: "/profile",
        method: "PATCH",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),
  }),
})

export const { useLoginMutation, useGetUserProfileQuery, useForgotPasswordMutation, useUpdateProfileMutation } = authApi
