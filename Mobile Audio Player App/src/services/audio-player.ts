// Audio Player Service - Wrapper around HTML5 Audio API
import { Track } from '../types';

export type PlayerStatus = {
  isPlaying: boolean;
  position: number;
  duration: number;
  volume: number;
  currentTrack: Track | null;
};

type StatusCallback = (status: PlayerStatus) => void;
type ErrorCallback = (error: Error) => void;

export class AudioPlayerService {
  private audio: HTMLAudioElement;
  private currentTrack: Track | null = null;
  private statusCallbacks: Set<StatusCallback> = new Set();
  private errorCallbacks: Set<ErrorCallback> = new Set();
  private updateInterval: number | null = null;

  constructor() {
    this.audio = new Audio();
    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.audio.addEventListener('play', () => this.notifyStatusUpdate());
    this.audio.addEventListener('pause', () => this.notifyStatusUpdate());
    this.audio.addEventListener('ended', () => this.notifyStatusUpdate());
    this.audio.addEventListener('timeupdate', () => this.notifyStatusUpdate());
    this.audio.addEventListener('loadedmetadata', () => this.notifyStatusUpdate());
    this.audio.addEventListener('error', (e) => {
      const error = new Error(`Audio error: ${this.audio.error?.message || 'Unknown error'}`);
      this.notifyError(error);
    });
    this.audio.addEventListener('volumechange', () => this.notifyStatusUpdate());
  }

  async loadTrack(track: Track): Promise<void> {
    this.currentTrack = track;
    this.audio.src = track.uri;
    this.audio.load();
    return new Promise((resolve, reject) => {
      const onLoaded = () => {
        this.audio.removeEventListener('loadeddata', onLoaded);
        this.audio.removeEventListener('error', onError);
        resolve();
      };
      const onError = () => {
        this.audio.removeEventListener('loadeddata', onLoaded);
        this.audio.removeEventListener('error', onError);
        reject(new Error('Failed to load track'));
      };
      this.audio.addEventListener('loadeddata', onLoaded);
      this.audio.addEventListener('error', onError);
    });
  }

  async play(): Promise<void> {
    try {
      await this.audio.play();
      this.startUpdateInterval();
    } catch (error) {
      this.notifyError(error as Error);
      throw error;
    }
  }

  pause(): void {
    this.audio.pause();
    this.stopUpdateInterval();
  }

  async seek(position: number): Promise<void> {
    this.audio.currentTime = position;
    this.notifyStatusUpdate();
  }

  async setVolume(volume: number): Promise<void> {
    this.audio.volume = Math.max(0, Math.min(1, volume));
    this.notifyStatusUpdate();
  }

  getStatus(): PlayerStatus {
    return {
      isPlaying: !this.audio.paused,
      position: this.audio.currentTime,
      duration: this.audio.duration || 0,
      volume: this.audio.volume,
      currentTrack: this.currentTrack,
    };
  }

  onStatusUpdate(callback: StatusCallback): () => void {
    this.statusCallbacks.add(callback);
    return () => this.statusCallbacks.delete(callback);
  }

  onError(callback: ErrorCallback): () => void {
    this.errorCallbacks.add(callback);
    return () => this.errorCallbacks.delete(callback);
  }

  private notifyStatusUpdate() {
    const status = this.getStatus();
    this.statusCallbacks.forEach(callback => callback(status));
  }

  private notifyError(error: Error) {
    this.errorCallbacks.forEach(callback => callback(error));
  }

  private startUpdateInterval() {
    if (this.updateInterval) return;
    this.updateInterval = window.setInterval(() => {
      this.notifyStatusUpdate();
    }, 100);
  }

  private stopUpdateInterval() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  destroy() {
    this.stopUpdateInterval();
    this.audio.pause();
    this.audio.src = '';
    this.statusCallbacks.clear();
    this.errorCallbacks.clear();
  }
}

// Singleton instance
let playerInstance: AudioPlayerService | null = null;

export function getAudioPlayer(): AudioPlayerService {
  if (!playerInstance) {
    playerInstance = new AudioPlayerService();
  }
  return playerInstance;
}
