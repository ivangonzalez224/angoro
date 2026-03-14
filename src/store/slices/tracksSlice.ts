import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Track, ApiTrack } from '../../types/track';

const API_URL = 'https://script.googleusercontent.com/macros/echo?user_content_key=AY5xjrQLVCUUjvr5YgWyx8vEuj_AxOjtr51ucLin0fvnEpWJg1dcMMhYVmzuLu_RuKFKjvF1CtPg2qPo8UPoE5Jpk27f24MxnNcs2Ae82K9-Zc2JNR7qtT0yyjZwu4DVWaUq3hJzV6ixDqMqKIs3OFpVMjLSOo5aYT--UOVvibRqI1fN7bm4Bpfu3GKnGRwPv5Lx9lZ17hjW7SjbK4tgaihBgdD-oRTUlIv76iIqq2yvczYXrhFOSlJHpth4NGNNRxHFJyW3Inq0NCEaO5t7FvCePyQJFMGDROjNywhnPzxI&lib=MEP838ssjgxz-mHnBHjQ8mAT2asBrsbrp';

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