// components/ControlButton.tsx
import React from 'react';
import { TouchableOpacity, StyleSheet, StyleProp, ViewStyle, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type SizeKey = 'sm' | 'default' | 'lg';
type VariantKey = 'default' | 'ghost' | 'outline' | 'primary';

interface ControlButtonProps {
  icon?: keyof typeof Ionicons.glyphMap | React.ReactElement | React.ComponentType<{ size: number; color: string }>;
  onClick?: () => void;
  disabled?: boolean;
  size?: SizeKey;
  variant?: VariantKey;
  label?: string;
  color?: string; // Добавил для custom цвета иконки
  style?: StyleProp<ViewStyle>;
}

export function ControlButton({
  icon,
  onClick,
  disabled = false,
  size = 'default',
  variant = 'ghost',
  label = 'Button', // Default label для accessibility
  color,
  style,
}: ControlButtonProps) {
  const sizeMap = {
    sm: { w: 32, h: 32, icon: 16 },
    default: { w: 40, h: 40, icon: 20 },
    lg: { w: 56, h: 56, icon: 28 },
  }[size];

  const variantStyles: Record<VariantKey, ViewStyle> = {
    default: { backgroundColor: '#3b82f6', borderWidth: 0 },
    ghost: { backgroundColor: 'transparent', borderWidth: 0 },
    outline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#3b82f6' },
    primary: { backgroundColor: '#2563eb', borderWidth: 0 },
  };

  const combinedStyle: ViewStyle = StyleSheet.flatten([
    {
      width: sizeMap.w,
      height: sizeMap.h,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
      opacity: disabled ? 0.5 : 1,
    },
    variantStyles[variant],
    style,
  ]);

  const iconColor = color || (variant === 'default' || variant === 'primary' ? '#fff' : '#3b82f6');

  const renderIcon = () => {
    if (!icon) return null;
    if (React.isValidElement(icon)) return icon;
    if (typeof icon === 'function') {
      const IconComp = icon;
      return <IconComp size={sizeMap.icon} color={iconColor} />;
    }
    // string case for Ionicons — narrow the union to string before using as name
    if (typeof icon === 'string') {
      return <Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={sizeMap.icon} color={iconColor} />;
    }
    return null;
  };

  return (
    <TouchableOpacity
      onPress={onClick}
      disabled={disabled}
      style={combinedStyle}
      accessibilityLabel={label}
      accessibilityRole="button"
    >
      {renderIcon()}
    </TouchableOpacity>
  );
}