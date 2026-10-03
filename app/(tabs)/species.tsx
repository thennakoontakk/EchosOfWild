import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, FlatList,
  TouchableOpacity, Image, Alert,
} from 'react-native';
import { COLORS, FONTS, ROUNDING, SIZES } from '../../constants/theme';
import { MoreHorizontal, ArrowRight } from 'lucide-react-native';
import speciesData from '../../data/species.json';
import { StatusBadge, ConservationStatus } from '../../components/ui/StatusBadge';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Derive categories dynamically from data — no stale hardcoded list
const CATEGORIES = ['All', ...new Set(speciesData.map(s => s.category))];

export default function SpeciesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredSpecies = activeCategory === 'All'
    ? speciesData
    : speciesData.filter(s => s.category === activeCategory);

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 20) }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Explore Species</Text>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() =>
            Alert.alert('Sort & Filter', 'Advanced sorting and filtering coming soon.')
          }
        >
          <MoreHorizontal color={COLORS.textPrimary} size={24} />
        </TouchableOpacity>
      </View>

      <View style={styles.filtersContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersList}
        >
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.filterChip, activeCategory === cat && styles.filterChipActive]}
              onPress={() => setActiveCategory(cat)}
            >
              <Text style={[styles.filterText, activeCategory === cat && styles.filterTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {filteredSpecies.length === 0 ? (
        /* Empty state — shown when a category has no species yet */
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No species found</Text>
          <Text style={styles.emptySubtitle}>
            No {activeCategory.toLowerCase()} have been added to the database yet.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredSpecies}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.listItem}
              onPress={() => router.push(`/species/${item.id}`)}
              activeOpacity={0.8}
            >
              <Image source={{ uri: item.imageUrls.hero }} style={styles.itemImage} />
              <View style={styles.itemContent}>
                <View style={styles.itemHeader}>
                  <StatusBadge status={item.conservationStatus as ConservationStatus} />
                  <ArrowRight color={COLORS.primary} size={16} />
                </View>
                <Text style={styles.itemName}>{item.commonName}</Text>
                <Text style={styles.itemScientific}>{item.scientificName}</Text>
                <Text style={styles.itemHabitat}>Habitat: {item.mainHabitat}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontFamily: FONTS.serif,
    fontSize: SIZES.xlarge,
    color: COLORS.textPrimary,
  },
  menuButton: {
    padding: 8,
    backgroundColor: COLORS.white,
    borderRadius: ROUNDING.pill,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  filtersContainer: {
    marginBottom: 16,
  },
  filtersList: {
    paddingHorizontal: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.white,
    borderRadius: ROUNDING.pill,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterText: {
    fontFamily: FONTS.sansMedium,
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
  },
  filterTextActive: {
    color: COLORS.white,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  listItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: ROUNDING.medium,
    marginBottom: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: ROUNDING.small,
    marginRight: 16,
  },
  itemContent: {
    flex: 1,
    justifyContent: 'center',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  itemName: {
    fontFamily: FONTS.serif,
    fontSize: SIZES.medium,
    color: COLORS.textPrimary,
  },
  itemScientific: {
    fontFamily: FONTS.sans,
    fontStyle: 'italic',
    fontSize: 10,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  itemHabitat: {
    fontFamily: FONTS.sans,
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontFamily: FONTS.serif,
    fontSize: SIZES.large,
    color: COLORS.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontFamily: FONTS.sans,
    fontSize: SIZES.medium,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
