export type ControlMode = 'buttons' | 'gestures' | 'both';

export interface GestureEvent {
  type: 'swipe-left' | 'swipe-right' | 'double-tap' | 'long-press';
  timestamp: number;
}

export interface Track {
  id: string;
  title: string;
  uri: string;
  duration?: number;
  artist?: string;
  artworkUri?: string;
}

export interface Playlist {
  id: string;
  name: string;
  tracks: Track[];
  createdAt: string;
}

export interface AppSettings {
  controlMode: ControlMode;
  gestureSensitivity: number;
  visualFeedback: boolean;
}

export interface AppState {
  currentTrackId: string | null;
  isPlaying: boolean;
  position: number;
  duration: number;
  playlistId: string;
  volume: number;
}