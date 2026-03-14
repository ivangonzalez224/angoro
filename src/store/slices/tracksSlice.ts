import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Track, ApiTrack } from '../../types/track';

const API_URL = '';

// Transformation to Track model
const mapApiTrackToTrack = (apiTrack: ApiTrack): Track => ({
  id: String(apiTrack.id),
  url: apiTrack.link,
  title: apiTrack.nom_song,
  artist: apiTrack.autor,
  artwork: apiTrack.logo,
});

export const fetchTracks = createAsyncThunk(
  'tracks/fetchTracks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      const json = await response.json();
      // Transform ApiTrack into Track model
      return json.data.map(mapApiTrackToTrack) as Track[];
    } catch (error) {
      return rejectWithValue('Failed to fetch tracks');
    }
  }
);

interface TracksState {
  tracks: Track[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: TracksState = {
  tracks: [],
  status: 'idle',
  error: null,
};

const tracksSlice = createSlice({
  name: 'tracks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTracks.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTracks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tracks = action.payload;
      })
      .addCase(fetchTracks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export default tracksSlice.reducer;