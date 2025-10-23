// Data models for the audio player app

export interface Track {
  id: string;
  title: string;
  artist?: string;
  album?: string;
  duration?: number; // seconds
  uri: string; // local path, blob URL, or data URL
  artworkUri?: string;
}

export interface Playlist {
  id: string;
  name: string;
  tracks: Track[];
  createdAt: string;
}

export type ControlMode = 'touch' | 'gestures' | 'both' | 'disabled';

export interface AppSettings {
  controlMode: ControlMode;
  gestureSensitivity: number; // 0-100
  visualFeedback: boolean;
}

export interface AppState {
  currentTrackId: string | null;
  isPlaying: boolean;
  position: number;
  duration: number;
  playlistId: string | null;
  volume: number; // 0-1
}

export interface GestureEvent {
  type: 'swipe-left' | 'swipe-right' | 'swipe-up' | 'swipe-down' | 'tap' | 'double-tap' | 'long-press';
  timestamp: number;
}
