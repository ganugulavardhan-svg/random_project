import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'; 
import toast from 'react-hot-toast';


const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000/api';

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
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        const curToast = toast.loading('Fetching user data...');
        try {
          await queryFulfilled;
          toast.success('User data fetched successfully!', { id: curToast });
        } catch (error) {
          console.error('Error fetching user data:', error);
          if(error?.error?.status === 401 || error?.error?.status === 403) {
            toast.error('There was an error fetching user data.', { id: curToast });
          } else if(error?.error?.status === 'FETCH_ERROR') {
            toast.error('Backend Error', { id: curToast });
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
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        const curToast = toast.loading('Logging in...');
        try {
          await queryFulfilled;
          toast.success('Logged in successfully!', { id: curToast });
        } catch (error) {
          console.error('Error logging in:', error);
          if(error?.error?.status === 401 || error?.error?.status === 403) {
            toast.error('Invalid credentials. Please try again.', { id: curToast });
          } else if(error?.error?.status === 'FETCH_ERROR') {
            toast.error('Backend Error', { id: curToast });
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
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        const curToast = toast.loading('Registering...');
        try {
          await queryFulfilled;
          toast.success('Registered successfully!', { id: curToast });
        } catch (error) {
          console.error('Error registering:', error);
          if(error && error.error && error.error.status === 400) {
     

            toast.error('Invalid registration data. Please check your input.', { id: curToast });
          } else if(error?.error?.status === 'FETCH_ERROR') {
            toast.error('Backend Error', { id: curToast });
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


export const { useGetUserQuery, useLoginMutation, useLogoutMutation, useRegisterMutation,  } = apiSlice;
export default apiSlice;