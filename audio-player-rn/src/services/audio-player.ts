// src/services/audio-player.ts
import { Audio, InterruptionModeIOS, InterruptionModeAndroid } from 'expo-av';
import { Track } from '../types';

export interface PlayerStatus {
  isPlaying: boolean;
  position: number;
  duration: number;
}

type StatusCallback = (status: PlayerStatus) => void;
type ErrorCallback = (error: Error) => void;

class AudioPlayer {
  private sound: Audio.Sound | null = null;
  private statusListeners: StatusCallback[] = [];
  private errorListeners: ErrorCallback[] = [];
  private isLoaded = false;

  constructor() {
    this.initAudioMode();
  }

  private async initAudioMode() {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        interruptionModeIOS: InterruptionModeIOS.DoNotMix,
        interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
      console.log('Audio mode set successfully');
    } catch (error: any) {
      console.error('Failed to set audio mode', error);
      this.notifyError(new Error(`Failed to set audio mode: ${error.message}`));
    }
  }

  private notifyStatus = (status: PlayerStatus) => {
    this.statusListeners.forEach(cb => cb(status));
  };

  private notifyError = (error: Error) => {
    this.errorListeners.forEach(cb => cb(error));
  };

  async loadTrack(track: Track): Promise<void> {
    try {
      if (this.sound) {
        await this.sound.unloadAsync();
        this.sound = null;
        this.isLoaded = false;
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: track.uri },
        { shouldPlay: false },
        this.onPlaybackStatusUpdate
      );

      this.sound = sound;
      this.isLoaded = true;
    } catch (error: any) {
      this.isLoaded = false;
      console.error('Error loading track:', error);
      this.notifyError(error);
      throw error;
    }
  }

  private onPlaybackStatusUpdate = (status: any) => {
    if (!status.isLoaded) {
      this.isLoaded = false;
      if (status.error) {
        console.error(`Playback Error: ${status.error}`);
        this.notifyError(new Error(status.error));
      }
      return;
    }

    this.isLoaded = true;
    this.notifyStatus({
      isPlaying: status.isPlaying,
      position: status.positionMillis / 1000,
      duration: status.durationMillis ? status.durationMillis / 1000 : 0,
    });
  };

  async play(): Promise<void> {
    if (!this.sound || !this.isLoaded) {
      const error = new Error('Sound not loaded');
      this.notifyError(error);
      throw error;
    }
    try {
      await this.sound.playAsync();
    } catch (error: any) {
      console.error('Error playing sound:', error);
      this.notifyError(error);
      throw error;
    }
  }

  async pause(): Promise<void> {
    if (!this.sound || !this.isLoaded) return;
    try {
      await this.sound.pauseAsync();
    } catch (error: any) {
      console.error('Error pausing sound:', error);
      this.notifyError(error);
    }
  }

  async seek(position: number): Promise<void> {
    if (!this.sound || !this.isLoaded) return;
    try {
      await this.sound.setPositionAsync(position * 1000);
    } catch (error: any) {
      console.error('Error seeking sound:', error);
      this.notifyError(error);
    }
  }

  onStatusUpdate(callback: StatusCallback): () => void {
    this.statusListeners.push(callback);
    return () => {
      this.statusListeners = this.statusListeners.filter(cb => cb !== callback);
    };
  }

  onError(callback: ErrorCallback): () => void {
    this.errorListeners.push(callback);
    return () => {
      this.errorListeners = this.errorListeners.filter(cb => cb !== callback);
    };
  }
}

let playerInstance: AudioPlayer | null = null;

export const getAudioPlayer = (): AudioPlayer => {
  if (!playerInstance) {
    playerInstance = new AudioPlayer();
  }
  return playerInstance;
};
