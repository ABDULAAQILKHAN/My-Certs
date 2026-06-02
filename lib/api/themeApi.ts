import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuthHandling } from "./baseQuery";

const AUTH_PRO_URL = process.env.NEXT_PUBLIC_AUTH_PRO_URL || 'https://p01--auth-pro--f2ksfrkf9d45.code.run';

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
      query: () => `${AUTH_PRO_URL}/users/me`,
      transformResponse: (response: any) => {
        const theme = response.metadata?.theme;
        return theme === "dark" || theme === true;
      },
      providesTags: ["Theme"],
    }),
    updateTheme: builder.mutation<ApiResponse<any>, boolean>({
      query: (isDark) => ({
        url: `${AUTH_PRO_URL}/users/me`,
        method: "PATCH",
        body: { metadata: { theme: isDark ? "dark" : "light" } },
      }),
      invalidatesTags: ["Theme"],
    }),
  }),
});

export const { useGetThemeQuery, useUpdateThemeMutation } = themeApi;
