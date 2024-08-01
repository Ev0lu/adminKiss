import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getToken } from '../../App';
import { RootState } from './store';
import { getStoriesById } from '../api';

interface Video {
  id: string;
  video: string;
}

interface Story {
  id: string;
  preview: string;
  products: string[];
  videos: Video[];
}

export interface StoriesState {
    stories: { [id: string]: Story };  // Используем объект с ключами по id
    loading: boolean;
    error: string | null;
  }

const initialState: StoriesState = {
    stories: {},
    loading: false,
    error: null,
  };

// Определите асинхронные действия
export const fetchStoryById = createAsyncThunk<
  Story,  // The type of the data returned on success
  string, // The type of the parameter passed to the thunk
  { rejectValue: string } // Error type
>(
  'stories/fetchStoryById',
  async (id: string) => {
    const token = getToken('access')
    const response = await getStoriesById(id, token);
    const data = await response.json();
    return data;
  }
);

const storiesSlice = createSlice({
    name: 'stories',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchStoryById.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchStoryById.fulfilled, (state, action: PayloadAction<Story>) => {
          // Сохраняем историю по id
          state.stories[action.payload.id] = action.payload;
          state.loading = false;
        })
        .addCase(fetchStoryById.rejected, (state, action) => {
          state.error = action.payload as string;
          state.loading = false;
        });
    },
  });
  

export default storiesSlice.reducer;
export const selectStoryById = (id: string) => (state: RootState) => state.stories.stories[id];
export const selectLoading = (state: RootState) => state.stories.loading;
export const selectError = (state: RootState) => state.stories.error;
