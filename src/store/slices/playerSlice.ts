import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Track, PlaybackState } from '../../types/track';

interface PlayerState {
  currentTrack: Track | null;
  playbackState: PlaybackState;
  currentIndex: number;
}

const initialState: PlayerState = {
  currentTrack: null,
  playbackState: 'idle',
  currentIndex: -1,
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setCurrentTrack: (
      state,
      action: PayloadAction<{ track: Track; index: number }>
    ) => {
      state.currentTrack = action.payload.track;
      state.currentIndex = action.payload.index;
      state.playbackState = 'loading';
    },
    setPlaybackState: (state, action: PayloadAction<PlaybackState>) => {
      state.playbackState = action.payload;
    },
    playNext: (state) => {
      state.currentIndex = state.currentIndex + 1;
    },
    playPrevious: (state) => {
      state.currentIndex = Math.max(0, state.currentIndex - 1);
    },
    resetPlayer: (state) => {
      state.currentTrack = null;
      state.playbackState = 'idle';
      state.currentIndex = -1;
    },
  },
});

export const {
  setCurrentTrack,
  setPlaybackState,
  playNext,
  playPrevious,
  resetPlayer,
} = playerSlice.actions;

export default playerSlice.reducer;