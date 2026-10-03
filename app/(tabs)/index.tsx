import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, ImageBackground,
  TextInput, TouchableOpacity, Alert, Linking,
} from 'react-native';
import { COLORS, FONTS, ROUNDING, SIZES } from '../../constants/theme';
import { Bell, Search, Scan, Compass, Box } from 'lucide-react-native';
import { IconPillButton } from '../../components/ui/IconPillButton';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { SpeciesCard } from '../../components/SpeciesCard';
import { NewsListItem } from '../../components/NewsListItem';
import speciesData from '../../data/species.json';
import newsData from '../../data/news.json';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchText, setSearchText] = useState('');

  const isSearching = searchText.trim().length > 0;

  // Filter species by search query, otherwise show the first 3 featured entries
  const displayedSpecies = useMemo(() => {
    if (!isSearching) return speciesData.slice(0, 3);
    const q = searchText.trim().toLowerCase();
    return speciesData.filter(
      s =>
        s.commonName.toLowerCase().includes(q) ||
        s.scientificName.toLowerCase().includes(q) ||
        s.mainHabitat.toLowerCase().includes(q),
    );
  }, [searchText, isSearching]);

  return (
    <ScrollView style={styles.container} bounces={false}>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <View style={styles.heroContainer}>
        <ImageBackground
          source={{ uri: speciesData[0].imageUrls.hero }}
          style={styles.heroImage}
        >
          <View style={[styles.heroOverlay, { paddingTop: Math.max(insets.top, 20) }]}>
            <View style={styles.heroHeader}>
              <Text style={styles.appTitle}>ECHOES OF THE WILD</Text>
              <TouchableOpacity
                onPress={() => Alert.alert('Notifications', 'No new notifications.')}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Bell color={COLORS.white} size={24} />
              </TouchableOpacity>
            </View>
            <View style={styles.heroContent}>
              <Text style={styles.heroHeadline}>Discover Sri Lanka's Hidden Wildlife</Text>
            </View>
          </View>
        </ImageBackground>

        {/* Search bar overlaps bottom of hero */}
        <View style={styles.searchContainer}>
          {/* Pass color via prop — Lucide ignores style.color */}
          <Search color={COLORS.white} size={20} style={styles.searchIconSpacing} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search rare, lost or threatened species..."
            placeholderTextColor="rgba(255,255,255,0.6)"
            value={searchText}
            onChangeText={setSearchText}
            returnKeyType="search"
          />
        </View>
      </View>

      {/* ── Quick actions ─────────────────────────────────────────────────── */}
      <View style={styles.actionsRow}>
        <IconPillButton label="Scan QR" icon={Scan} onPress={() => router.push('/scanner')} />
        <IconPillButton label="Explore" icon={Compass} onPress={() => router.navigate('/(tabs)/species')} />
        <IconPillButton label="Interactive AR" icon={Box} onPress={() => router.push('/viewer/leopard')} />
      </View>

      {/* ── Featured / Search results ─────────────────────────────────────── */}
      <View style={styles.section}>
        <SectionHeader
          title={isSearching ? 'Search Results' : 'Featured Species'}
          actionLabel={isSearching ? undefined : 'View All'}
          onActionPress={() => router.navigate('/(tabs)/species')}
        />
        {displayedSpecies.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No species match "{searchText}"</Text>
          </View>
        ) : (
          /* Plain horizontal ScrollView instead of FlatList to avoid the
             "VirtualizedLists should never be nested" warning. The data set
             is small (≤ total species) so virtualization isn't needed here. */
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselContent}
          >
            {displayedSpecies.map(item => (
              <SpeciesCard
                key={item.id}
                name={item.commonName}
                scientificName={item.scientificName}
                imageUrl={item.imageUrls.hero}
                status={item.conservationStatus}
                blurb={item.shortBlurb}
                onPress={() => router.push(`/species/${item.id}`)}
              />
            ))}
          </ScrollView>
        )}
      </View>

      {/* ── Conservation news ─────────────────────────────────────────────── */}
      <View style={[styles.section, { paddingBottom: 40 }]}>
        <SectionHeader title="Conservation News" />
        {newsData.map(item => (
          <NewsListItem
            key={item.id}
            headline={item.headline}
            date={item.date}
            readTime={item.readTime}
            thumbnail={item.thumbnail}
            onPress={() => Linking.openURL(item.url).catch(() => {})}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  heroContainer: {
    marginBottom: 24,
  },
  heroImage: {
    width: '100%',
    height: 400,
  },
  heroOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appTitle: {
    color: COLORS.primary,
    fontFamily: FONTS.sansBold,
    fontSize: 11,
    letterSpacing: 1.2,
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    overflow: 'hidden',
  },
  heroContent: {
    marginBottom: 20,
  },
  heroHeadline: {
    color: COLORS.white,
    fontFamily: FONTS.serif,
    fontSize: SIZES.xxlarge,
    lineHeight: 48,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: 20,
    marginTop: -25,
    borderRadius: ROUNDING.pill,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  searchIconSpacing: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: COLORS.white,
    fontFamily: FONTS.sans,
    fontSize: SIZES.medium,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  section: {
    marginBottom: 32,
  },
  carouselContent: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  emptyState: {
    paddingHorizontal: 20,
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: FONTS.sans,
    fontSize: SIZES.medium,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
