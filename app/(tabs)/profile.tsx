import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert, Linking } from 'react-native';
import { COLORS, FONTS, ROUNDING, SIZES } from '../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../../context/AppContext';
import { Camera, Award, Eye, Heart, ChevronRight } from 'lucide-react-native';

type IconComponent = React.ComponentType<{ color?: string; size?: number }>;

const iconMap: Record<string, IconComponent> = {
  camera: Camera,
  award: Award,
  eye: Eye,
};

interface SettingItem {
  label: string;
  onPress: () => void;
}

const SETTINGS: SettingItem[] = [
  {
    label: 'Notifications',
    onPress: () => Alert.alert('Notifications', 'Notification preferences coming soon.'),
  },
  {
    label: 'Language',
    onPress: () => Alert.alert('Language', 'English (US)\n\nMore languages coming soon.'),
  },
  {
    label: 'About',
    onPress: () =>
      Alert.alert(
        'About',
        'Echoes of the Wild\nVersion 1.0.0\n\nA Sri Lankan wildlife conservation experience.',
      ),
  },
  {
    label: 'Help & Support',
    onPress: () =>
      Linking.openURL('https://www.dwc.gov.lk/en/').catch(() =>
        Alert.alert('Error', 'Could not open the support page.'),
      ),
  },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { discoveredSpecies, quizzesCompleted, arScans, achievements } = useApp();

  return (
    <ScrollView
      style={[styles.container, { paddingTop: Math.max(insets.top, 20) }]}
      bounces={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Avatar / Name */}
      <View style={styles.header}>
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
          }}
          style={styles.avatar}
        />
        <Text style={styles.name}>Wildlife Explorer</Text>
        <View style={styles.statusPill}>
          <Text style={styles.statusText}>MUSEUM VISITOR</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{discoveredSpecies.length}</Text>
          <Text style={styles.statLabel}>Discovered</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{quizzesCompleted}</Text>
          <Text style={styles.statLabel}>Quizzes</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{arScans}</Text>
          <Text style={styles.statLabel}>AR Scans</Text>
        </View>
      </View>

      {/* Achievements */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Achievements</Text>
        <View style={styles.achievementsGrid}>
          {achievements.map(ach => {
            const Icon = iconMap[ach.icon];
            const isUnlocked = ach.unlocked;
            return (
              <View
                key={ach.id}
                style={[styles.badgeCard, !isUnlocked && styles.badgeCardLocked]}
              >
                <View style={[styles.badgeIconBg, isUnlocked && styles.badgeIconBgUnlocked]}>
                  {Icon && (
                    <Icon
                      color={isUnlocked ? COLORS.status.vulnerable : COLORS.textSecondary}
                      size={24}
                    />
                  )}
                </View>
                <Text style={[styles.badgeLabel, !isUnlocked && styles.badgeLabelLocked]}>
                  {ach.label}
                </Text>
                {!isUnlocked && <Text style={styles.lockText}>🔒</Text>}
              </View>
            );
          })}
        </View>
      </View>

      {/* Conservation Impact */}
      <View style={styles.section}>
        <View style={styles.impactCard}>
          <View style={styles.impactIconWrapper}>
            <Heart color={COLORS.white} size={24} />
          </View>
          <View style={styles.impactContent}>
            <Text style={styles.impactTitle}>Conservation Impact</Text>
            <Text style={styles.impactText}>
              Your activity has unlocked $25 in donations to Sri Lanka's Wild Reserve Trust.
            </Text>
          </View>
        </View>
      </View>

      {/* Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={styles.settingsList}>
          {SETTINGS.map((setting, idx) => (
            <TouchableOpacity
              key={setting.label}
              style={[
                styles.settingRow,
                idx === SETTINGS.length - 1 && styles.settingRowLast,
              ]}
              activeOpacity={0.7}
              onPress={setting.onPress}
            >
              <Text style={styles.settingLabel}>{setting.label}</Text>
              <ChevronRight color={COLORS.textSecondary} size={20} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: COLORS.white,
    marginBottom: 16,
  },
  name: {
    fontFamily: FONTS.serif,
    fontSize: SIZES.large,
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  statusPill: {
    backgroundColor: COLORS.status.vulnerable + '20',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: ROUNDING.pill,
    borderWidth: 1,
    borderColor: COLORS.status.vulnerable,
  },
  statusText: {
    fontFamily: FONTS.sansBold,
    fontSize: 10,
    color: COLORS.status.vulnerable,
    letterSpacing: 1,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    borderRadius: ROUNDING.large,
    paddingVertical: 20,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: FONTS.serif,
    fontSize: SIZES.xlarge,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: FONTS.sansMedium,
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.border,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontFamily: FONTS.serif,
    fontSize: SIZES.large,
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  achievementsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  badgeCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    padding: 16,
    borderRadius: ROUNDING.medium,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  badgeCardLocked: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    shadowOpacity: 0,
    elevation: 0,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  badgeIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeIconBgUnlocked: {
    backgroundColor: COLORS.status.vulnerable + '20',
  },
  badgeLabel: {
    fontFamily: FONTS.sansMedium,
    fontSize: 10,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  badgeLabelLocked: {
    color: COLORS.textSecondary,
  },
  lockText: {
    fontSize: 10,
    marginTop: 4,
  },
  impactCard: {
    backgroundColor: COLORS.status.leastConcern,
    borderRadius: ROUNDING.large,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  impactIconWrapper: {
    marginRight: 16,
  },
  impactContent: {
    flex: 1,
  },
  impactTitle: {
    fontFamily: FONTS.sansBold,
    fontSize: SIZES.medium,
    color: COLORS.white,
    marginBottom: 4,
  },
  impactText: {
    fontFamily: FONTS.sans,
    fontSize: SIZES.small,
    color: COLORS.white,
    opacity: 0.9,
    lineHeight: 18,
  },
  settingsList: {
    backgroundColor: COLORS.white,
    borderRadius: ROUNDING.large,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingRowLast: {
    borderBottomWidth: 0,
  },
  settingLabel: {
    fontFamily: FONTS.sansMedium,
    fontSize: SIZES.medium,
    color: COLORS.textPrimary,
  },
});
