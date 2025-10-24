// src/services/audio-player.ts
import { Audio } from 'expo-av';
import { Track } from '../types';

export interface PlayerStatus {
  isPlaying: boolean;
  position: number; // seconds
  duration: number; // seconds
}

type StatusCallback = (status: PlayerStatus) => void;
type ErrorCallback = (err: Error) => void;

export const getAudioPlayer = () => {
  let sound: Audio.Sound | null = null;
  const statusListeners = new Set<StatusCallback>();
  const errorListeners = new Set<ErrorCallback>();
  let attached = false; // whether we've attached proxy listener to current sound

  const proxyStatusHandler = (status: any) => {
    if (!status) return;
    if (!status.isLoaded) return;
    const s: PlayerStatus = {
      isPlaying: !!status.isPlaying,
      position: status.positionMillis ? status.positionMillis / 1000 : 0,
      duration: status.durationMillis ? status.durationMillis / 1000 : 0,
    };
    statusListeners.forEach((cb) => {
      try { cb(s); } catch (e) { /* ignore listener errors */ }
    });
  };

  const attachProxy = () => {
    if (!sound || attached) return;
    sound.setOnPlaybackStatusUpdate(proxyStatusHandler);
    attached = true;
  };

  const detachProxy = () => {
    if (!sound || !attached) return;
    try { sound.setOnPlaybackStatusUpdate(null); } catch {}
    attached = false;
  };

  const notifyError = (err: Error) => {
    errorListeners.forEach((cb) => {
      try { cb(err); } catch (e) {}
    });
  };

  return {
    // Load a track and ensure it's fully loaded before returning
    loadTrack: async (track: Track): Promise<void> => {
      try {
        // unload previous sound if any
        if (sound) {
          try {
            detachProxy();
            await sound.unloadAsync();
          } catch (e) { /* ignore unload errors */ }
          sound = null;
        }

        // create + load
        const { sound: createdSound, status } = await Audio.Sound.createAsync(
          { uri: track.uri },
          { shouldPlay: false }
        );

        sound = createdSound;
        attachProxy();

        // verify loaded (createAsync normally returns loaded status, but double-check)
        const st = await sound.getStatusAsync();
        if (!st.isLoaded) {
          const err = new Error('Sound failed to load');
          notifyError(err);
          throw err;
        }
      } catch (err: any) {
        const e = new Error(`Failed to load track: ${err?.message ?? err}`);
        notifyError(e);
        throw e;
      }
    },

    // Play (safely checks loaded state)
    play: async (): Promise<void> => {
      try {
        if (!sound) throw new Error('Sound not loaded');
        const status = await sound.getStatusAsync();
        if (!status.isLoaded) throw new Error('Sound not loaded');
        if (status.isPlaying) return;
        await sound.playAsync();
      } catch (err: any) {
        const e = new Error(`Playback error: ${err?.message ?? err}`);
        notifyError(e);
        throw e;
      }
    },

    pause: async (): Promise<void> => {
      try {
        if (!sound) throw new Error('Sound not loaded');
        const status = await sound.getStatusAsync();
        if (!status.isLoaded) throw new Error('Sound not loaded');
        if (!status.isPlaying) return;
        await sound.pauseAsync();
      } catch (err: any) {
        const e = new Error(`Pause error: ${err?.message ?? err}`);
        notifyError(e);
        throw e;
      }
    },

    seek: async (positionSec: number): Promise<void> => {
      try {
        if (!sound) throw new Error('Sound not loaded');
        const status = await sound.getStatusAsync();
        if (!status.isLoaded) throw new Error('Sound not loaded');
        await sound.setPositionAsync(Math.round(positionSec * 1000));
      } catch (err: any) {
        const e = new Error(`Seek error: ${err?.message ?? err}`);
        notifyError(e);
        throw e;
      }
    },

    onStatusUpdate: (cb: StatusCallback): (() => void) => {
      statusListeners.add(cb);
      // if sound already exists, immediately emit current status
      (async () => {
        if (sound) {
          try {
            const st = await sound.getStatusAsync();
            if (st.isLoaded) {
              cb({
                isPlaying: !!st.isPlaying,
                position: st.positionMillis ? st.positionMillis / 1000 : 0,
                duration: st.durationMillis ? st.durationMillis / 1000 : 0,
              });
            }
          } catch (e) { /* ignore */ }
        }
      })();
      return () => statusListeners.delete(cb);
    },

    onError: (cb: ErrorCallback): (() => void) => {
      errorListeners.add(cb);
      return () => errorListeners.delete(cb);
    },

    getCurrentStatus: async (): Promise<PlayerStatus | null> => {
      if (!sound) return null;
      try {
        const st = await sound.getStatusAsync();
        if (!st.isLoaded) return null;
        return {
          isPlaying: !!st.isPlaying,
          position: st.positionMillis ? st.positionMillis / 1000 : 0,
          duration: st.durationMillis ? st.durationMillis / 1000 : 0,
        };
      } catch {
        return null;
      }
    },

    cleanup: async (): Promise<void> => {
      try {
        if (sound) {
          detachProxy();
          await sound.unloadAsync();
          sound = null;
        }
      } catch (e) { /* ignore */ }
      statusListeners.clear();
      errorListeners.clear();
    },
  };
};
