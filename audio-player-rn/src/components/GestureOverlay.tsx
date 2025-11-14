// components/GestureOverlay.tsx
import React, { memo } from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import {
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';

import { GestureEvent, ControlMode } from '../types';
import { gestureOverlayStyles as baseStyles } from '../styles/globalStyles';

interface GestureOverlayProps {
  children?: React.ReactNode;
  mode: ControlMode;
  sensitivity: number;
  onGesture?: (gesture: GestureEvent) => void;
  style?: StyleProp<ViewStyle>;
}

// Constants for gesture thresholds
const SWIPE_THRESHOLD = 50; // px
const DOUBLE_TAP_DELAY = 250; // ms

export const GestureOverlay = memo(
  ({ children, mode, sensitivity, onGesture, style }: GestureOverlayProps) => {
    const gesturesEnabled = mode === 'gestures' || mode === 'both';

    if (!gesturesEnabled || !onGesture) {
      return (
        <View style={[baseStyles.container, style]}>
          {children}
        </View>
      );
    }

    const swipeDistance = Math.max(30, SWIPE_THRESHOLD * (1 - sensitivity / 100));

    // Swipe gesture - horizontal only
    const pan = Gesture.Pan()
      .onEnd((e) => {
        try {
          const { translationX } = e;
          if (Math.abs(translationX) < swipeDistance) return;

          const type: GestureEvent['type'] = translationX > 0 ? 'swipe-right' : 'swipe-left';
          onGesture({ type, timestamp: Date.now() });
        } catch (error) {
          console.error('Pan gesture error:', error);
        }
      });

    // Double tap - for play/pause
    const doubleTap = Gesture.Tap()
      .numberOfTaps(2)
      .maxDuration(DOUBLE_TAP_DELAY)
      .onStart(() => {
        try {
          onGesture({ type: 'double-tap', timestamp: Date.now() });
        } catch (error) {
          console.error('Double tap error:', error);
        }
      });

    // Compose: doubleTap takes priority
    const composed = Gesture.Race(doubleTap, pan);

    return (
      <GestureDetector gesture={composed}>
        <View style={[baseStyles.container, style]}>
          {children}
        </View>
      </GestureDetector>
    );
  }
);

GestureOverlay.displayName = 'GestureOverlay';
