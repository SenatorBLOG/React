import { useState, useEffect, useCallback } from 'react';
import { Toaster } from './components/ui/sonner';
import { Track, Playlist, AppSettings, AppState } from './types';
import { getAudioPlayer, PlayerStatus } from './services/audio-player';
import { StorageService } from './services/storage';
import { Splash } from './screens/Splash';
import { Home } from './screens/Home';
import { Playlist as PlaylistScreen } from './screens/Playlist';
import { NowPlaying } from './screens/NowPlaying';
import { FileBrowser } from './screens/FileBrowser';
import { Settings } from './screens/Settings';
import { GestureTutorial } from './screens/GestureTutorial';
import { About } from './screens/About';

type Screen = 'splash' | 'home' | 'playlist' | 'now-playing' | 'file-browser' | 'settings' | 'gesture-tutorial' | 'about';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [isLoading, setIsLoading] = useState(true);
  
  // App State
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [settings, setSettings] = useState<AppSettings>({
    controlMode: 'both',
    gestureSensitivity: 50,
    visualFeedback: true,
  });
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<'off' | 'one' | 'all'>('off');

  const audioPlayer = getAudioPlayer();

  // Initialize app
  useEffect(() => {
    const init = async () => {
      try {
        StorageService.addLog('App initializing...');
        
        // Load settings
        const savedSettings = await StorageService.getSettings();
        setSettings(savedSettings);
        StorageService.addLog('Settings loaded');

        // Load playlists
        const playlists = await StorageService.getPlaylists();
        if (playlists.length > 0 && playlists[0].tracks.length > 0) {
          setTracks(playlists[0].tracks);
          StorageService.addLog(`Loaded ${playlists[0].tracks.length} tracks`);
        } else {
          StorageService.addLog('No tracks found');
        }

        // Load current state
        const savedState = await StorageService.getCurrentState();
        if (savedState && savedState.currentTrackId) {
          const track = playlists[0]?.tracks.find(t => t.id === savedState.currentTrackId);
          if (track) {
            setCurrentTrack(track);
            StorageService.addLog(`Restored current track: ${track.title}`);
          }
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Initialization error:', error);
        StorageService.addLog(`Error: ${error}`);
        setIsLoading(false);
      }
    };

    init();
  }, []);

  // Setup audio player listeners
  useEffect(() => {
    const unsubscribe = audioPlayer.onStatusUpdate((status: PlayerStatus) => {
      setIsPlaying(status.isPlaying);
      setPosition(status.position);
      setDuration(status.duration);
    });

    const unsubscribeError = audioPlayer.onError((error) => {
      console.error('Audio player error:', error);
      StorageService.addLog(`Player error: ${error.message}`);
    });

    return () => {
      unsubscribe();
      unsubscribeError();
    };
  }, [audioPlayer]);

  // Save state on changes
  useEffect(() => {
    if (!isLoading) {
      const state: AppState = {
        currentTrackId: currentTrack?.id || null,
        isPlaying,
        position,
        duration,
        playlistId: 'default',
        volume: 1,
      };
      StorageService.saveCurrentState(state);
    }
  }, [currentTrack, isPlaying, position, duration, isLoading]);

  // Save tracks on changes
  useEffect(() => {
    if (!isLoading && tracks.length > 0) {
      const playlist: Playlist = {
        id: 'default',
        name: 'My Playlist',
        tracks,
        createdAt: new Date().toISOString(),
      };
      StorageService.savePlaylists([playlist]);
    }
  }, [tracks, isLoading]);

  // Save settings on changes
  useEffect(() => {
    if (!isLoading) {
      StorageService.saveSettings(settings);
    }
  }, [settings, isLoading]);

  // Playback functions
  const loadAndPlayTrack = useCallback(async (track: Track) => {
    try {
      StorageService.addLog(`Loading track: ${track.title}`);
      await audioPlayer.loadTrack(track);
      setCurrentTrack(track);
      await audioPlayer.play();
    } catch (error) {
      console.error('Failed to load track:', error);
      StorageService.addLog(`Failed to load track: ${error}`);
    }
  }, [audioPlayer]);

  const handlePlay = useCallback(async () => {
    if (!currentTrack && tracks.length > 0) {
      await loadAndPlayTrack(tracks[0]);
    } else if (currentTrack) {
      await audioPlayer.play();
    }
  }, [currentTrack, tracks, audioPlayer, loadAndPlayTrack]);

  const handlePause = useCallback(() => {
    audioPlayer.pause();
  }, [audioPlayer]);

  const handleNext = useCallback(() => {
    if (tracks.length === 0) return;
    
    let nextIndex = 0;
    if (currentTrack) {
      const currentIndex = tracks.findIndex((t: { id: any; }) => t.id === currentTrack.id);
      if (shuffle) {
        nextIndex = Math.floor(Math.random() * tracks.length);
      } else {
        nextIndex = (currentIndex + 1) % tracks.length;
      }
    }
    
    loadAndPlayTrack(tracks[nextIndex]);
  }, [tracks, currentTrack, shuffle, loadAndPlayTrack]);

  const handlePrevious = useCallback(() => {
    if (tracks.length === 0) return;
    
    let prevIndex = 0;
    if (currentTrack) {
      const currentIndex = tracks.findIndex((t: { id: any; }) => t.id === currentTrack.id);
      if (shuffle) {
        prevIndex = Math.floor(Math.random() * tracks.length);
      } else {
        prevIndex = currentIndex - 1 < 0 ? tracks.length - 1 : currentIndex - 1;
      }
    }
    
    loadAndPlayTrack(tracks[prevIndex]);
  }, [tracks, currentTrack, shuffle, loadAndPlayTrack]);

  const handleSeek = useCallback((newPosition: number) => {
    audioPlayer.seek(newPosition);
  }, [audioPlayer]);

  const handleSeekRelative = useCallback((seconds: number) => {
    const newPosition = Math.max(0, Math.min(duration, position + seconds));
    audioPlayer.seek(newPosition);
  }, [audioPlayer, position, duration]);

  const handleTrackSelect = useCallback((track: Track) => {
    loadAndPlayTrack(track);
  }, [loadAndPlayTrack]);

  const handleAddTracks = useCallback((newTracks: Track[]) => {
    setTracks((prev: any) => [...prev, ...newTracks]);
    StorageService.addLog(`Added ${newTracks.length} new tracks`);
  }, []);

  const handleRemoveTrack = useCallback((trackId: string) => {
    setTracks((prev: any[]) => prev.filter((t: { id: string; }) => t.id !== trackId));
    if (currentTrack?.id === trackId) {
      setCurrentTrack(null);
      audioPlayer.pause();
    }
    StorageService.addLog(`Removed track: ${trackId}`);
  }, [currentTrack, audioPlayer]);

  const handleUpdateSettings = useCallback((newSettings: AppSettings) => {
    setSettings(newSettings);
    StorageService.addLog('Settings updated');
  }, []);

  const handleResetData = useCallback(async () => {
    await StorageService.clearAll();
    setTracks([]);
    setCurrentTrack(null);
    setSettings({
      controlMode: 'both',
      gestureSensitivity: 50,
      visualFeedback: true,
    });
    audioPlayer.pause();
    StorageService.addLog('All data reset');
  }, [audioPlayer]);

  const handleNavigate = useCallback((screen: string) => {
    setCurrentScreen(screen as Screen);
  }, []);

  const handleSplashComplete = useCallback(() => {
    setCurrentScreen('home');
  }, []);

  // Auto-play next track when current ends
  useEffect(() => {
    if (duration > 0 && position >= duration - 0.5 && isPlaying) {
      if (repeat === 'one') {
        handleSeek(0);
        handlePlay();
      } else if (repeat === 'all' || tracks.length > 1) {
        handleNext();
      } else {
        handlePause();
      }
    }
  }, [position, duration, isPlaying, repeat, tracks.length, handleSeek, handlePlay, handleNext, handlePause]);

  // Render current screen
  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <Splash onComplete={handleSplashComplete} />;
      
      case 'home':
        return (
          <Home
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            position={position}
            duration={duration}
            controlMode={settings.controlMode}
            gestureSensitivity={settings.gestureSensitivity}
            visualFeedback={settings.visualFeedback}
            onPlay={handlePlay}
            onPause={handlePause}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onSeek={handleSeek}
            onNavigate={handleNavigate}
          />
        );
      
      case 'playlist':
        return (
          <PlaylistScreen
            tracks={tracks}
            currentTrackId={currentTrack?.id || null}
            isPlaying={isPlaying}
            onTrackSelect={handleTrackSelect}
            onAddTracks={() => handleNavigate('file-browser')}
            onRemoveTrack={handleRemoveTrack}
            onNavigate={handleNavigate}
          />
        );
      
      case 'now-playing':
        return (
          <NowPlaying
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            position={position}
            duration={duration}
            controlMode={settings.controlMode}
            gestureSensitivity={settings.gestureSensitivity}
            visualFeedback={settings.visualFeedback}
            shuffle={shuffle}
            repeat={repeat}
            onPlay={handlePlay}
            onPause={handlePause}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onSeek={handleSeek}
            onSeekRelative={handleSeekRelative}
            onToggleShuffle={() => setShuffle((prev: any) => !prev)}
            onToggleRepeat={() => setRepeat((prev: string) => prev === 'off' ? 'all' : prev === 'all' ? 'one' : 'off')}
            onNavigate={handleNavigate}
          />
        );
      
      case 'file-browser':
        return (
          <FileBrowser
            onAddTracks={handleAddTracks}
            onNavigate={handleNavigate}
          />
        );
      
      case 'settings':
        return (
          <Settings
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onResetData={handleResetData}
            onNavigate={handleNavigate}
          />
        );
      
      case 'gesture-tutorial':
        return <GestureTutorial onNavigate={handleNavigate} />;
      
      case 'about':
        return <About onNavigate={handleNavigate} />;
      
      default:
        return <Home
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          position={position}
          duration={duration}
          controlMode={settings.controlMode}
          gestureSensitivity={settings.gestureSensitivity}
          visualFeedback={settings.visualFeedback}
          onPlay={handlePlay}
          onPause={handlePause}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onSeek={handleSeek}
          onNavigate={handleNavigate}
        />;
    }
  };

  return (
    <>
      {renderScreen()}
      <Toaster position="bottom-center" />
    </>
  );
}
