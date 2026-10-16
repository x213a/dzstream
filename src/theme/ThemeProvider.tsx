import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { StyleSheet } from 'react-native';

import { palettes, type Palette, type ThemeMode } from './tokens';

const STORAGE_KEY = 'dzstream.theme';
export const DEFAULT_THEME: ThemeMode = 'dark';

const isThemeMode = (value: unknown): value is ThemeMode => value === 'dark' || value === 'light';

/** Lit le thème enregistré (sombre par défaut), à appeler avant le premier rendu. */
export async function loadThemeMode(): Promise<ThemeMode> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    return isThemeMode(stored) ? stored : DEFAULT_THEME;
  } catch {
    // Stockage indisponible : thème par défaut.
    return DEFAULT_THEME;
  }
}

interface ThemeContextValue {
  mode: ThemeMode;
  colors: Palette;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  mode: DEFAULT_THEME,
  colors: palettes[DEFAULT_THEME],
  setMode: () => undefined,
});

export function ThemeProvider({ initialMode = DEFAULT_THEME, children }: { initialMode?: ThemeMode; children: ReactNode }) {
  const [mode, setModeState] = useState(initialMode);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    // Non bloquant : le thème s'applique pour la session en cours.
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => undefined);
  }, []);

  const value = useMemo(() => ({ mode, colors: palettes[mode], setMode }), [mode, setMode]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);

export const useColors = () => useContext(ThemeContext).colors;

/**
 * Feuille de styles dépendant du thème : `const useStyles = makeStyles((colors) => ({ … }))`
 * au niveau du module, puis `const styles = useStyles()` dans le composant.
 * Une feuille est créée une seule fois par palette.
 */
export function makeStyles<T extends StyleSheet.NamedStyles<T>>(factory: (colors: Palette) => T & StyleSheet.NamedStyles<any>) {
  const cache = new Map<Palette, T>();
  return function useStyles(): T {
    const colors = useColors();
    let styles = cache.get(colors);
    if (!styles) {
      styles = StyleSheet.create(factory(colors));
      cache.set(colors, styles);
    }
    return styles;
  };
}
