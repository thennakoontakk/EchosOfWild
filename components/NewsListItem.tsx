import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, ROUNDING, SIZES } from '../constants/theme';

interface NewsListItemProps {
  headline: string;
  date: string;
  readTime: string;
  thumbnail: string;
  onPress?: () => void;
}

export function NewsListItem({ headline, date, readTime, thumbnail, onPress }: NewsListItemProps) {
  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.8} onPress={onPress}>
      <Image source={{ uri: thumbnail }} style={styles.thumbnail} />
      <View style={styles.content}>
        <Text style={styles.headline} numberOfLines={2}>{headline}</Text>
        <Text style={styles.meta}>{date}  •  {readTime}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    padding: 12,
    borderRadius: ROUNDING.medium,
    marginBottom: 12,
    marginHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: ROUNDING.small,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  headline: {
    fontFamily: FONTS.serif,
    fontSize: SIZES.medium,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  meta: {
    fontFamily: FONTS.sans,
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
  },
});
