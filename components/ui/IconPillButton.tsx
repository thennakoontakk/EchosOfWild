import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { COLORS, FONTS, ROUNDING, SIZES } from '../../constants/theme';

type IconComponent = React.ComponentType<{ color?: string; size?: number }>;

interface IconPillButtonProps {
  label: string;
  icon: IconComponent;
  onPress: () => void;
}

export function IconPillButton({ label, icon: Icon, onPress }: IconPillButtonProps) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.iconWrapper}>
        <Icon color={COLORS.white} size={15} />
      </View>
      <Text style={styles.label} numberOfLines={1}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: ROUNDING.pill,
  },
  iconWrapper: {
    marginRight: 6,
  },
  label: {
    color: COLORS.white,
    fontFamily: FONTS.sansMedium,
    fontSize: 12,
  },
});
