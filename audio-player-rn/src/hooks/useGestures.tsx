import { useCallback, FC } from 'react';
import {
  PanGestureHandler,
  TapGestureHandler,
  LongPressGestureHandler,
  PanGestureHandlerGestureEvent,
  TapGestureHandlerGestureEvent,
  LongPressGestureHandlerGestureEvent,
  PanGestureHandlerProps,
  TapGestureHandlerProps,
  LongPressGestureHandlerProps,
} from 'react-native-gesture-handler';
import { GestureEvent } from '../types';

interface GestureComponentProps {
  children: React.ReactNode;
}

interface GestureHandlers {
  PanGesture: FC<GestureComponentProps & PanGestureHandlerProps>;
  TapGesture: FC<GestureComponentProps & TapGestureHandlerProps>;
  LongPressGesture: FC<GestureComponentProps & LongPressGestureHandlerProps>;
}

interface GestureConfig {
  enabled: boolean;
  sensitivity: number; // 0-100
  onGesture?: (gesture: GestureEvent) => void;
}

export function useGestures({ enabled, sensitivity, onGesture }: GestureConfig): GestureHandlers {
  const SWIPE_THRESHOLD = 50 - sensitivity * 0.3; // Higher sensitivity = lower threshold

  const handlePan = useCallback(
    ({ nativeEvent }: PanGestureHandlerGestureEvent) => {
      if (!enabled) return;
      if (Math.abs(nativeEvent.velocityX) > Math.abs(nativeEvent.velocityY)) {
        if (nativeEvent.velocityX < -SWIPE_THRESHOLD) {
          onGesture?.({ type: 'swipe-left', timestamp: Date.now() });
        } else if (nativeEvent.velocityX > SWIPE_THRESHOLD) {
          onGesture?.({ type: 'swipe-right', timestamp: Date.now() });
        }
      } else {
        if (nativeEvent.velocityY < -SWIPE_THRESHOLD) {
          onGesture?.({ type: 'swipe-up', timestamp: Date.now() });
        } else if (nativeEvent.velocityY > SWIPE_THRESHOLD) {
          onGesture?.({ type: 'swipe-down', timestamp: Date.now() });
        }
      }
    },
    [enabled, sensitivity, onGesture]
  );

  const handleDoubleTap = useCallback(
    ({ nativeEvent }: TapGestureHandlerGestureEvent) => {
      if (!enabled || nativeEvent.state !== 4) return; // State.ACTIVE
      onGesture?.({ type: 'double-tap', timestamp: Date.now() });
    },
    [enabled, onGesture]
  );

  const handleLongPress = useCallback(
    ({ nativeEvent }: LongPressGestureHandlerGestureEvent) => {
      if (!enabled || nativeEvent.state !== 4) return; // State.ACTIVE
      onGesture?.({ type: 'long-press', timestamp: Date.now() });
    },
    [enabled, onGesture]
  );

  return {
    PanGesture: ({ children, ...props }) => (
      <PanGestureHandler onGestureEvent={handlePan} enabled={enabled} {...props}>
        {children}
      </PanGestureHandler>
    ),
    TapGesture: ({ children, ...props }) => (
      <TapGestureHandler numberOfTaps={2} onHandlerStateChange={handleDoubleTap} enabled={enabled} {...props}>
        {children}
      </TapGestureHandler>
    ),
    LongPressGesture: ({ children, ...props }) => (
      <LongPressGestureHandler onHandlerStateChange={handleLongPress} enabled={enabled} {...props}>
        {children}
      </LongPressGestureHandler>
    ),
  };
}