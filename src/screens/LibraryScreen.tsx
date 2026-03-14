import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import TrackPlayer from 'react-native-track-player';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchTracks } from '../store/slices/tracksSlice';
import { setCurrentTrack } from '../store/slices/playerSlice';
import { colors } from '../theme';
import { Track } from '../types/track';
import { RootTabParamList } from '../navigation/AppNavigator';

type LibraryNavigationProp = BottomTabNavigationProp<RootTabParamList, 'Library'>;

export default function LibraryScreen() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<LibraryNavigationProp>();
  const { tracks, status, error } = useAppSelector((state) => state.tracks);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchTracks());
    }
  }, [dispatch, status]);

  const handleTrackPress = async (track: Track, index: number) => {

    dispatch(setCurrentTrack({ track, index }));

    await TrackPlayer.reset();
    await TrackPlayer.add(tracks);

    await TrackPlayer.skip(index);
    await TrackPlayer.play();
    
    navigation.navigate('Player');
  };

  if (status === 'loading') {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.red.primary} />
      </View>
    );
  }

  if (status === 'failed') {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background.primary} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Angoro</Text>
        <Text style={styles.headerSubtitle}>{tracks.length} songs</Text>
      </View>

      <FlatList
        data={tracks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={styles.trackItem}
            onPress={() => handleTrackPress(item, index)}
            activeOpacity={0.7}>
            <Image
              source={{ uri: item.artwork }}
              style={styles.artwork}
              defaultSource={require('../assets/tracks/default.png')}
            />
            <View style={styles.trackInfo}>
              <Text style={styles.trackTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.trackArtist} numberOfLines={1}>
                {item.artist}
              </Text>
            </View>
            <Text style={styles.playIcon}>▶</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  centered: {
    flex: 1,
    backgroundColor: colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: colors.background.secondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.red.bright,
    letterSpacing: 2,
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.text.muted,
    marginTop: 4,
  },
  list: {
    paddingVertical: 12,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 12,
    marginVertical: 4,
    backgroundColor: colors.background.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  artwork: {
    width: 52,
    height: 52,
    borderRadius: 8,
    backgroundColor: colors.background.elevated,
  },
  trackInfo: {
    flex: 1,
    marginLeft: 12,
  },
  trackTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
  },
  trackArtist: {
    fontSize: 13,
    color: colors.text.muted,
    marginTop: 3,
  },
  playIcon: {
    color: colors.red.primary,
    fontSize: 16,
    paddingLeft: 8,
  },
  errorText: {
    color: colors.red.bright,
    fontSize: 15,
  },
});