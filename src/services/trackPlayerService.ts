import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  Event,
  RepeatMode,
} from 'react-native-track-player';

// listen to hardware and system events
export async function PlaybackService() {
  TrackPlayer.addEventListener(Event.RemotePlay, () => {
    TrackPlayer.play();
  });

  TrackPlayer.addEventListener(Event.RemotePause, () => {
    TrackPlayer.pause();
  });

  TrackPlayer.addEventListener(Event.RemoteStop, () => {
    TrackPlayer.stop();
  });

  TrackPlayer.addEventListener(Event.RemoteNext, () => {
    TrackPlayer.skipToNext();
  });

  TrackPlayer.addEventListener(Event.RemotePrevious, () => {
    TrackPlayer.skipToPrevious();
  });

  // Fires when the user seeks from the lock screen or notification
  TrackPlayer.addEventListener(Event.RemoteSeek, (event) => {
    TrackPlayer.seekTo(event.position);
  });

  // When audio is interrupted
  TrackPlayer.addEventListener(Event.RemoteDuck, async (event) => {
    if (event.permanent) {
      await TrackPlayer.stop();
    } else {
      if (event.paused) {
        await TrackPlayer.pause();
      } else {
        await TrackPlayer.play();
      }
    }
  });
}

// It sets up the player on the lock screen and in the notification.
export async function setupPlayer() {
  let isSetup = false;

  try {
    await TrackPlayer.getActiveTrackIndex();
    isSetup = true;
  } catch {
    await TrackPlayer.setupPlayer({
      minBuffer: 5,
      maxBuffer: 50,
      playBuffer: 2,
    });

    await TrackPlayer.updateOptions({
      // When the user kills the app
      android: {
        appKilledPlaybackBehavior:
          AppKilledPlaybackBehavior.StopPlaybackOnAppKill,
      },
      // Buttons on lock screen and notification
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.SeekTo,
        Capability.Stop,
      ],
      // Compact notification view
      compactCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
      ],
      progressUpdateEventThrottle: 1000, // sync progress every 1 second
    });

    await TrackPlayer.setRepeatMode(RepeatMode.Queue);
    isSetup = true;
  }

  return isSetup;
}