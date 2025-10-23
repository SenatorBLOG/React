import { LucideIcon } from 'lucide-react';
import { Button } from './ui/button';

interface ControlButtonProps {
  icon: LucideIcon;
  onClick?: () => void;
  disabled?: boolean;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'ghost' | 'outline';
  className?: string;
  label?: string;
}

export function ControlButton({
  icon: Icon,
  onClick,
  disabled = false,
  size = 'default',
  variant = 'ghost',
  className = '',
  label,
}: ControlButtonProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    default: 'w-10 h-10',
    lg: 'w-14 h-14',
  };

  const iconSizes = {
    sm: 16,
    default: 20,
    lg: 28,
  };

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      variant={variant}
      size="icon"
      className={`${sizeClasses[size]} ${className}`}
      aria-label={label}
    >
      <Icon size={iconSizes[size]} />
    </Button>
  );
}
