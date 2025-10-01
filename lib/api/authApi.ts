import { createApi } from "@reduxjs/toolkit/query/react"
import { baseQueryWithAuthHandling } from "./baseQuery"
import { ApiResponse } from "./certificatesApi"

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  avatar?: string
  totalCertificates?: number
  totalPublicCertificates?: number
  totalViews?: number
  createdAt: string
  updatedAt: string
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
  baseQuery: baseQueryWithAuthHandling,
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

    getUserTheme: builder.query<ApiResponse<boolean>, null>({
      query: () => ({
        url: "/theme",
        method: "GET",
      }),
    }),

    updateTheme: builder.mutation<boolean, Partial<User>>({
      query: () => ({
        url: "/theme",
        method: "PUT",
      }),
    }),
  }),
})

export const { useLoginMutation, useGetUserProfileQuery, useForgotPasswordMutation, useUpdateProfileMutation, useUpdateThemeMutation, useGetUserThemeQuery} = authApi
