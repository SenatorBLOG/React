import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppSettings, AppState, Playlist } from '../types';

export const StorageService = {
  addLog: async (message: string) => {
    try {
      const logs = await AsyncStorage.getItem('logs');
      const updatedLogs = logs ? `${logs}\n${message}` : message;
      await AsyncStorage.setItem('logs', updatedLogs);
    } catch (error) {
      console.error('Storage addLog error:', error);
    }
  },
  getLogs: async (): Promise<string> => {
    try {
      const logs = await AsyncStorage.getItem('logs');
      return logs || '';
    } catch (error) {
      console.error('Storage getLogs error:', error);
      return '';
    }
  },
  clearLogs: async () => {
    try {
      await AsyncStorage.removeItem('logs');
    } catch (error) {
      console.error('Storage clearLogs error:', error);
    }
  },
  getSettings: async (): Promise<AppSettings> => {
    try {
      const settings = await AsyncStorage.getItem('settings');
      return settings ? JSON.parse(settings) : { controlMode: 'both', gestureSensitivity: 50, visualFeedback: true };
    } catch (error) {
      console.error('Storage getSettings error:', error);
      return { controlMode: 'both', gestureSensitivity: 50, visualFeedback: true };
    }
  },
  saveSettings: async (settings: AppSettings) => {
    try {
      await AsyncStorage.setItem('settings', JSON.stringify(settings));
    } catch (error) {
      console.error('Storage saveSettings error:', error);
    }
  },
  getPlaylists: async (): Promise<Playlist[]> => {
    try {
      const playlists = await AsyncStorage.getItem('playlists');
      return playlists ? JSON.parse(playlists) : [];
    } catch (error) {
      console.error('Storage getPlaylists error:', error);
      return [];
    }
  },
  savePlaylists: async (playlists: Playlist[]) => {
    try {
      await AsyncStorage.setItem('playlists', JSON.stringify(playlists));
    } catch (error) {
      console.error('Storage savePlaylists error:', error);
    }
  },
  getCurrentState: async (): Promise<AppState | null> => {
    try {
      const state = await AsyncStorage.getItem('state');
      return state ? JSON.parse(state) : null;
    } catch (error) {
      console.error('Storage getCurrentState error:', error);
      return null;
    }
  },
  saveCurrentState: async (state: AppState) => {
    try {
      await AsyncStorage.setItem('state', JSON.stringify(state));
    } catch (error) {
      console.error('Storage saveCurrentState error:', error);
    }
  },
  clearAll: async () => {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Storage clearAll error:', error);
    }
  },
  getStorageStatus: async (key: string): Promise<boolean> => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value !== null;
    } catch (error) {
      console.error(`Storage getStorageStatus error for ${key}:`, error);
      return false;
    }
  },
};