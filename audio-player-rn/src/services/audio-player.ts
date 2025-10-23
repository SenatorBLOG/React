import { Audio } from 'expo-av';
import { Track } from '../types';

const sound = new Audio.Sound();

export interface PlayerStatus {
  isPlaying: boolean;
  position: number; // In seconds
  duration: number; // In seconds
}

export const getAudioPlayer = () => {
  let errorCallback: ((error: Error) => void) | null = null;

  return {
    loadTrack: async (track: Track) => {
      try {
        await sound.unloadAsync();
        await sound.loadAsync({ uri: track.uri });
      } catch (error: any) {
        const err = new Error(`Failed to load track: ${error.message || error}`);
        errorCallback?.(err);
        throw err;
      }
    },
    play: async () => {
      try {
        await sound.playAsync();
      } catch (error: any) {
        const err = new Error(`Playback error: ${error.message || error}`);
        errorCallback?.(err);
        throw err;
      }
    },
    pause: async () => {
      try {
        await sound.pauseAsync();
      } catch (error: any) {
        const err = new Error(`Pause error: ${error.message || error}`);
        errorCallback?.(err);
        throw err;
      }
    },
    seek: async (position: number) => {
      try {
        await sound.setPositionAsync(position * 1000); // Convert seconds to milliseconds
      } catch (error: any) {
        const err = new Error(`Seek error: ${error.message || error}`);
        errorCallback?.(err);
        throw err;
      }
    },
    onStatusUpdate: (callback: (status: PlayerStatus) => void) => {
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          callback({
            isPlaying: status.isPlaying,
            position: status.positionMillis ? status.positionMillis / 1000 : 0,
            duration: status.durationMillis ? status.durationMillis / 1000 : 0,
          });
        }
      });
    },
    onError: (callback: (error: Error) => void) => {
      errorCallback = callback;
    },
    cleanup: () => {
      sound.setOnPlaybackStatusUpdate(null); // Clear listeners
      errorCallback = null;
    },
  };
};