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
  };

  const labels: Record<ControlMode, string> = {
    buttons: 'Buttons',
    gestures: 'Gestures',
    both: 'Both',
  };

  const Icon = Ionicons;

  return (
    <View style={styles.container}>
      <Icon name={icons[mode]} size={14} color="#d1d5db" />
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