// components/ProgressBar.tsx
import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import Slider from '@react-native-community/slider';

interface ProgressBarProps {
  current: number; // Current position in seconds
  total: number; // Total duration in seconds
  onSeek?: (position: number) => void;
  style?: StyleProp<ViewStyle>;
}

export function ProgressBar({ current, total, onSeek, style }: ProgressBarProps) {
  const formatTime = (seconds: number) => {
    if (!isFinite(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={[styles.container, style]}>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={isFinite(total) && total > 0 ? total : 0}
        value={isFinite(current) ? current : 0}
        onSlidingComplete={(value) => onSeek?.(value)}
        minimumTrackTintColor="#3b82f6"
        maximumTrackTintColor="#1f2937"
        thumbTintColor="#ffffff"
      />
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{formatTime(current)}</Text>
        <Text style={styles.timeText}>{formatTime(total)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 6,
    width: '100%',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  timeText: {
    color: '#9ca3af',
    fontSize: 12,
  },
});
