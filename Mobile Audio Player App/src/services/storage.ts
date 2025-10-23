// LocalStorage service for persisting app data
import { Playlist, AppSettings, AppState } from '../types';

const STORAGE_KEYS = {
  PLAYLISTS: '@APP:playlists',
  SETTINGS: '@APP:settings',
  CURRENT: '@APP:current',
} as const;

export class StorageService {
  static async getPlaylists(): Promise<Playlist[]> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PLAYLISTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading playlists:', error);
      return [];
    }
  }

  static async savePlaylists(playlists: Playlist[]): Promise<void> {
    try {
      localStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(playlists));
    } catch (error) {
      console.error('Error saving playlists:', error);
    }
  }

  static async getSettings(): Promise<AppSettings> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : {
        controlMode: 'both',
        gestureSensitivity: 50,
        visualFeedback: true,
      };
    } catch (error) {
      console.error('Error loading settings:', error);
      return {
        controlMode: 'both',
        gestureSensitivity: 50,
        visualFeedback: true,
      };
    }
  }

  static async saveSettings(settings: AppSettings): Promise<void> {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }

  static async getCurrentState(): Promise<AppState | null> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error loading current state:', error);
      return null;
    }
  }

  static async saveCurrentState(state: AppState): Promise<void> {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving current state:', error);
    }
  }

  static async clearAll(): Promise<void> {
    try {
      localStorage.removeItem(STORAGE_KEYS.PLAYLISTS);
      localStorage.removeItem(STORAGE_KEYS.SETTINGS);
      localStorage.removeItem(STORAGE_KEYS.CURRENT);
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }

  static getLogs(): string[] {
    try {
      const logs = localStorage.getItem('@APP:logs');
      return logs ? JSON.parse(logs) : [];
    } catch {
      return [];
    }
  }

  static addLog(message: string): void {
    try {
      const logs = this.getLogs();
      logs.push(`[${new Date().toISOString()}] ${message}`);
      // Keep only last 100 logs
      if (logs.length > 100) logs.shift();
      localStorage.setItem('@APP:logs', JSON.stringify(logs));
    } catch (error) {
      console.error('Error adding log:', error);
    }
  }
}
