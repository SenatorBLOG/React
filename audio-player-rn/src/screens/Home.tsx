// screens/Home.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

import { Track, ControlMode, GestureEvent, RootStackParamList } from '../types';
import { ControlButton } from '../components/ControlButton';
import { ProgressBar } from '../components/ProgressBar';
import { ModeIndicator } from '../components/ModeIndicator';
import { GestureOverlay } from '../components/GestureOverlay';

type HomeProps = {
  currentTrack: Track | null;
  isPlaying: boolean;
  position: number;
  duration: number;
  controlMode: ControlMode;
  gestureSensitivity: number;
  visualFeedback: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSeek: (position: number) => void;
  onNavigate: (screen: keyof RootStackParamList) => void;
};

export function Home({
  currentTrack,
  isPlaying,
  position,
  duration,
  controlMode,
  gestureSensitivity,
  visualFeedback,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  onSeek,
  onNavigate,
}: HomeProps) {
  const handleGesture = (gesture: GestureEvent) => {
    if (visualFeedback) {
      const messages: Record<string, string> = {
        'swipe-left': 'Next track',
        'swipe-right': 'Previous track',
        'swipe-up': 'Volume up',
        'swipe-down': 'Volume down',
        'tap': 'Tap detected',
        'double-tap': 'Play/Pause',
        'long-press': 'Long press detected',
      };
      Toast.show({ type: 'info', text1: messages[gesture.type] || 'Gesture detected' });
    }

    switch (gesture.type) {
      case 'swipe-left':
        onNext();
        break;
      case 'swipe-right':
        onPrevious();
        break;
      case 'double-tap':
        isPlaying ? onPause() : onPlay();
        break;
    }
  };

  const handleCoverPress = () => {
    // навигация — имена экрана берём из RootStackParamList
    onNavigate('NowPlaying');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Audio Player</Text>
        <View style={styles.headerRight}>
          <ModeIndicator mode={controlMode} />
          <ControlButton
            icon="settings-outline"
            onClick={() => onNavigate('Settings')}
            size="sm"
            label="Settings"
          />
        </View>
      </View>

      {/* Content */}
      <GestureOverlay
        mode={controlMode}
        sensitivity={gestureSensitivity}
        onGesture={handleGesture}
        style={styles.gestureOverlay as StyleProp<ViewStyle>}
      >
        <View style={styles.center}>
          {/* Album art */}
          <TouchableOpacity
            style={styles.cover}
            activeOpacity={0.85}
            onPress={handleCoverPress}
          >
            {currentTrack?.artworkUri ? (
              <Image source={{ uri: currentTrack.artworkUri }} style={styles.artwork} />
            ) : (
              <Ionicons name="musical-notes-outline" size={96} color="#9ca3af" />
            )}
          </TouchableOpacity>

          {/* Track info */}
          <View style={styles.trackInfo}>
            <Text style={styles.trackTitle} numberOfLines={1}>
              {currentTrack?.title ?? 'No track selected'}
            </Text>
            {currentTrack?.artist ? (
              <Text style={styles.trackArtist} numberOfLines={1}>
                {currentTrack.artist}
              </Text>
            ) : null}
          </View>

          {/* ProgressBar */}
          <View style={styles.progress}>
            <ProgressBar
              current={position}
              total={duration}
              onSeek={onSeek}
            />
          </View>

          {/* Controls */}
          <View style={styles.controls}>
            <ControlButton
              icon="play-skip-back-outline"
              onClick={onPrevious}
              disabled={!currentTrack}
              label="Previous"
            />
            <ControlButton
              icon={isPlaying ? 'pause' : 'play'}
              onClick={isPlaying ? onPause : onPlay}
              disabled={!currentTrack}
              size="lg"
              variant="primary"
              label={isPlaying ? 'Pause' : 'Play'}
            />
            <ControlButton
              icon="play-skip-forward-outline"
              onClick={onNext}
              disabled={!currentTrack}
              label="Next"
            />
          </View>

          {/* Quick actions */}
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => onNavigate('Playlist')}
            >
              <Ionicons name="list-outline" size={20} />
              <Text style={styles.actionText}>Playlist</Text>
            </TouchableOpacity>
          </View>
        </View>
      </GestureOverlay>

      {/* Hint */}
      {(controlMode === 'gestures' || controlMode === 'both') && (
        <View style={styles.hint}>
          <Text style={styles.hintText}>Swipe left/right to change tracks</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', paddingTop: 24 },
  gestureOverlay: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#27272a',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { color: '#fff', fontSize: 18 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  cover: {
    width: 260,
    height: 260,
    borderRadius: 16,
    backgroundColor: '#0b0b0b',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: 18,
  },
  artwork: { width: '100%', height: '100%', resizeMode: 'cover' },
  trackInfo: { alignItems: 'center', marginBottom: 12 },
  trackTitle: { color: '#fff', fontSize: 20, marginBottom: 4 },
  trackArtist: { color: '#9ca3af', fontSize: 14 },
  progress: { width: '90%', marginVertical: 10 },
  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 18, marginVertical: 8 },
  quickActions: { flexDirection: 'row', marginTop: 8 },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 8,
  },
  actionText: { color: '#fff', marginLeft: 8 },
  hint: { padding: 12, alignItems: 'center' },
  hintText: { color: '#9ca3af', fontSize: 12 },
});
