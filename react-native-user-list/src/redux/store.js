import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './usersSlice';

const store = configureStore({
  reducer: {
    users: usersReducer,
  },
  // All state values are serializable (strings, numbers, plain objects/arrays),
  // so we keep the default middleware checks enabled for bug detection.
});

export default store;
