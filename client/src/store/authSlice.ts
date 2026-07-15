import type { SerializedError } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery, type FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import toast from 'react-hot-toast';


const API_URL = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000') + '/api';

const apiSlice = createApi({

  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    credentials: 'include',
  }),

  reducerPath: 'api',

  endpoints: (builder) => ({

    getUser: builder.query({
      query: () => ({
        url: '/auth/user',
        method: 'GET',
      }),
      onQueryStarted: async (_, { queryFulfilled }) => {
        const curToast = toast.loading('Fetching user data...');
        try {
          await queryFulfilled;
          toast.success('User data fetched successfully!', { id: curToast });
        } catch (err) {
          const {error} = err as {error: FetchBaseQueryError | SerializedError};

          if ('status' in error) {
            if (error.status === 401 || error.status === 403) {
              toast.error('Unauthorized access. Please log in.', { id: curToast });
            }
            else if (error.status === 'FETCH_ERROR') {
              toast.error('Backend Error', { id: curToast });
            }
            else {
              toast.error('An error occurred while fetching user data.', { id: curToast });
            }
          }

        }

      },
    }),

    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      onQueryStarted: async (_, { queryFulfilled }) => {
        const curToast = toast.loading('Logging in...');
        try {
          await queryFulfilled;
          toast.success('Logged in successfully!', { id: curToast });
        } catch (err) {
          const {error} = err as { error: FetchBaseQueryError | SerializedError};
          console.error('Error logging in:', error);
          if ('status' in error) {
            if (error.status === 401 || error.status === 403) {
              toast.error('Invalid credentials. Please try again.', { id: curToast });
            }
            else if (error.status === 'FETCH_ERROR') {
              toast.error('Backend Error', { id: curToast });
            }
          }
        }

      },
    }),

    register: builder.mutation({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
      onQueryStarted: async (_, { queryFulfilled }) => {
        const curToast = toast.loading('Registering...');
        try {
          await queryFulfilled;
          toast.success('Registered successfully!', { id: curToast });
        } catch (err) {
          const { error } = err as {
            error: FetchBaseQueryError | SerializedError;
          };
          if ('status' in error) {
            if (error.status === 400) {
              toast.error('Invalid registration data. Please check your input.', { id: curToast });
            }
            else if (error.status === 'FETCH_ERROR') {
              toast.error('Backend Error', { id: curToast });
            } else {
              toast.error('An error occurred during registration.', { id: curToast });
            }
          }
        }

      },
    }),

    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
  })
});


export const { useGetUserQuery, useLoginMutation, useLogoutMutation, useRegisterMutation, } = apiSlice;
export default apiSlice;