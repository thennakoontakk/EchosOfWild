import React, { Suspense, useState, useEffect, useRef, Component, ReactNode } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { Canvas } from '@react-three/fiber/native';
import { useGLTF, OrbitControls } from '@react-three/drei/native';
import { Asset } from 'expo-asset';
import { COLORS, FONTS } from '../constants/theme';

import * as THREE from 'three';

// ── Error boundary — catches GLTF parse errors and WebGL context failures ────
interface EBState { hasError: boolean; error: string | null }

class ModelErrorBoundary extends Component<{ children: ReactNode; isAR?: boolean }, EBState> {
  constructor(props: { children: ReactNode; isAR?: boolean }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(err: Error): EBState {
    return { hasError: true, error: err?.message ?? 'Unknown error' };
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={[styles.container, this.props.isAR && styles.transparentContainer, styles.center]}>
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>⚠ Could not load model</Text>
            <Text style={styles.errorDetail}>{this.state.error}</Text>
          </View>
        </View>
      );
    }
    return this.props.children;
  }
}

// ── Inner model mesh (suspends while GLTF loads) ──────────────────────────────
function ModelMesh({
  url,
  scaleMultiplier = 1,
  rotationY = 0,
}: {
  url: string;
  scaleMultiplier?: number;
  rotationY?: number;
}) {
  const { scene } = useGLTF(url);
  const baseScaleRef = useRef(1);

  useEffect(() => {
    if (scene) {
      const box = new THREE.Box3().setFromObject(scene);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());

      // Center the model pivot
      scene.position.x = -center.x;
      scene.position.y = -center.y;
      scene.position.z = -center.z;

      // Normalize size so all animal models appear nicely framed
      const maxDim = Math.max(size.x, size.y, size.z);
      if (maxDim > 0) {
        const targetSize = 2.2;
        baseScaleRef.current = targetSize / maxDim;
        const initialScale = baseScaleRef.current * scaleMultiplier;
        scene.scale.set(initialScale, initialScale, initialScale);
      }
    }
  }, [scene]);

  useEffect(() => {
    if (scene && baseScaleRef.current > 0) {
      const s = baseScaleRef.current * scaleMultiplier;
      scene.scale.set(s, s, s);
    }
  }, [scene, scaleMultiplier]);

  return (
    <group rotation={[0, rotationY, 0]}>
      <primitive object={scene} dispose={null} />
    </group>
  );
}

// ── Public component ──────────────────────────────────────────────────────────
export interface Model3DViewerProps {
  /** Pass require()'d module ID — resolved at build time by Metro */
  modelRequire: number;
  /** When true, renders transparent canvas for AR overlay */
  isAR?: boolean;
  /** Scale multiplier (1.0 = normal, 1.5 = 150%, 0.5 = 50%, etc.) */
  scaleMultiplier?: number;
  /** Rotation around Y axis in radians */
  rotationY?: number;
  /** Whether OrbitControls auto-rotates */
  autoRotate?: boolean;
}

export function Model3DViewer({
  modelRequire,
  isAR = false,
  scaleMultiplier = 1,
  rotationY = 0,
  autoRotate = false,
}: Model3DViewerProps) {
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    setModelUrl(null);
    setError(null);

    Asset.loadAsync(modelRequire)
      .then(([asset]) => {
        if (isMounted.current) setModelUrl(asset.localUri || asset.uri);
      })
      .catch(e => {
        if (isMounted.current) setError(e?.message ?? 'Failed to load model');
      });

    return () => {
      isMounted.current = false;
    };
  }, [modelRequire]);

  if (error) {
    return (
      <View style={[styles.container, isAR && styles.transparentContainer, styles.center]}>
        <View style={styles.errorCard}>
          <Text style={styles.errorText}>⚠ Could not load model</Text>
          <Text style={styles.errorDetail}>{error}</Text>
        </View>
      </View>
    );
  }

  if (!modelUrl) {
    return (
      <View style={[styles.container, isAR && styles.transparentContainer, styles.center]}>
        <View style={styles.loadingCard}>
          <ActivityIndicator size="large" color={COLORS.status.vulnerable} />
          <Text style={styles.loadingText}>Loading 3D Model…</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, isAR && styles.transparentContainer]}>
      {/* ErrorBoundary outside Canvas catches WebGL and GLTF runtime errors */}
      <ModelErrorBoundary isAR={isAR}>
        <Canvas
          gl={{ alpha: true, antialias: true }}
          camera={{ position: [0, 1.2, 4], fov: 45 }}
          onCreated={({ gl }) => {
            if (isAR) {
              gl.setClearColor(0x000000, 0);
            }
          }}
        >
          {!isAR && <color attach="background" args={['#1a1a1a']} />}

          {/* Lights */}
          <ambientLight intensity={isAR ? 1.1 : 0.7} />
          <directionalLight position={[5, 10, 7.5]} intensity={isAR ? 1.4 : 1.2} castShadow />
          <directionalLight position={[-5, -5, -5]} intensity={0.4} />
          <pointLight position={[0, 5, 0]} intensity={0.5} />

          {/* null fallback: loading UI is already shown before modelUrl is set */}
          <Suspense fallback={null}>
            <ModelMesh
              url={modelUrl}
              scaleMultiplier={scaleMultiplier}
              rotationY={rotationY}
            />
          </Suspense>

          <OrbitControls
            enablePan
            enableZoom
            enableRotate
            autoRotate={autoRotate}
            autoRotateSpeed={0.8}
            minDistance={0.5}
            maxDistance={15}
          />
        </Canvas>
      </ModelErrorBoundary>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  transparentContainer: {
    backgroundColor: 'transparent',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingCard: {
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 24,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  loadingText: {
    color: 'rgba(255,255,255,0.9)',
    fontFamily: FONTS.sansMedium,
    fontSize: 14,
    marginTop: 12,
  },
  errorCard: {
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingHorizontal: 24,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginHorizontal: 20,
  },
  errorText: {
    color: '#ff6b6b',
    fontFamily: FONTS.sansBold,
    fontSize: 16,
    marginBottom: 8,
  },
  errorDetail: {
    color: 'rgba(255,255,255,0.7)',
    fontFamily: FONTS.sans,
    fontSize: 12,
    textAlign: 'center',
  },
});
