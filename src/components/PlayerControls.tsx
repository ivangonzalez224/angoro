import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import TrackPlayer, { usePlaybackState, State } from 'react-native-track-player';
import { useAppDispatch, useAppSelector } from '../store';
import { setCurrentTrack, playNext, playPrevious } from '../store/slices/playerSlice';
import { colors } from '../theme';

interface PlayerControlsProps {
  isPlaying: boolean;
}

export default function PlayerControls({ isPlaying }: PlayerControlsProps) {
  const dispatch = useAppDispatch();
  const playbackState = usePlaybackState();
  const { currentIndex } = useAppSelector((state) => state.player);
  const { tracks } = useAppSelector((state) => state.tracks);

  const isLoading = playbackState.state === State.Loading ||
                    playbackState.state === State.Buffering;

  const handlePlayPause = async () => {
    if (isPlaying) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
  };

  const handleNext = async () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= tracks.length) return;

    await TrackPlayer.skipToNext();
    dispatch(playNext());
    dispatch(setCurrentTrack({ track: tracks[nextIndex], index: nextIndex }));
  };

  const handlePrevious = async () => {
    const position = await TrackPlayer.getPosition();
    if (position > 3) {
      await TrackPlayer.seekTo(0);
      return;
    }

    const prevIndex = Math.max(0, currentIndex - 1);
    await TrackPlayer.skipToPrevious();
    dispatch(playPrevious());
    dispatch(setCurrentTrack({ track: tracks[prevIndex], index: prevIndex }));
  };

  const isFirstTrack = currentIndex === 0;
  const isLastTrack = currentIndex === tracks.length - 1;

  return (
    <View style={styles.container}>
      {/* Previous */}
      <TouchableOpacity
        style={[styles.sideButton, isFirstTrack && styles.disabled]}
        onPress={handlePrevious}
        disabled={isFirstTrack}
        activeOpacity={0.7}>
        <Text style={[styles.sideButtonText, isFirstTrack && styles.disabledText]}>
          ⏮
        </Text>
      </TouchableOpacity>

      {/* Play / Pause */}
      <TouchableOpacity
        style={styles.playButton}
        onPress={handlePlayPause}
        disabled={isLoading}
        activeOpacity={0.8}>
        {isLoading ? (
          <ActivityIndicator size="small" color={colors.text.primary} />
        ) : (
          <Text style={styles.playButtonText}>
            {isPlaying ? '⏸' : '▶️'}
          </Text>
        )}
      </TouchableOpacity>

      {/* Next */}
      <TouchableOpacity
        style={[styles.sideButton, isLastTrack && styles.disabled]}
        onPress={handleNext}
        disabled={isLastTrack}
        activeOpacity={0.7}>
        <Text style={[styles.sideButtonText, isLastTrack && styles.disabledText]}>
          ⏭
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    marginTop: 16,
    gap: 32,
  },
  sideButton: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 26,
    backgroundColor: colors.background.elevated,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sideButtonText: {
    fontSize: 22,
    color: colors.red.light,
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.red.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: colors.red.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },
  playButtonText: {
    fontSize: 28,
  },
  disabled: {
    opacity: 0.3,
  },
  disabledText: {
    color: colors.text.disabled,
  },
});