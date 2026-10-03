import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, ROUNDING, SIZES } from '../constants/theme';
import { StatusBadge, ConservationStatus } from './ui/StatusBadge';
import { ArrowRight } from 'lucide-react-native';

interface SpeciesCardProps {
  name: string;
  scientificName: string;
  status: string;
  blurb: string;
  imageUrl: string;
  onPress: () => void;
}

export function SpeciesCard({ name, scientificName, status, blurb, imageUrl, onPress }: SpeciesCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <View style={styles.content}>
        <StatusBadge status={status as ConservationStatus} />
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.scientificName}>{scientificName}</Text>
        <Text style={styles.blurb} numberOfLines={2}>{blurb}</Text>
        <View style={styles.learnMore}>
          <Text style={styles.learnMoreText}>Learn More</Text>
          <ArrowRight color={COLORS.primary} size={16} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: ROUNDING.large,
    width: 280,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 140,
  },
  content: {
    padding: 16,
  },
  name: {
    fontFamily: FONTS.serif,
    fontSize: SIZES.medium + 4,
    color: COLORS.textPrimary,
    marginTop: 8,
  },
  scientificName: {
    fontFamily: FONTS.sansMedium,
    fontStyle: 'italic',
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  blurb: {
    fontFamily: FONTS.sans,
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: 16,
  },
  learnMore: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  learnMoreText: {
    fontFamily: FONTS.sansBold,
    fontSize: SIZES.small,
    color: COLORS.primary,
    marginRight: 4,
  },
});
