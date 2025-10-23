import { ReactNode } from 'react';
import { useGestures } from '../hooks/useGestures';
import { GestureEvent, ControlMode } from '../types';

interface GestureOverlayProps {
  children: ReactNode;
  mode: ControlMode;
  sensitivity: number;
  onGesture?: (gesture: GestureEvent) => void;
  className?: string;
}

export function GestureOverlay({
  children,
  mode,
  sensitivity,
  onGesture,
  className = '',
}: GestureOverlayProps) {
  const gesturesEnabled = mode === 'gestures' || mode === 'both';

  const { handlers } = useGestures({
    enabled: gesturesEnabled,
    sensitivity,
    onGesture,
  });

  if (!gesturesEnabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      className={className}
      onTouchStart={handlers.onTouchStart}
      onTouchMove={handlers.onTouchMove}
      onTouchEnd={handlers.onTouchEnd}
    >
      {children}
    </div>
  );
}
