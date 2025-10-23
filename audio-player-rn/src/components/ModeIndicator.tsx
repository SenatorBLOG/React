import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ControlMode } from '../types';

interface ModeIndicatorProps {
  mode: ControlMode;
}

export function ModeIndicator({ mode }: ModeIndicatorProps) {
  const icons: Record<ControlMode, keyof typeof Ionicons.glyphMap> = {
    buttons: 'radio-button-on',
    gestures: 'hand-right',
    both: 'ellipse',
  } as const; // Ensure literal types for keys

  const labels: Record<ControlMode, string> = {
    buttons: 'Buttons',
    gestures: 'Gestures',
    both: 'Both',
  } as const; // Ensure literal types for keys

  return (
    <View style={styles.container}>
      <Ionicons name={icons[mode]} size={14} color="#d1d5db" />
      <Text style={styles.label}>{labels[mode]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: 12,
    color: '#d1d5db',
  },
});