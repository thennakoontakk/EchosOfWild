import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Linking } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { COLORS, FONTS, ROUNDING, SIZES } from '../../constants/theme';
import { ArrowLeft, Zap, ZapOff, Aperture } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../../context/AppContext';
import speciesData from '../../data/species.json';

export default function ScannerScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();
  const [flash, setFlash] = useState(false);
  const [scanned, setScanned] = useState(false);
  const { incrementScan } = useApp();
  const hasRequestedRef = useRef(false);

  // Request permission once on mount — do NOT put permission in the dep array
  // or it will loop if the user dismisses the dialog without granting.
  useEffect(() => {
    if (!hasRequestedRef.current) {
      hasRequestedRef.current = true;
      requestPermission();
    }
    return () => {
      setFlash(false);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);

    const cleanData = (data || '').trim().toLowerCase();
    const segments = cleanData.split('/');
    const candidateId = segments[segments.length - 1].replace(/\.(glb|gltf)$/i, '');

    const foundSpecies = speciesData.find(
      s =>
        s.id.toLowerCase() === cleanData ||
        s.id.toLowerCase() === candidateId ||
        s.commonName.toLowerCase() === cleanData ||
        s.commonName.toLowerCase() === candidateId ||
        s.modelUrl.toLowerCase().replace(/\.(glb|gltf)$/i, '') === candidateId ||
        cleanData.includes(s.id.toLowerCase())
    );

    if (foundSpecies) {
      incrementScan();
      router.replace({
        pathname: '/viewer/[id]',
        params: { id: foundSpecies.id, mode: 'ar' },
      });
    } else {
      Alert.alert('Not Found', "This QR code doesn't match any known species.", [
        { text: 'Try Again', onPress: () => setScanned(false) },
      ]);
    }
  };

  // Show blank screen while permission is loading
  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    // If the OS won't show the permission dialog again, direct the user to Settings
    const canAsk = permission.canAskAgain;
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.message}>Camera access is required to scan exhibits.</Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={canAsk ? requestPermission : () => Linking.openSettings()}
        >
          <Text style={styles.permissionButtonText}>
            {canAsk ? 'Grant Camera Access' : 'Open Settings'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.back()} style={styles.backLink}>
          <Text style={styles.backLinkText}>← Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        enableTorch={flash}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
      />

      <View style={styles.contentOverlay} pointerEvents="box-none">
        {/* Header */}
        <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
            <ArrowLeft color={COLORS.white} size={24} />
          </TouchableOpacity>
          <Text style={styles.title}>AR Scanner</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Scan frame overlay */}
        <View style={styles.overlay} pointerEvents="box-none">
          <View style={styles.scanFrame} pointerEvents="box-none">
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
            {scanned && (
              <View style={styles.scanningPill}>
                <Text style={styles.scanningText}>Processing…</Text>
              </View>
            )}
          </View>
          <Text style={styles.hintText}>Align exhibit or QR code within the frame</Text>
        </View>

        {/* Bottom controls */}
        <View style={[styles.bottomControls, { paddingBottom: Math.max(insets.bottom + 16, 32) }]}>
          <View style={styles.tipBanner}>
            <Text style={styles.tipText}>💡 Hold steady for best results</Text>
          </View>

          <View style={styles.controlRow}>
            <View style={styles.controlPlaceholder} />

            <TouchableOpacity
              style={styles.captureButton}
              onPress={() => setScanned(false)}
              activeOpacity={0.8}
            >
              <View style={styles.captureButtonInner}>
                <Aperture color={COLORS.white} size={32} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => setFlash(f => !f)}
              activeOpacity={0.8}
            >
              {flash ? (
                <Zap color={COLORS.status.vulnerable} size={24} />
              ) : (
                <ZapOff color={COLORS.white} size={24} />
              )}
              <Text style={styles.controlLabel}>Flash</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    gap: 16,
  },
  message: {
    fontFamily: FONTS.sansMedium,
    color: COLORS.white,
    textAlign: 'center',
    fontSize: SIZES.medium,
    marginBottom: 8,
  },
  permissionButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: ROUNDING.pill,
  },
  permissionButtonText: {
    color: COLORS.white,
    fontFamily: FONTS.sansBold,
    fontSize: SIZES.medium,
  },
  backLink: {
    marginTop: 8,
  },
  backLinkText: {
    color: 'rgba(255,255,255,0.6)',
    fontFamily: FONTS.sansMedium,
    fontSize: SIZES.medium,
  },
  contentOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
  },
  camera: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  title: {
    fontFamily: FONTS.serif,
    fontSize: SIZES.large,
    color: COLORS.white,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  scanFrame: {
    width: 240,
    height: 240,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: COLORS.status.vulnerable,
  },
  topLeft: { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4 },
  topRight: { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4 },
  bottomLeft: { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4 },
  bottomRight: { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4 },
  scanningPill: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: ROUNDING.pill,
  },
  scanningText: {
    color: COLORS.white,
    fontFamily: FONTS.sansMedium,
    fontSize: SIZES.small,
  },
  hintText: {
    color: 'rgba(255,255,255,0.85)',
    fontFamily: FONTS.sansMedium,
    fontSize: SIZES.small,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  bottomControls: {
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingTop: 20,
  },
  tipBanner: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: ROUNDING.pill,
    marginBottom: 24,
  },
  tipText: {
    color: COLORS.status.vulnerable,
    fontFamily: FONTS.sansMedium,
    fontSize: SIZES.small,
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
  },
  controlPlaceholder: {
    width: 48,
  },
  controlButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
  },
  controlLabel: {
    color: COLORS.white,
    fontFamily: FONTS.sans,
    fontSize: 10,
    marginTop: 6,
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
