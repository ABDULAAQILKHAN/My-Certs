import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuthHandling } from "./baseQuery";

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  error: any;
  timestamp: string;
}

export const themeApi = createApi({
  reducerPath: "themeApi",
  baseQuery: baseQueryWithAuthHandling,
  tagTypes: ["Theme"],
  endpoints: (builder) => ({
    getTheme: builder.query<boolean, void>({
      query: () => "/profile/theme",
      transformResponse: (response: ApiResponse<boolean>) => response.data,
      providesTags: ["Theme"],
    }),
    updateTheme: builder.mutation<ApiResponse<any>, void>({
      query: () => ({
        url: "/profile/theme",
        method: "PUT",
      }),
      invalidatesTags: ["Theme"],
    }),
  }),
});

export const { useGetThemeQuery, useUpdateThemeMutation } = themeApi;
