import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Helper to get users from mock database (localStorage)
const getMockDB = () => {
  const users = localStorage.getItem('mock_users');
  return users ? JSON.parse(users) : [];
};

// Helper to save users to mock database
const saveMockDB = (users) => {
  localStorage.setItem('mock_users', JSON.stringify(users));
};

// Async thunk to handle signup
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const db = getMockDB();
      const emailExists = db.some((user) => user.email.toLowerCase() === userData.email.toLowerCase());
      const usernameExists = db.some((user) => user.username.toLowerCase() === userData.username.toLowerCase());

      if (emailExists) {
        return rejectWithValue('Email is already registered.');
      }
      if (usernameExists) {
        return rejectWithValue('Username is already taken.');
      }

      // Add to mock DB
      const newUser = {
        id: Date.now().toString(),
        username: userData.username,
        email: userData.email,
        password: userData.password, // In a real app, never store plain text passwords
      };
      db.push(newUser);
      saveMockDB(db);

      // Add a small delay for visualization of loading state
      await new Promise(resolve => setTimeout(resolve, 1200));

      return { username: newUser.username, email: newUser.email };
    } catch (err) {
      return rejectWithValue(err.message || 'An error occurred during signup.');
    }
  }
);

// Async thunk to handle login
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const db = getMockDB();
      const user = db.find(
        (u) =>
          u.email.toLowerCase() === credentials.email.toLowerCase() &&
          u.password === credentials.password
      );

      if (!user) {
        return rejectWithValue('Invalid email or password.');
      }

      // Add a small delay for visualization of loading state
      await new Promise(resolve => setTimeout(resolve, 1200));

      // Return user info (exclude password)
      return { username: user.username, email: user.email };
    } catch (err) {
      return rejectWithValue(err.message || 'Invalid email or password.');
    }
  }
);

const getInitialUser = () => {
  const user = localStorage.getItem('current_user');
  return user ? JSON.parse(user) : null;
};

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: getInitialUser(),
    isLoading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.error = null;
      state.successMessage = null;
      localStorage.removeItem('current_user');
    },
    clearStatus: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.successMessage = 'Account created successfully! Welcome aboard.';
        localStorage.setItem('current_user', JSON.stringify(action.payload));
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'An error occurred during signup.';
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.successMessage = 'Logged in successfully! Welcome back.';
        localStorage.setItem('current_user', JSON.stringify(action.payload));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Invalid email or password.';
      });
  },
});

export const { logout, clearStatus } = authSlice.actions;
export default authSlice.reducer;
