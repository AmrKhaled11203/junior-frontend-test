import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const API_URL = 'https://jsonplaceholder.typicode.com/users';
const USERS_CACHE_KEY = '@users_cache';

// Helper: fetch with retry
const fetchWithRetry = async (url, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`[API] Attempt ${i + 1} on ${Platform.OS}...`);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (err) {
      console.error(`[API] Attempt ${i + 1} failed: ${err.message}`);
      if (i === retries - 1) throw err;
      // Wait 1 second before retrying
      await new Promise(r => setTimeout(r, 1000));
    }
  }
};

// Async thunk to fetch users
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const url = `${API_URL}?_page=${page}&_limit=${limit}`;
      console.log(`[API] Fetching: ${url}`);
      const data = await fetchWithRetry(url);
      console.log(`[API] Success! Received ${data.length} users on ${Platform.OS}`);
      return { users: data, page };
    } catch (error) {
      console.error(`[API] Final failure on ${Platform.OS}: ${error.message}`);
      return rejectWithValue(error.message);
    }
  }
);

// Load users from cache
export const loadCachedUsers = createAsyncThunk(
  'users/loadCachedUsers',
  async () => {
    const cachedData = await AsyncStorage.getItem(USERS_CACHE_KEY);
    return cachedData ? JSON.parse(cachedData) : [];
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    page: 1,
    hasMore: true,
    searchQuery: '',
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    resetUsers: (state) => {
      state.users = [];
      state.page = 1;
      state.hasMore = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { users, page } = action.payload;
        console.log(`[REDUX] Action fulfilled. Page: ${page}, Count: ${users.length}`);
        
        if (users.length === 0) {
          state.hasMore = false;
        } else {
          // If it's page 1, replace. Otherwise append.
          if (page === 1) {
            state.users = users;
          } else {
            // Avoid duplicates
            const existingIds = new Set(state.users.map(u => u.id));
            const newUsers = users.filter(u => !existingIds.has(u.id));
            state.users = [...state.users, ...newUsers];
          }
          state.page = page;
          
          // Save to cache (only first page for simple offline)
          if (page === 1) {
            AsyncStorage.setItem(USERS_CACHE_KEY, JSON.stringify(state.users));
          }
        }
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(loadCachedUsers.fulfilled, (state, action) => {
        if (state.users.length === 0 && action.payload.length > 0) {
          state.users = action.payload;
          state.status = 'succeeded';
        }
      });
  },
});

export const { setSearchQuery, resetUsers } = usersSlice.actions;
export default usersSlice.reducer;
