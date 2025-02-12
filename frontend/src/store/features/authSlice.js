import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';
axios.defaults.baseURL = BASE_URL;

const setAuthHeader = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

const safeJSONParse = (data) => {
    if (!data) return null;
    try {
      const parsed = JSON.parse(data);
      return parsed && typeof parsed === 'object' ? parsed : null;
    } catch (error) {
      console.error('JSON Parse Error:', error);
      return null;
    }
  };
  
  export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
      try {
        const response = await axios.post('/login', credentials);
        const { token, userId, username } = response.data;
        
        if (!userId || !token) {
          throw new Error('Invalid response data');
        }
  
        const user = { userId, username };
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setAuthHeader(token);
        
        return { token, user };
      } catch (error) {
        return rejectWithValue({ 
          error: error.response?.data?.error || 'Login failed' 
        });
      }
    }
  );

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/register', userData);
      const { token, userId, username } = response.data;
      
      if (!userId) {
        throw new Error('Invalid user data received');
      }

      const user = { userId, username };
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setAuthHeader(token);
      
      return { token, user };
    } catch (error) {
      return rejectWithValue({ 
        error: error.response?.data?.error || 'Registration failed' 
      });
    }
  }
);

const initialState = {
    user: safeJSONParse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: Boolean(localStorage.getItem('token')),
    loading: false,
    error: null
  };
  

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Remove auth header
        delete axios.defaults.headers.common['Authorization'];
      },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Login failed';
        state.isAuthenticated = false;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Registration failed';
        state.isAuthenticated = false;
      });
  }
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;