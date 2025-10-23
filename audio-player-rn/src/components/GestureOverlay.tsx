// components/GestureOverlay.tsx
import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { useGestures } from '../hooks/useGestures';
import { GestureEvent, ControlMode } from '../types';

interface GestureOverlayProps {
  children?: React.ReactNode;
  mode: ControlMode;
  sensitivity: number;
  onGesture?: (gesture: GestureEvent) => void;
  style?: StyleProp<ViewStyle>;
}

export function GestureOverlay({
  children,
  mode,
  sensitivity,
  onGesture,
  style,
}: GestureOverlayProps) {
  const gesturesEnabled = mode === 'gestures' || mode === 'both';

  const { PanGesture, TapGesture, LongPressGesture } = useGestures({
    enabled: gesturesEnabled,
    sensitivity,
    onGesture,
  });

  if (!gesturesEnabled) {
    return <View style={[styles.container, style]}>{children}</View>;
  }

  return (
    <PanGesture>
      <TapGesture>
        <LongPressGesture>
          <View style={[styles.container, style]}>{children}</View>
        </LongPressGesture>
      </TapGesture>
    </PanGesture>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
