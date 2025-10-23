// components/ControlButton.tsx
import React from 'react';
import { TouchableOpacity, StyleSheet, StyleProp, ViewStyle, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type SizeKey = 'sm' | 'default' | 'lg';
type VariantKey = 'default' | 'ghost' | 'outline' | 'primary';

interface ControlButtonProps {
  // allow passing Ionicons name as string; that's simplest for RN
  icon?: keyof typeof Ionicons.glyphMap | React.ReactElement | React.ComponentType<any>;
  onClick?: () => void;
  disabled?: boolean;
  size?: SizeKey;
  variant?: VariantKey;
  label?: string;
  style?: StyleProp<ViewStyle>;
}

export function ControlButton({
  icon,
  onClick,
  disabled = false,
  size = 'default',
  variant = 'ghost',
  label,
  style,
}: ControlButtonProps) {
  const sizeMap = {
    sm: { w: 32, h: 32, icon: 16 },
    default: { w: 40, h: 40, icon: 20 },
    lg: { w: 56, h: 56, icon: 28 },
  }[size];

  const variantStyles: Record<VariantKey, any> = {
    default: { backgroundColor: '#3b82f6', borderWidth: 0 },
    ghost: { backgroundColor: 'transparent', borderWidth: 0 },
    outline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#3b82f6' },
    primary: { backgroundColor: '#2563eb', borderWidth: 0 },
  };

  const combinedStyle = StyleSheet.flatten([
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
  ]) as any;

  const renderIcon = () => {
    if (!icon) return null;
    if (React.isValidElement(icon)) return icon;
    if (typeof icon === 'function') {
      const IconComp = icon as React.ComponentType<any>;
      return <IconComp size={sizeMap.icon} />;
    }
    // string case
    return <Ionicons name={icon as any} size={sizeMap.icon} color={variant === 'default' || variant === 'primary' ? '#fff' : '#3b82f6'} />;
  };

  return (
    <TouchableOpacity onPress={onClick} disabled={disabled} style={combinedStyle} accessibilityLabel={label}>
      {renderIcon()}
      {/* optionally show label for accessibility or debug */}
      {label ? <Text style={{ position: 'absolute', opacity: 0 }}>{label}</Text> : null}
    </TouchableOpacity>
  );
}
