import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, ROUNDING } from '../../constants/theme';

export type ConservationStatus = 'Least Concern' | 'Vulnerable' | 'Endangered' | 'Critically Endangered';

interface StatusBadgeProps {
  status: ConservationStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'Least Concern': return COLORS.status.leastConcern;
      case 'Vulnerable': return COLORS.status.vulnerable;
      case 'Endangered': return COLORS.status.endangered;
      case 'Critically Endangered': return COLORS.status.criticallyEndangered;
      default: return COLORS.textSecondary;
    }
  };

  const backgroundColor = getStatusColor();

  return (
    <View style={[styles.badge, { backgroundColor: backgroundColor + '20', borderColor: backgroundColor }]}>
      <Text style={[styles.text, { color: backgroundColor }]} numberOfLines={1}>
        {status.toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: ROUNDING.small,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    fontFamily: FONTS.sansBold,
    fontSize: 9,
    letterSpacing: 0.5,
  },
});
