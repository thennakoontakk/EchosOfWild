import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, View } from 'react-native';
import { COLORS, FONTS, ROUNDING, SIZES } from '../../constants/theme';

// Use a looser type that matches what lucide-react-native actually exports
type IconComponent = React.ComponentType<{ color?: string; size?: number }>;

interface PrimaryButtonProps extends TouchableOpacityProps {
  label: string;
  icon?: IconComponent;
}

export function PrimaryButton({ label, icon: Icon, style, ...props }: PrimaryButtonProps) {
  return (
    <TouchableOpacity style={[styles.button, style]} activeOpacity={0.8} {...props}>
      {Icon && (
        <View style={styles.iconWrapper}>
          <Icon color={COLORS.white} size={20} />
        </View>
      )}
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: ROUNDING.pill,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconWrapper: {
    marginRight: 8,
  },
  label: {
    color: COLORS.white,
    fontFamily: FONTS.sansMedium,
    fontSize: SIZES.medium,
  },
});
