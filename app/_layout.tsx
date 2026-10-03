import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef, useState } from 'react';
import 'react-native-reanimated';
import { AppProvider } from '../context/AppContext';
import { PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { Inter_400Regular, Inter_500Medium, Inter_700Bold } from '@expo-google-fonts/inter';

export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    PlayfairDisplay_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
  });

  const [timedOut, setTimedOut] = useState(false);
  const didHide = useRef(false);

  const hideSplash = () => {
    if (!didHide.current) {
      didHide.current = true;
      SplashScreen.hideAsync().catch(() => {});
    }
  };

  // ── Timeout safety net ─────────────────────────────────────────────────────
  // If useFonts never resolves (no 'loaded', no 'error'), force-hide after 4s
  // so the app never gets permanently stuck on the splash screen.
  useEffect(() => {
    const timer = setTimeout(() => {
      console.warn('[Fonts] Timeout — forcing splash hide with system fonts');
      setTimedOut(true);
      hideSplash();
    }, 4000);
    return () => clearTimeout(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Font error ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (error) {
      console.warn('[Fonts] Load error, using system fallback:', error.message);
      hideSplash();
    }
  }, [error]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Fonts ready ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (loaded) {
      hideSplash();
    }
  }, [loaded]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!loaded && !error && !timedOut) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <AppProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="species/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="viewer/[id]" options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen name="scanner/index" options={{ headerShown: false }} />
      </Stack>
    </AppProvider>
  );
}
