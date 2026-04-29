import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { fetch } from 'expo/fetch';

// Using dummyjson.com — more reliable across all networks and devices
const API_URL = 'https://dummyjson.com/users';
const USERS_CACHE_KEY = '@users_cache';

// Normalize dummyjson user format to match our app's expected shape
const normalizeUser = (user) => ({
  id: user.id,
  name: `${user.firstName} ${user.lastName}`,
  username: user.username,
  email: user.email,
  phone: user.phone,
  website: user.domain || '',
  company: {
    name: user.company?.name || '',
    catchPhrase: user.company?.title || '',
    bs: user.company?.department || '',
  },
  address: {
    street: user.address?.address || '',
    suite: user.address?.stateCode || '',
    city: user.address?.city || '',
    zipcode: user.address?.postalCode || '',
    geo: {
      lat: String(user.address?.coordinates?.lat || 0),
      lng: String(user.address?.coordinates?.lng || 0),
    },
  },
});

// Fetch with retry using expo/fetch
const fetchWithRetry = async (url, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`[API] Attempt ${i + 1}/${retries} on ${Platform.OS} — ${url}`);
      const response = await fetch(url, {
        headers: { 'Accept': 'application/json' },
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      console.log(`[API] Success on attempt ${i + 1}`);
      return data;
    } catch (err) {
      console.error(`[API] Attempt ${i + 1} failed: ${err.message}`);
      if (i === retries - 1) throw err;
      await new Promise(r => setTimeout(r, 1500));
    }
  }
};

// Async thunk to fetch users
// dummyjson.com uses ?limit=X&skip=Y for pagination
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const skip = (page - 1) * limit;
      const url = `${API_URL}?limit=${limit}&skip=${skip}&select=firstName,lastName,username,email,phone,domain,company,address`;
      console.log(`[API] Fetching page ${page}: ${url}`);
      const data = await fetchWithRetry(url);

      // dummyjson returns { users: [...], total, skip, limit }
      const rawUsers = Array.isArray(data.users) ? data.users : [];
      const users = rawUsers.map(normalizeUser);
      const hasMore = skip + users.length < (data.total || 0);

      console.log(`[API] Got ${users.length} users (total: ${data.total})`);
      return { users, page, hasMore };
    } catch (error) {
      console.error(`[API] FINAL FAIL: ${error.message}`);
      return rejectWithValue(error.message);
    }
  }
);

// Load users from cache
export const loadCachedUsers = createAsyncThunk(
  'users/loadCachedUsers',
  async () => {
    try {
      const cachedData = await AsyncStorage.getItem(USERS_CACHE_KEY);
      return cachedData ? JSON.parse(cachedData) : [];
    } catch {
      return [];
    }
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
        const { users, page, hasMore } = action.payload;
        console.log(`[REDUX] Fulfilled. Page: ${page}, Count: ${users.length}, HasMore: ${hasMore}`);
        
        if (users.length === 0) {
          state.hasMore = false;
        } else {
          if (page === 1) {
            state.users = users;
          } else {
            const existingIds = new Set(state.users.map(u => u.id));
            const newUsers = users.filter(u => !existingIds.has(u.id));
            state.users = [...state.users, ...newUsers];
          }
          state.page = page;
          state.hasMore = hasMore;
          
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
