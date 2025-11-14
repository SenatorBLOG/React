// src/services/storage.ts (обновлённый, добавил getStorageStatus обратно)
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppSettings, AppState, Playlist } from '../types';

const LOG_KEY = 'logs';
const MAX_LOGS = 200;

export const StorageService = {
  addLog: async (message: string) => {
    try {
      let logs: string[] = [];
      const stored = await AsyncStorage.getItem(LOG_KEY);
      if (stored) {
        if (stored.startsWith('[')) {
          logs = JSON.parse(stored);
        } else {
          // Migrate old string format to array
          logs = stored.split('\n').filter(Boolean);
        }
      }
      logs.push(`${new Date().toISOString()}: ${message}`);
      if (logs.length > MAX_LOGS) {
        logs = logs.slice(-MAX_LOGS);
      }
      await AsyncStorage.setItem(LOG_KEY, JSON.stringify(logs));
    } catch (error) {
      console.error('Storage addLog error:', error);
    }
  },

  getLogs: async (): Promise<string[]> => {
    try {
      const stored = await AsyncStorage.getItem(LOG_KEY);
      if (stored) {
        if (stored.startsWith('[')) {
          return JSON.parse(stored);
        } else {
          // Migrate old string format to array
          return stored.split('\n').filter(Boolean);
        }
      }
      return [];
    } catch (error) {
      console.error('Storage getLogs error:', error);
      return [];
    }
  },

  clearLogs: async () => {
    try {
      await AsyncStorage.removeItem(LOG_KEY);
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

  clearAppData: async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem('logs'),
        AsyncStorage.removeItem('settings'),
        AsyncStorage.removeItem('playlists'),
        AsyncStorage.removeItem('state'),
      ]);
    } catch (error) {
      console.error('Storage clearAppData error:', error);
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