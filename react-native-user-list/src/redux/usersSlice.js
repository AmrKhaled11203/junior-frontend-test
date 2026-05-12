import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchUsersFromApi } from '../services/api';
import { cacheUsers, getCachedUsers } from '../utils/storage';

/**
 * Async thunk — Fetches a page of users from the API.
 * On page 1, caches the results to AsyncStorage for offline support.
 * Side effects (caching) are handled here in the thunk, NOT in reducers.
 */
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const result = await fetchUsersFromApi(page, limit);

      // Cache on first page load for offline support
      if (page === 1 && result.users.length > 0) {
        await cacheUsers(result.users);
      }

      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Async thunk — Loads previously cached users from AsyncStorage.
 * Acts as a fallback when the device is offline.
 */
export const loadCachedUsers = createAsyncThunk(
  'users/loadCachedUsers',
  async () => {
    return await getCachedUsers();
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
      // --- fetchUsers ---
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { users, page, hasMore } = action.payload;

        if (users.length === 0) {
          state.hasMore = false;
        } else {
          if (page === 1) {
            state.users = users;
          } else {
            // Prevent duplicate entries when paginating
            const existingIds = new Set(state.users.map(u => u.id));
            const newUsers = users.filter(u => !existingIds.has(u.id));
            state.users = [...state.users, ...newUsers];
          }
          state.page = page;
          state.hasMore = hasMore;
        }
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // --- loadCachedUsers ---
      .addCase(loadCachedUsers.fulfilled, (state, action) => {
        // Only populate from cache if we have no users yet (offline fallback)
        if (state.users.length === 0 && action.payload.length > 0) {
          state.users = action.payload;
          state.status = 'succeeded';
        }
      });
  },
});

export const { setSearchQuery, resetUsers } = usersSlice.actions;
export default usersSlice.reducer;
