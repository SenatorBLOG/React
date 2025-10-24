import React, { useState, useEffect, useCallback, useRef } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
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
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './types'; 



const Stack = createNativeStackNavigator<RootStackParamList>();

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

  const audioPlayerRef = useRef(getAudioPlayer());
  const audioPlayer = audioPlayerRef.current;

  // Initialize app
  useEffect(() => {
    const init = async () => {
      try {
        StorageService.addLog('App initializing...');
        const savedSettings = await StorageService.getSettings();
        setSettings(savedSettings);
        StorageService.addLog('Settings loaded');

        const playlists = await StorageService.getPlaylists();
        if (playlists.length > 0 && playlists[0].tracks.length > 0) {
          setTracks(playlists[0].tracks);
          StorageService.addLog(`Loaded ${playlists[0].tracks.length} tracks`);
        } else {
          StorageService.addLog('No tracks found');
        }

        const savedState = await StorageService.getCurrentState();
        if (savedState && savedState.currentTrackId) {
          const track = playlists[0]?.tracks.find((t) => t.id === savedState.currentTrackId);
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
      // unmount
      unsubStatus && unsubStatus();
      unsubError && unsubError();
    };
  }, [audioPlayer]); // audioPlayer 


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
  const loadAndPlayTrack = useCallback(
    async (track: Track) => {
      try {
        StorageService.addLog(`Loading track: ${track.title}`);
        await audioPlayer.loadTrack(track);
        setCurrentTrack(track);
        await audioPlayer.play();
      } catch (error) {
        console.error('Failed to load track:', error);
        StorageService.addLog(`Failed to load track: ${error}`);
        Toast.show({
          type: 'error',
          text1: 'Load Error',
          text2: `${error}`,
        });
      }
    },
    [audioPlayer]
  );

    const handlePlay = useCallback(async () => {
    try {
      if (!currentTrack && tracks.length > 0) {
        await loadAndPlayTrack(tracks[0]);
      } else if (currentTrack) {
        await audioPlayer.play();
      }
    } catch (err) {
      console.error('Play failed', err);
      Toast.show({ type: 'error', text1: 'Playback failed', text2: `${err}` });
    }
  }, [currentTrack, tracks, audioPlayer, loadAndPlayTrack]);


  const handlePause = useCallback(async () => {
    try {
      await audioPlayer.pause();
    } catch (err) {
      console.error('Pause failed', err);
    }
  }, [audioPlayer]);


  const handleNext = useCallback(() => {
    if (tracks.length === 0) return;

    let nextIndex = 0;
    if (currentTrack) {
      const currentIndex = tracks.findIndex((t) => t.id === currentTrack.id);
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
      const currentIndex = tracks.findIndex((t) => t.id === currentTrack.id);
      if (shuffle) {
        prevIndex = Math.floor(Math.random() * tracks.length);
      } else {
        prevIndex = currentIndex - 1 < 0 ? tracks.length - 1 : currentIndex - 1;
      }
    }

    loadAndPlayTrack(tracks[prevIndex]);
  }, [tracks, currentTrack, shuffle, loadAndPlayTrack]);

  const handleSeek = useCallback(
    (newPosition: number) => {
      audioPlayer.seek(newPosition);
    },
    [audioPlayer]
  );

  const handleSeekRelative = useCallback(
    (seconds: number) => {
      const newPosition = Math.max(0, Math.min(duration, position + seconds));
      audioPlayer.seek(newPosition);
    },
    [audioPlayer, position, duration]
  );

  const handleTrackSelect = useCallback(
    (track: Track) => {
      loadAndPlayTrack(track);
    },
    [loadAndPlayTrack]
  );

  const handleAddTracks = useCallback(
    (newTracks: Track[]) => {
      setTracks((prev) => [...prev, ...newTracks]);
      StorageService.addLog(`Added ${newTracks.length} new tracks`);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: `Added ${newTracks.length} tracks`,
      });
    },
    []
  );

  const handleRemoveTrack = useCallback(
    (trackId: string) => {
      setTracks((prev) => prev.filter((t) => t.id !== trackId));
      if (currentTrack?.id === trackId) {
        setCurrentTrack(null);
        audioPlayer.pause();
      }
      StorageService.addLog(`Removed track: ${trackId}`);
    },
    [currentTrack, audioPlayer]
  );

  const handleUpdateSettings = useCallback(
    (newSettings: AppSettings) => {
      setSettings(newSettings);
      StorageService.addLog('Settings updated');
    },
    []
  );

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

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash">
            {(props: NativeStackScreenProps<RootStackParamList, 'Splash'>) => (
              <Splash {...props} onComplete={() => props.navigation.navigate('Home')} />
            )}
          </Stack.Screen>
          <Stack.Screen name="Home">
            {(props) => (
              <Home
                {...props}
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
                onNavigate={props.navigation.navigate}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="Playlist">
            {(props) => (
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
            {(props) => (
              <NowPlaying
                {...props}
                currentTrack={currentTrack}
                isPlaying={isPlaying}
                position={position}
                duration={duration}
                controlMode={settings.controlMode as 'gestures' | 'both' | 'touch' | 'disabled'}
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
                onToggleShuffle={() => setShuffle((prev) => !prev)}
                onToggleRepeat={() =>
                  setRepeat((prev) => (prev === 'off' ? 'all' : prev === 'all' ? 'one' : 'off'))
                }
                onNavigate={props.navigation.navigate}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="FileBrowser">
            {(props: NativeStackScreenProps<RootStackParamList, 'FileBrowser'>) => (
              <FileBrowser
                {...props}
                onAddTracks={handleAddTracks}
                onNavigate={props.navigation.navigate}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="Settings">
            {(props) => (
              <Settings
                {...props}
                settings={settings}
                onUpdateSettings={handleUpdateSettings}
                onResetData={handleResetData}
                onNavigate={(screen) => props.navigation.navigate(screen)}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="GestureTutorial">
            {(props) => <GestureTutorial {...props} onNavigate={props.navigation.navigate} />}
          </Stack.Screen>
<Stack.Screen name="About" component={About} /> 
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </GestureHandlerRootView>
  );
}