// Custom hook for gesture detection
import { useEffect, useRef, useState } from 'react';
import { GestureEvent } from '../types';

interface GestureConfig {
  enabled: boolean;
  sensitivity: number; // 0-100
  onGesture?: (gesture: GestureEvent) => void;
}

export function useGestures(config: GestureConfig) {
  const [lastGesture, setLastGesture] = useState<GestureEvent | null>(null);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const tapCountRef = useRef(0);
  const tapTimeoutRef = useRef<number | null>(null);
  const longPressTimeoutRef = useRef<number | null>(null);

  const SWIPE_THRESHOLD = 50 - (config.sensitivity * 0.3); // Higher sensitivity = lower threshold
  const LONG_PRESS_DURATION = 500;
  const DOUBLE_TAP_DELAY = 300;

  const handleTouchStart = (e: TouchEvent) => {
    if (!config.enabled) return;

    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };

    // Long press detection
    longPressTimeoutRef.current = window.setTimeout(() => {
      if (touchStartRef.current) {
        emitGesture('long-press');
      }
    }, LONG_PRESS_DURATION);
  };

  const handleTouchMove = (e: TouchEvent) => {
    // Clear long press if user moves
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (!config.enabled || !touchStartRef.current) return;

    // Clear long press timeout
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    // Swipe detection
    if (absDeltaX > SWIPE_THRESHOLD || absDeltaY > SWIPE_THRESHOLD) {
      if (absDeltaX > absDeltaY) {
        // Horizontal swipe
        emitGesture(deltaX > 0 ? 'swipe-right' : 'swipe-left');
      } else {
        // Vertical swipe
        emitGesture(deltaY > 0 ? 'swipe-down' : 'swipe-up');
      }
    } else {
      // Tap detection
      tapCountRef.current++;

      if (tapCountRef.current === 1) {
        tapTimeoutRef.current = window.setTimeout(() => {
          if (tapCountRef.current === 1) {
            emitGesture('tap');
          }
          tapCountRef.current = 0;
        }, DOUBLE_TAP_DELAY);
      } else if (tapCountRef.current === 2) {
        if (tapTimeoutRef.current) {
          clearTimeout(tapTimeoutRef.current);
        }
        emitGesture('double-tap');
        tapCountRef.current = 0;
      }
    }

    touchStartRef.current = null;
  };

  const emitGesture = (type: GestureEvent['type']) => {
    const gesture: GestureEvent = { type, timestamp: Date.now() };
    setLastGesture(gesture);
    config.onGesture?.(gesture);
  };

  useEffect(() => {
    return () => {
      if (tapTimeoutRef.current) clearTimeout(tapTimeoutRef.current);
      if (longPressTimeoutRef.current) clearTimeout(longPressTimeoutRef.current);
    };
  }, []);

  return {
    lastGesture,
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
  };
}
