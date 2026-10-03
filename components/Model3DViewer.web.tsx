/**
 * Web stub for Model3DViewer.
 *
 * @react-three/fiber/native uses expo-gl which is not available on web.
 * Metro resolves this file on the web platform instead of Model3DViewer.native.tsx,
 * preventing the import of WebGL / drei packages that would crash the web build.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, SIZES } from '../constants/theme';

export interface Model3DViewerProps {
  modelRequire: number;
  isAR?: boolean;
  scaleMultiplier?: number;
  rotationY?: number;
  autoRotate?: boolean;
}

export function Model3DViewer(_props: Model3DViewerProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🦁</Text>
      <Text style={styles.title}>3D Viewer</Text>
      <Text style={styles.subtitle}>
        Interactive 3D models are only available on the iOS and Android apps.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  icon: {
    fontSize: 56,
    marginBottom: 16,
  },
  title: {
    fontFamily: FONTS.serif,
    fontSize: SIZES.large,
    color: COLORS.white,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: FONTS.sans,
    fontSize: SIZES.medium,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    lineHeight: 24,
  },
});
