//src/types/index.ts
export type ControlMode = 'buttons' | 'touch' | 'gestures' | 'both' | 'disabled';
export type RootStackParamList = {
  Splash: undefined;
  Home: undefined;
  Playlist: undefined;
  NowPlaying: undefined;
  FileBrowser: undefined;
  Settings: undefined;
  GestureTutorial: undefined;
  About: undefined;
};



export interface GestureEvent {
  type: 'swipe-left' | 'swipe-right' | 'double-tap' | 'long-press' | 'tap' | 'swipe-up' | 'swipe-down';
  timestamp: number;
}

export interface Track {
  id: string;
  title: string;
  uri: string;
  duration?: number;
  artist?: string;
  artworkUri?: string;
    album?: string;
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