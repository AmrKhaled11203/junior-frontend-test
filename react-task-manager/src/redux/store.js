import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './tasksSlice';
import { loadState, saveState } from './localStorage';

const persistedState = loadState();

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
  },
  preloadedState: persistedState,
});

store.subscribe(() => {
  saveState({
    tasks: store.getState().tasks,
  });
});

export default store;
