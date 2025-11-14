// components/ModeIndicator.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ControlMode } from '../types';
import { modeIndicatorStyles as styles } from '../styles/globalStyles';

interface ModeIndicatorProps {
  mode: ControlMode;
  color?: string; // Добавил для custom цвета
}

export function ModeIndicator({ mode, color = '#d1d5db' }: ModeIndicatorProps) {
  const icons: Record<ControlMode, keyof typeof Ionicons.glyphMap> = {
    buttons: 'radio-button-on',
    gestures: 'hand-right-outline', // Сделал outline для стиля
    both: 'options-outline', // Лучше чем ellipse, символизирует комбо
    touch: 'finger-print-outline', // Outline для consistency
    disabled: 'close-circle-outline',
  };

  const labels: Record<ControlMode, string> = {
    buttons: 'Buttons',
    gestures: 'Gestures',
    both: 'Both',
    touch: 'Touch',
    disabled: 'Disabled',
  };

  return (
    <View style={styles.container} accessibilityLabel={`Control mode: ${labels[mode]}`}>
      <Ionicons name={icons[mode]} size={14} color={color} />
      <Text style={[styles.label, { color }]}>{labels[mode]}</Text>
    </View>
  );
}
