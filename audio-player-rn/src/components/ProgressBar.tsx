// components/ProgressBar.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import Slider from '@react-native-community/slider';
import { progressBarStyles as styles } from '../styles/globalStyles';

interface ProgressBarProps {
  current: number; // Current position in seconds
  total: number; // Total duration in seconds
  onSeek?: (position: number) => void;
  style?: StyleProp<ViewStyle>;
}

export function ProgressBar({ current, total, onSeek, style }: ProgressBarProps) {
  const [sliderValue, setSliderValue] = useState(current);
  const [isSliding, setIsSliding] = useState(false);

  useEffect(() => {
    if (!isSliding) {
      setSliderValue(current);
    }
  }, [current, isSliding]);

  const formatTime = (seconds: number) => {
    if (!isFinite(seconds) || seconds <= 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleValueChange = (value: number) => {
    setSliderValue(value);
  };

  const handleSlidingStart = () => {
    setIsSliding(true);
  };

  const handleSlidingComplete = (value: number) => {
    setIsSliding(false);
    onSeek?.(value);
  };

  const maxValue = isFinite(total) && total > 0 ? total : 0;
  const displayValue = isSliding ? sliderValue : current;

  return (
    <View style={[styles.container, style]}>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={maxValue}
        value={isFinite(displayValue) ? displayValue : 0}
        onValueChange={handleValueChange}
        onSlidingStart={handleSlidingStart}
        onSlidingComplete={handleSlidingComplete}
        minimumTrackTintColor="#3b82f6"
        maximumTrackTintColor="#1f2937"
        thumbTintColor="#ffffff"
      />
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{formatTime(displayValue)}</Text>
        <Text style={styles.timeText}>{formatTime(total)}</Text>
      </View>
    </View>
  );
}