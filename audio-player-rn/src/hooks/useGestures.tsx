// hooks/useGestures.ts
import React, { useMemo, FC } from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { GestureEvent } from '../types';

interface GestureComponentProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

interface GestureConfig {
  enabled?: boolean;
  sensitivity?: number; // 0-100
  onGesture?: (gesture: GestureEvent) => void;
}

export function useGestures({
  enabled = true,
  sensitivity = 50,
  onGesture,
}: GestureConfig) {
  const swipeThreshold = Math.max(30, 50 * (1 - sensitivity / 100));
  const minVelocity = 200;

  const gesture = useMemo(() => {
    if (!enabled) return null;

    const pan = Gesture.Pan()
      .minDistance(swipeThreshold)
      .minVelocity(minVelocity)
      .onEnd((e: any) => {
        const { translationX = 0, translationY = 0, velocityX = 0, velocityY = 0 } = e;
        let type: GestureEvent['type'] | null = null;

        // Prefer translation magnitude, then velocity as confirmation
        if (Math.abs(translationX) > Math.abs(translationY)) {
          if (Math.abs(translationX) >= swipeThreshold && Math.abs(velocityX) >= minVelocity) {
            type = translationX > 0 ? 'swipe-right' : 'swipe-left';
          }
        } else {
          if (Math.abs(translationY) >= swipeThreshold && Math.abs(velocityY) >= minVelocity) {
            type = translationY > 0 ? 'swipe-down' : 'swipe-up';
          }
        }

        if (type) onGesture?.({ type, timestamp: Date.now() });
      });

    const doubleTap = Gesture.Tap()
      .numberOfTaps(2)
      .maxDelay(250)
      .onEnd(() => onGesture?.({ type: 'double-tap', timestamp: Date.now() }));

    const longPress = Gesture.LongPress()
      .minDuration(500)
      .onEnd(() => onGesture?.({ type: 'long-press', timestamp: Date.now() }));

    // allow pan simultaneous detection, but doubleTap and longPress exclusive between them
    return Gesture.Simultaneous(pan, Gesture.Exclusive(doubleTap, longPress));
  }, [enabled, swipeThreshold, minVelocity, onGesture]);

  const GestureWrapper: FC<GestureComponentProps> = ({ children, style }) =>
    gesture ? (
      <GestureDetector gesture={gesture}>
        <View style={style}>{children}</View>
      </GestureDetector>
    ) : (
      <View style={style}>{children}</View>
    );

  return { GestureWrapper };
}
