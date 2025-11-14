// App.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';

import { Track, AppSettings, RootStackParamList } from './types';
import { getAudioPlayer, PlayerStatus } from './services/audio-player';
import { StorageService } from './services/storage';
import { ErrorBoundary } from './components/ErrorBoundary';

import { Splash } from './screens/Splash';
import { Home } from './screens/Home';
import { Playlist as PlaylistScreen } from './screens/Playlist';
import { NowPlaying } from './screens/NowPlaying';
import { FileBrowser } from './screens/FileBrowser';
import { Settings } from './screens/Settings';
import { GestureTutorial } from './screens/GestureTutorial';
import { About } from './screens/About';

const Stack = createNativeStackNavigator<RootStackParamList>();
type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
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

  // === Инициализация ===
  useEffect(() => {
    const init = async () => {
      try {
        StorageService.addLog('App initializing...');
        const savedSettings = await StorageService.getSettings();
        setSettings(savedSettings);

        const playlists = await StorageService.getPlaylists();
        if (playlists.length > 0 && playlists[0].tracks.length > 0) {
          setTracks(playlists[0].tracks);
          StorageService.addLog(`Loaded ${playlists[0].tracks.length} tracks`);
          
          const savedState = await StorageService.getCurrentState();
          if (savedState?.currentTrackId) {
            const track = playlists[0].tracks.find(t => t.id === savedState.currentTrackId);
            if (track) {
              setCurrentTrack(track);
              StorageService.addLog(`Restored track: ${track.title}`);
            } else {
              await StorageService.saveCurrentState({
                currentTrackId: null,
                isPlaying: false,
                position: 0,
                duration: 0,
                playlistId: 'default',
                volume: 1,
              });
            }
          }
        } else {
          // No tracks, ensure clean state
          await StorageService.saveCurrentState({
            currentTrackId: null,
            isPlaying: false,
            position: 0,
            duration: 0,
            playlistId: 'default',
            volume: 1,
          });
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Init error:', error);
        StorageService.addLog(`Error: ${error}`);
        setIsLoading(false);
      }
    };

    init();
  }, []);

  // === Подписка на плеер ===
  useEffect(() => {
    const unsubStatus = audioPlayer.onStatusUpdate((status: PlayerStatus) => {
      setIsPlaying(status.isPlaying);
      setPosition(status.position);
      setDuration(status.duration);
    });

    const unsubError = audioPlayer.onError((error) => {
      console.error('Audio player error:', error);
      StorageService.addLog(`Player error: ${error.message}`);
      Toast.show({
        type: 'error',
        text1: 'Audio Error',
        text2: error.message,
      });
    });

    return () => {
      unsubStatus?.();
      unsubError?.();
    };
  }, [audioPlayer]);

  // === Сохранение ===
  useEffect(() => {
    if (!isLoading) {
      StorageService.saveCurrentState({
        currentTrackId: currentTrack?.id || null,
        isPlaying,
        position,
        duration,
        playlistId: 'default',
        volume: 1,
      });
    }
  }, [currentTrack, isPlaying, position, duration, isLoading]);

  useEffect(() => {
    if (!isLoading && tracks.length > 0) {
      StorageService.savePlaylists([
        { id: 'default', name: 'My Playlist', tracks, createdAt: new Date().toISOString() }
      ]);
    }
  }, [tracks, isLoading]);

  useEffect(() => {
    if (!isLoading) StorageService.saveSettings(settings);
  }, [settings, isLoading]);

  // === Плейбек ===
  const loadAndPlayTrack = useCallback(async (track: Track) => {
    try {
      await audioPlayer.loadTrack(track);
      setCurrentTrack(track);
      await audioPlayer.play();
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Load Error', text2: error.message });
    }
  }, [audioPlayer]);

  const handlePlay = useCallback(async () => {
    if (tracks.length === 0) {
      Toast.show({
        type: 'info',
        text1: 'No tracks',
        text2: 'Add music to get started',
      });
      return;
    }

    if (!currentTrack) {
      await loadAndPlayTrack(tracks[0]);
    } else if (duration === 0) {
      await loadAndPlayTrack(currentTrack);
    } else {
      await audioPlayer.play();
    }
  }, [currentTrack, tracks, duration, loadAndPlayTrack, audioPlayer]);

  const handlePause = useCallback(() => audioPlayer.pause(), [audioPlayer]);

  const handleNext = useCallback(() => {
    try {
      if (tracks.length === 0 || !currentTrack) return;
      const idx = tracks.findIndex(t => t.id === currentTrack.id);
      const nextIdx = shuffle ? Math.floor(Math.random() * tracks.length) : (idx + 1) % tracks.length;
      loadAndPlayTrack(tracks[nextIdx]);
    } catch (error) {
      console.error('handleNext error:', error);
    }
  }, [currentTrack, tracks, shuffle, loadAndPlayTrack]);

  const handlePrevious = useCallback(() => {
    try {
      if (tracks.length === 0 || !currentTrack) return;
      const idx = tracks.findIndex(t => t.id === currentTrack.id);
      const prevIdx = shuffle ? Math.floor(Math.random() * tracks.length) : (idx - 1 + tracks.length) % tracks.length;
      loadAndPlayTrack(tracks[prevIdx]);
    } catch (error) {
      console.error('handlePrevious error:', error);
    }
  }, [currentTrack, tracks, shuffle, loadAndPlayTrack]);

  const handleSeek = useCallback((pos: number) => audioPlayer.seek(pos), [audioPlayer]);

  const handleSeekRelative = useCallback(
    (sec: number) => audioPlayer.seek(Math.max(0, Math.min(duration, position + sec))),
    [position, duration, audioPlayer]
  );

  const handleTrackSelect = useCallback((track: Track) => loadAndPlayTrack(track), [loadAndPlayTrack]);

  const handleAddTracks = useCallback((newTracks: Track[]) => {
    setTracks(prev => [...prev, ...newTracks]);
    Toast.show({ type: 'success', text1: 'Added', text2: `${newTracks.length} tracks` });
  }, []);

  const handleRemoveTrack = useCallback((id: string) => {
    setTracks(prev => prev.filter(t => t.id !== id));
    if (currentTrack?.id === id) {
      setCurrentTrack(null);
      audioPlayer.pause();
    }
  }, [currentTrack, audioPlayer]);

  const handleUpdateSettings = useCallback((s: AppSettings) => setSettings(s), []);

  const handleResetData = useCallback(async () => {
    await StorageService.clearAppData();
    setTracks([]);
    setCurrentTrack(null);
    setSettings({ controlMode: 'both', gestureSensitivity: 50, visualFeedback: true });
    audioPlayer.pause();
  }, [audioPlayer]);

  // === Авто-следующий трек ===
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

  // === Навигация с переходом в FileBrowser ===
  const HomeWithNav = (props: HomeScreenProps) => {
    const onPlayWithNav = async () => {
      if (tracks.length === 0) {
        Toast.show({
          type: 'info',
          text1: 'No tracks',
          text2: 'Add music to get started',
        });
        props.navigation.navigate('FileBrowser');
      } else {
        handlePlay();
      }
    };

    return (
      <Home
        {...props}
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        position={position}
        duration={duration}
        controlMode={settings.controlMode}
        gestureSensitivity={settings.gestureSensitivity}
        visualFeedback={settings.visualFeedback}
        onPlay={onPlayWithNav}
        onPause={handlePause}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onSeek={handleSeek}
        onNavigate={props.navigation.navigate}
      />
    );
  };

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <Stack.Navigator id="root" initialRouteName="Splash" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Splash">
              {props => <Splash {...props} onComplete={() => props.navigation.navigate('Home')} />}
            </Stack.Screen>

            <Stack.Screen name="Home" component={HomeWithNav} />

            <Stack.Screen name="Playlist">
              {props => (
                <PlaylistScreen
                  {...props}
                  tracks={tracks}
                  currentTrackId={currentTrack?.id || null}
                  isPlaying={isPlaying}
                  onTrackSelect={handleTrackSelect}
                  onAddTracks={() => props.navigation.navigate('FileBrowser')}
                  onRemoveTrack={handleRemoveTrack}
                  onNavigate={props.navigation.navigate}
                />
              )}
            </Stack.Screen>

            <Stack.Screen name="NowPlaying">
              {props => (
                <NowPlaying
                  {...props}
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
                  onToggleShuffle={() => setShuffle(p => !p)}
                  onToggleRepeat={() => setRepeat(p => p === 'off' ? 'all' : p === 'all' ? 'one' : 'off')}
                  onNavigate={props.navigation.navigate}
                />
              )}
            </Stack.Screen>

            <Stack.Screen name="FileBrowser">
              {props => (
                <FileBrowser
                  {...props}
                  onAddTracks={handleAddTracks}
                  onNavigate={props.navigation.navigate}
                />
              )}
            </Stack.Screen>

            <Stack.Screen name="Settings">
              {props => (
                <Settings
                  {...props}
                  settings={settings}
                  onUpdateSettings={handleUpdateSettings}
                  onResetData={handleResetData}
                  onNavigate={screen => props.navigation.navigate(screen)}
                />
              )}
            </Stack.Screen>

            <Stack.Screen name="GestureTutorial" component={GestureTutorial} />

            <Stack.Screen name="About" component={About} />
          </Stack.Navigator>
        </NavigationContainer>
        <Toast />
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
