import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useGestures } from '../hooks/useGestures';
import { GestureEvent, ControlMode } from '../types';

interface GestureOverlayProps {
  children: React.ReactNode;
  mode: ControlMode;
  sensitivity: number;
  onGesture?: (gesture: GestureEvent) => void;
}

export function GestureOverlay({
  children,
  mode,
  sensitivity,
  onGesture,
}: GestureOverlayProps) {
  const gesturesEnabled = mode === 'gestures' || mode === 'both';

  const { PanGesture, TapGesture, LongPressGesture } = useGestures({
    enabled: gesturesEnabled,
    sensitivity,
    onGesture,
  });

  if (!gesturesEnabled) {
    return <View style={styles.container}>{children}</View>;
  }

  return (
    <PanGesture>
      <TapGesture>
        <LongPressGesture>
          <View style={styles.container}>{children}</View>
        </LongPressGesture>
      </TapGesture>
    </PanGesture>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});