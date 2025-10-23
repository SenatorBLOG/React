import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Using Ionicons from @expo/vector-icons

interface ControlButtonProps {
  icon: keyof typeof Ionicons.glyphMap; // Use Ionicons icon names
  onClick?: () => void;
  disabled?: boolean;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'ghost' | 'outline';
  label?: string;
}

export function ControlButton({
  icon,
  onClick,
  disabled = false,
  size = 'default',
  variant = 'ghost',
  label,
}: ControlButtonProps) {
  const sizeStyles = {
    sm: { width: 32, height: 32, iconSize: 16 },
    default: { width: 40, height: 40, iconSize: 20 },
    lg: { width: 56, height: 56, iconSize: 28 },
  };

  const variantStyles = {
    default: { backgroundColor: '#3b82f6', borderWidth: 0 },
    ghost: { backgroundColor: 'transparent', borderWidth: 0 },
    outline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#3b82f6' },
  };

  const styles = StyleSheet.create({
    button: {
      width: sizeStyles[size].width,
      height: sizeStyles[size].height,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
      ...variantStyles[variant],
      opacity: disabled ? 0.5 : 1,
    },
  });

  return (
    <TouchableOpacity
      onPress={onClick}
      disabled={disabled}
      style={styles.button}
      accessibilityLabel={label}
    >
      <Ionicons name={icon} size={sizeStyles[size].iconSize} color={variant === 'default' ? '#fff' : '#3b82f6'} />
    </TouchableOpacity>
  );
}