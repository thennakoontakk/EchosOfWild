import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Share } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { COLORS, FONTS, ROUNDING, SIZES } from '../../constants/theme';
import speciesData from '../../data/species.json';
import { ArrowLeft, Share2, Box } from 'lucide-react-native';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../../context/AppContext';

export default function SpeciesDetailScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  // useLocalSearchParams can return string | string[] — normalise to string
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { discoverSpecies } = useApp();

  const species = speciesData.find(s => s.id === id);

  // Only mark as discovered if it is a valid existing species
  useEffect(() => {
    if (species) {
      discoverSpecies(species.id);
    }
  }, [species, discoverSpecies]);

  const handleShare = async () => {
    if (!species) return;
    try {
      await Share.share({
        title: species.commonName,
        message: `Check out the ${species.commonName} (${species.scientificName}) — ${species.shortBlurb}\n\nDiscover more on Echoes of the Wild.`,
      });
    } catch {
      // User dismissed the share sheet or share failed — ignore silently
    }
  };

  if (!species) {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.floatingBack, { top: Math.max(insets.top, 20) }]}
          onPress={() => router.back()}
        >
          <ArrowLeft color={COLORS.textPrimary} size={24} />
        </TouchableOpacity>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Species not found</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} bounces={false}>
      <View style={styles.heroContainer}>
        <Image source={{ uri: species.imageUrls.hero }} style={styles.heroImage} />
        <View style={[styles.headerControls, { top: Math.max(insets.top, 20) }]}>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
            <ArrowLeft color={COLORS.textPrimary} size={24} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={handleShare}>
            <Share2 color={COLORS.textPrimary} size={24} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.commonName}>{species.commonName}</Text>
        <Text style={styles.scientificName}>{species.scientificName}</Text>

        <View style={styles.chipsRow}>
          <View style={styles.chip}>
            <Text style={styles.chipLabel}>CONSERVATION</Text>
            <Text style={styles.chipValue}>{species.conservationStatus}</Text>
          </View>
          <View style={styles.chip}>
            <Text style={styles.chipLabel}>POPULATION</Text>
            <Text style={styles.chipValue}>{species.populationEstimate}</Text>
          </View>
          <View style={[styles.chip, { marginRight: 0 }]}>
            <Text style={styles.chipLabel}>MAIN HABITAT</Text>
            <Text style={styles.chipValue}>{species.mainHabitat}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>About the Species</Text>
        <Text style={styles.description}>{species.description}</Text>

        {species.imageUrls.gallery.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Gallery</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.gallery}>
              {species.imageUrls.gallery.map((url, i) => (
                <Image key={i} source={{ uri: url }} style={styles.galleryImage} />
              ))}
            </ScrollView>
          </>
        )}

        <PrimaryButton
          label="View in AR / 3D"
          icon={Box}
          style={styles.arButton}
          onPress={() =>
            router.push({
              pathname: '/viewer/[id]',
              params: { id: species.id, mode: 'ar' },
            })
          }
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundText: {
    fontFamily: FONTS.sans,
    color: COLORS.textSecondary,
  },
  floatingBack: {
    position: 'absolute',
    left: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroContainer: {
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: 350,
  },
  headerControls: {
    position: 'absolute',
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 24,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -32,
  },
  commonName: {
    fontFamily: FONTS.serif,
    fontSize: SIZES.xlarge,
    color: COLORS.textPrimary,
  },
  scientificName: {
    fontFamily: FONTS.sansMedium,
    fontStyle: 'italic',
    fontSize: SIZES.medium,
    color: COLORS.textSecondary,
    marginBottom: 24,
  },
  chipsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  chip: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 12,
    borderRadius: ROUNDING.medium,
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipLabel: {
    fontFamily: FONTS.sansBold,
    fontSize: 9,
    color: COLORS.status.vulnerable,
    letterSpacing: 1,
    marginBottom: 4,
    textAlign: 'center',
  },
  chipValue: {
    fontFamily: FONTS.sansBold,
    fontSize: SIZES.small,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  sectionTitle: {
    fontFamily: FONTS.serif,
    fontSize: SIZES.large,
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  description: {
    fontFamily: FONTS.sans,
    fontSize: SIZES.medium,
    lineHeight: 24,
    color: COLORS.textSecondary,
    marginBottom: 32,
  },
  gallery: {
    marginHorizontal: -24,
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  galleryImage: {
    width: 140,
    height: 140,
    borderRadius: ROUNDING.medium,
    marginRight: 12,
  },
  arButton: {
    marginBottom: 40,
  },
});
