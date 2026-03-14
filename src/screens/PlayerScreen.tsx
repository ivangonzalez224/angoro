import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  Dimensions,
} from 'react-native';
import TrackPlayer, {
  useProgress,
  usePlaybackState,
  State,
} from 'react-native-track-player';
import Slider from '@react-native-community/slider';
import { useAppDispatch, useAppSelector } from '../store';
import { setPlaybackState } from '../store/slices/playerSlice';
import { colors } from '../theme';
import PlayerControls from '../components/PlayerControls';

const { width } = Dimensions.get('window');

export default function PlayerScreen() {
  const dispatch = useAppDispatch();
  const { currentTrack } = useAppSelector((state) => state.player);
  
  const progress = useProgress();
  const playbackState = usePlaybackState();
  const isPlaying = playbackState.state === State.Playing;

  useEffect(() => {
    if (playbackState.state === State.Playing) {
      dispatch(setPlaybackState('playing'));
    } else if (playbackState.state === State.Paused) {
      dispatch(setPlaybackState('paused'));
    } else if (playbackState.state === State.Loading) {
      dispatch(setPlaybackState('loading'));
    }
  }, [playbackState.state, dispatch]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!currentTrack) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>No track selected</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background.primary} />

      {/* Artwork */}
      <View style={styles.artworkContainer}>
        <Image
          source={{ uri: currentTrack.artwork }}
          style={styles.artwork}
        />
      </View>

      {/* Track info */}
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {currentTrack.title}
        </Text>
        <Text style={styles.artist} numberOfLines={1}>
          {currentTrack.artist}
        </Text>
      </View>

      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={progress.duration || 1}
          value={progress.position}
          minimumTrackTintColor={colors.red.primary}
          maximumTrackTintColor={colors.background.elevated}
          thumbTintColor={colors.red.bright}
          onSlidingComplete={async (value) => {
            await TrackPlayer.seekTo(value);
          }}
        />
        <View style={styles.timeRow}>
          <Text style={styles.time}>{formatTime(progress.position)}</Text>
          <Text style={styles.time}>{formatTime(progress.duration)}</Text>
        </View>
      </View>

      {/* Controls */}
      <PlayerControls isPlaying={isPlaying} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    alignItems: 'center',
    paddingTop: 60,
  },
  centered: {
    flex: 1,
    backgroundColor: colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: colors.text.muted,
    fontSize: 16,
  },
  artworkContainer: {
    width: width * 0.75,
    height: width * 0.75,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.background.elevated,
    elevation: 12,
    shadowColor: colors.red.dark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    marginBottom: 32,
  },
  artwork: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    width: '100%',
    paddingHorizontal: 32,
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text.primary,
    textAlign: 'center',
  },
  artist: {
    fontSize: 15,
    color: colors.text.muted,
    textAlign: 'center',
    marginTop: 6,
  },
  progressContainer: {
    width: '100%',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  time: {
    fontSize: 12,
    color: colors.text.muted,
  },
});