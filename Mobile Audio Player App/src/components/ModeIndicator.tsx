import { ControlMode } from '../types';
import { Hand, MousePointer, Circle, Ban } from 'lucide-react';

interface ModeIndicatorProps {
  mode: ControlMode;
  className?: string;
}

export function ModeIndicator({ mode, className = '' }: ModeIndicatorProps) {
  const icons = {
    touch: MousePointer,
    gestures: Hand,
    both: Circle,
    disabled: Ban,
  };

  const labels = {
    touch: 'Touch',
    gestures: 'Gestures',
    both: 'Both',
    disabled: 'Disabled',
  };

  const Icon = icons[mode];

  return (
    <div className={`flex items-center gap-2 text-xs text-zinc-400 ${className}`}>
      <Icon size={14} />
      <span>{labels[mode]}</span>
    </div>
  );
}
