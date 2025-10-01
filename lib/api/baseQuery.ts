// src/services/api.ts

import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';

import type { RootState } from '../store';
import { logout } from '../slices/authSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseQueryWithAuthHandling: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && 'status' in result.error && result.error.status === 401) {
    console.error('Unauthorized request. Logging out.');
    if (typeof window !== 'undefined') {
      try {
        api.dispatch(logout()); 
        localStorage.clear();
      } catch (e) {
        console.warn('Failed clearing storage on 401', e);
      } finally {
        window.location.href = '/login';
      }
    }
  }

  return result;
};