import { configureStore } from '@reduxjs/toolkit';
import storiesReducer from '../store/storiesSlice';

export const store = configureStore({
  reducer: {
    stories: storiesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;