// src/services/api.ts

import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';

// You need to import your RootState type from your store
import type { RootState } from '../store';

// Define a placeholder interface for your user profile data
interface UserProfile {
  id: string;
  name: string;
  email: string;
}

// 1. Define the core baseQuery
const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
  prepareHeaders: (headers, { getState }) => {
    // Correctly type getState to access your Redux store
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// 2. Create the wrapper function with proper TypeScript types
const baseQueryWithAuthHandling: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // Check if the error has a status property and if it's 401
  // Using a type guard ('status' in error) is safer
  if (result.error && 'status' in result.error && result.error.status === 401) {
    console.error('Unauthorized request. Logging out.');
    
    // This check is important to prevent SSR errors
    if (typeof window !== 'undefined') {
      // Clear local storage or any other client-side storage
      localStorage.clear();
      
      // Force a full page reload to the login page
      window.location.href = '/login';
    }
  }

  return result;
};

// // 3. Use the wrapper in your createApi definition
// export const apiSlice = createApi({
//   reducerPath: 'api',
//   baseQuery: baseQueryWithAuthHandling,
//   endpoints: (builder) => ({
//     getProfile: builder.query<UserProfile, void>({
//       query: () => '/user/profile',
//     }),
//     // ... other endpoints
//   }),
// });

// // Export hooks for usage in components
// export const { useGetProfileQuery } = apiSlice;