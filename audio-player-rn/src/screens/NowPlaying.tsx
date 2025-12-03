// screens/NowPlaying.tsx
import React from 'react';
import {
  View,
  Text,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

import { Track, GestureEvent, ControlMode, RootStackParamList } from '../types';
import { ControlButton } from '../components/ControlButton';
import { ProgressBar } from '../components/ProgressBar';
import { GestureOverlay } from '../components/GestureOverlay';
import { nowPlayingStyles as styles, theme } from '../styles/globalStyles';

interface NowPlayingProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  position: number;
  duration: number;
  controlMode: ControlMode; 
  gestureSensitivity: number;
  visualFeedback: boolean;
  shuffle: boolean;
  repeat: 'off' | 'one' | 'all';
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSeek: (position: number) => void;
  onSeekRelative: (seconds: number) => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
  onNavigate: (screen: keyof RootStackParamList) => void;
}

export function NowPlaying({
  currentTrack,
  isPlaying,
  position,
  duration,
  controlMode,
  gestureSensitivity,
  visualFeedback,
  shuffle,
  repeat,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  onSeek,
  onSeekRelative,
  onToggleShuffle,
  onToggleRepeat,
  onNavigate,
}: NowPlayingProps) {
  const handleGesture = (gesture: GestureEvent) => {
    if (visualFeedback) {
      const messages: Record<string, string> = {
        'swipe-left': 'Next track',
        'swipe-right': 'Previous track',
        'tap': 'Tap detected',
        'double-tap': 'Play/Pause',
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

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <ControlButton
            icon="arrow-back"
            onClick={() => onNavigate('Home')}
            size="sm"
            label="Back"
          />
          <Text style={styles.headerTitle}>Now Playing</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Content */}
        <GestureOverlay
          mode={controlMode}
          sensitivity={gestureSensitivity}
          onGesture={handleGesture}
          style={styles.gestureContainer}
        >
          {/* Album art */}
          <View style={styles.artworkWrap}>
            {currentTrack?.artworkUri ? (
              <Image source={{ uri: currentTrack.artworkUri }} style={styles.artwork} />
            ) : (
              <View style={styles.placeholder}>
                <Ionicons name="musical-notes" size={96} color={theme.colors.muted} />
              </View>
            )}
          </View>

          {/* Track info */}
          <View style={styles.info}>
            <Text style={styles.title} numberOfLines={1}>
              {currentTrack?.title ?? 'No track selected'}
            </Text>
            {currentTrack?.artist ? (
              <Text style={styles.artist} numberOfLines={1}>
                {currentTrack.artist}
              </Text>
            ) : null}
            {currentTrack?.album ? (
              <Text style={styles.album} numberOfLines={1}>
                {currentTrack.album}
              </Text>
            ) : null}
          </View>

          {/* Progress */}
          <ProgressBar
            current={position}
            total={duration}
            onSeek={onSeek}
            style={styles.progress}
          />

          {/* Main controls */}
          <View style={styles.mainControls}>
            <ControlButton
              icon="play-skip-back-outline"
              onClick={onPrevious}
              disabled={!currentTrack}
              size="default"
              label="Previous"
            />
            <ControlButton
              icon={isPlaying ? 'pause' : 'play'}
              onClick={isPlaying ? onPause : onPlay}
              disabled={!currentTrack}
              size="lg"
              variant="primary"
              label={isPlaying ? 'Pause' : 'Play'}
              style={styles.playButton}
            />
            <ControlButton
              icon="play-skip-forward-outline"
              onClick={onNext}
              disabled={!currentTrack}
              size="default"
              label="Next"
            />
          </View>

          {/* Secondary controls */}
          <View style={styles.secondaryControls}>
            <ControlButton
              icon="shuffle"
              onClick={onToggleShuffle}
              label="Shuffle"
              style={shuffle ? styles.activeControl : undefined}
            />
            <ControlButton
              icon="refresh-outline"
              onClick={() => onSeekRelative(-15)}
              disabled={!currentTrack}
              label="Back 15s"
            />
            <ControlButton
              icon="repeat"
              onClick={onToggleRepeat}
              label={`Repeat ${repeat}`}
              style={repeat !== 'off' ? styles.activeControl : undefined}
            />
            <ControlButton
              icon="refresh"
              onClick={() => onSeekRelative(15)}
              disabled={!currentTrack}
              label="Forward 15s"
            />
          </View>

          {/* Lyrics / placeholder */}
          <View style={styles.lyrics}>
            <Text style={styles.lyricsText}>Lyrics not available</Text>
          </View>
        </GestureOverlay>

        {/* Hint */}
        {(controlMode === 'gestures' || controlMode === 'both') && (
          <View style={styles.hint}>
            <Text style={styles.hintText}>
              Swipe left/right to change tracks • Double tap to play/pause
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
