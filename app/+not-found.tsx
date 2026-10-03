import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, FONTS, ROUNDING, SIZES } from '../constants/theme';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Page Not Found', headerShown: false }} />
      <View style={styles.container}>
        <Text style={styles.emoji}>🌿</Text>
        <Text style={styles.title}>Species or Screen Not Found</Text>
        <Text style={styles.subtitle}>
          The page you are looking for does not exist or has wandered off into the wild.
        </Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>← Return to Home</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emoji: {
    fontSize: 56,
    marginBottom: 16,
  },
  title: {
    fontFamily: FONTS.serif,
    fontSize: SIZES.large,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: FONTS.sans,
    fontSize: SIZES.medium,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  link: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: ROUNDING.pill,
  },
  linkText: {
    fontFamily: FONTS.sansBold,
    fontSize: SIZES.medium,
    color: COLORS.white,
  },
});
