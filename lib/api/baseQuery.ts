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

const prepareHeaders = (headers: Headers, { getState }: any) => {
  const token = (getState() as RootState).auth.token;
  if (token) {
    headers.set('authorization', `Bearer ${token}`);
  }
  return headers;
};

const backendQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
  prepareHeaders,
});

const AUTH_PRO_URL = process.env.NEXT_PUBLIC_AUTH_PRO_URL || 'https://p01--auth-pro--f2ksfrkf9d45.code.run';
const authProQuery = fetchBaseQuery({
  baseUrl: AUTH_PRO_URL,
  prepareHeaders,
});

export const baseQueryWithAuthHandling: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let url = typeof args === 'string' ? args : args.url;
  
  const isAuthPro = url.includes('/users/me');
  
  if (isAuthPro && url.startsWith(AUTH_PRO_URL)) {
    url = url.replace(AUTH_PRO_URL, '');
    if (typeof args === 'object') {
      args = { ...args, url };
    } else {
      args = url;
    }
  }

  let result = isAuthPro 
    ? await authProQuery(args, api, extraOptions)
    : await backendQuery(args, api, extraOptions);

  if (result.error && 'status' in result.error && result.error.status === 401) {
    console.error('Unauthorized request. API returned 401. Logging out.');
    if (typeof window !== 'undefined') {
      try {
        api.dispatch(logout()); 
      } catch (e) {
        console.warn('Failed dispatching logout on 401', e);
      } finally {
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
  }

  return result;
};