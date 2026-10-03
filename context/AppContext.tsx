import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Achievement {
  id: string;
  icon: string;
  label: string;
  unlocked: boolean;
}

interface AppState {
  discoveredSpecies: string[];
  quizzesCompleted: number;
  arScans: number;
  achievements: Achievement[];
  isLoading: boolean;
  discoverSpecies: (id: string) => void;
  incrementQuiz: () => void;
  incrementScan: () => void;
}

const STORAGE_KEY = '@echoes_of_wild:app_state';

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_scan', icon: 'camera', label: 'First Scan', unlocked: false },
  { id: 'quiz_master', icon: 'award', label: 'Quiz Master', unlocked: false },
  { id: 'species_spotter', icon: 'eye', label: 'Species Spotter', unlocked: false },
];

const defaultState: AppState = {
  discoveredSpecies: [],
  quizzesCompleted: 0,
  arScans: 0,
  achievements: INITIAL_ACHIEVEMENTS,
  isLoading: true,
  discoverSpecies: () => {},
  incrementQuiz: () => {},
  incrementScan: () => {},
};

const AppContext = createContext<AppState>(defaultState);

interface PersistedState {
  discoveredSpecies: string[];
  quizzesCompleted: number;
  arScans: number;
  achievements: Achievement[];
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [discoveredSpecies, setDiscoveredSpecies] = useState<string[]>([]);
  const [quizzesCompleted, setQuizzesCompleted] = useState(0);
  const [arScans, setArScans] = useState(0);
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);
  const [isLoading, setIsLoading] = useState(true);

  // ── Load persisted state once on mount ────────────────────────────────────
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then(json => {
        if (json) {
          const saved: PersistedState = JSON.parse(json);
          setDiscoveredSpecies(saved.discoveredSpecies ?? []);
          setQuizzesCompleted(saved.quizzesCompleted ?? 0);
          setArScans(saved.arScans ?? 0);
          setAchievements(saved.achievements ?? INITIAL_ACHIEVEMENTS);
        }
      })
      .catch(() => { /* silently ignore parse errors */ })
      .finally(() => setIsLoading(false));
  }, []);

  // ── Persist state on every change (skip while still loading) ──────────────
  useEffect(() => {
    if (isLoading) return;
    const payload: PersistedState = {
      discoveredSpecies,
      quizzesCompleted,
      arScans,
      achievements,
    };
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload)).catch(() => {});
  }, [discoveredSpecies, quizzesCompleted, arScans, achievements, isLoading]);

  // ── Sync achievements automatically based on progress ────────────────────
  useEffect(() => {
    if (isLoading) return;
    setAchievements(prev => {
      let changed = false;
      const next = prev.map(a => {
        if (a.id === 'first_scan' && arScans >= 1 && !a.unlocked) {
          changed = true;
          return { ...a, unlocked: true };
        }
        if (a.id === 'quiz_master' && quizzesCompleted >= 1 && !a.unlocked) {
          changed = true;
          return { ...a, unlocked: true };
        }
        if (a.id === 'species_spotter' && discoveredSpecies.length >= 3 && !a.unlocked) {
          changed = true;
          return { ...a, unlocked: true };
        }
        return a;
      });
      return changed ? next : prev;
    });
  }, [discoveredSpecies.length, quizzesCompleted, arScans, isLoading]);

  // ── Public actions ────────────────────────────────────────────────────────
  const discoverSpecies = useCallback((id: string) => {
    setDiscoveredSpecies(prev => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const incrementQuiz = useCallback(() => {
    setQuizzesCompleted(prev => prev + 1);
  }, []);

  const incrementScan = useCallback(() => {
    setArScans(prev => prev + 1);
  }, []);

  return (
    <AppContext.Provider
      value={{
        discoveredSpecies,
        quizzesCompleted,
        arScans,
        achievements,
        isLoading,
        discoverSpecies,
        incrementQuiz,
        incrementScan,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
