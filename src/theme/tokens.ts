import { DarkTheme, DefaultTheme, type Theme } from 'expo-router';

export type ThemeMode = 'dark' | 'light';

export interface Palette {
  background: string;
  /** Haut des écrans : lueur verte discrète qui se fond dans le fond. */
  backgroundGlow: string;
  surface: string;
  surfaceRaised: string;
  surfacePressed: string;
  border: string;
  borderStrong: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  accentPressed: string;
  accentSoft: string;
  /** Texte et icônes posés sur l'accent ou sur le rouge « direct ». */
  onAccent: string;
  live: string;
  danger: string;
  overlay: string;
  /** Ombre portée des éléments flottants (mini-lecteur). */
  shadow: string;
}

export const palettes: Record<ThemeMode, Palette> = {
  /** Bleu nuit profond, cartes teintées, accent vert algérien lumineux. */
  dark: {
    background: '#060C11',
    backgroundGlow: '#0B1D17',
    surface: '#0D1820',
    surfaceRaised: '#13222D',
    surfacePressed: '#1A2C38',
    border: 'rgba(255,255,255,0.08)',
    borderStrong: 'rgba(255,255,255,0.14)',
    text: '#FFFFFF',
    textSecondary: '#A2AEBB',
    textMuted: '#66737F',
    /** Vert algérien, éclairci pour briller sur fond sombre. */
    accent: '#1FCB5C',
    accentPressed: '#17A84B',
    accentSoft: 'rgba(31,203,92,0.16)',
    onAccent: '#FFFFFF',
    live: '#E5263D',
    danger: '#FF4D5E',
    overlay: 'rgba(0,0,0,0.6)',
    shadow: 'rgba(0,0,0,0.45)',
  },
  /** Gris très clair, cartes blanches, vert plus soutenu pour rester lisible sur blanc. */
  light: {
    background: '#F3F6F8',
    backgroundGlow: '#DCF2E4',
    surface: '#FFFFFF',
    surfaceRaised: '#E9EFF3',
    surfacePressed: '#DCE5EB',
    border: 'rgba(6,12,17,0.08)',
    borderStrong: 'rgba(6,12,17,0.14)',
    text: '#0B1620',
    textSecondary: '#4E5D6B',
    textMuted: '#7D8A96',
    accent: '#14A04A',
    accentPressed: '#10863D',
    accentSoft: 'rgba(20,160,74,0.14)',
    onAccent: '#FFFFFF',
    live: '#E5263D',
    danger: '#D92D3F',
    overlay: 'rgba(0,0,0,0.6)',
    shadow: 'rgba(16,24,32,0.14)',
  },
};

/** Couleurs fixes des surfaces vidéo et images (toujours sombres, quel que soit le thème). */
export const mediaColors = { background: '#000000', text: '#FFFFFF' } as const;

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;

export const radius = { sm: 6, md: 12, lg: 18, xl: 24, pill: 999 } as const;

export const fonts = {
  latin: { regular: 'Inter_400Regular', medium: 'Inter_500Medium', semibold: 'Inter_600SemiBold', bold: 'Inter_800ExtraBold' },
  arabic: { regular: 'Cairo_400Regular', medium: 'Cairo_500Medium', semibold: 'Cairo_600SemiBold', bold: 'Cairo_800ExtraBold' },
  /** Police manuscrite des accroches (alphabet latin uniquement). */
  script: 'DancingScript_700Bold',
} as const;

export type FontWeightKey = keyof typeof fonts.latin;

export const typography = {
  display: { fontSize: 30, lineHeight: 36, weight: 'bold' },
  title: { fontSize: 22, lineHeight: 28, weight: 'bold' },
  heading: { fontSize: 17, lineHeight: 22, weight: 'semibold' },
  body: { fontSize: 15, lineHeight: 21, weight: 'regular' },
  label: { fontSize: 13, lineHeight: 17, weight: 'medium' },
  caption: { fontSize: 11, lineHeight: 14, weight: 'semibold' },
} as const satisfies Record<string, { fontSize: number; lineHeight: number; weight: FontWeightKey }>;

export type TypographyVariant = keyof typeof typography;

/**
 * Teinte déterministe par chaîne : chaque carte a sa couleur (bleu, vert, violet…),
 * comme sur la maquette, sans rien stocker dans le catalogue.
 */
export function channelHue(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  return Math.abs(hash) % 360;
}

export function channelTint(id: string, mode: ThemeMode = 'dark') {
  const hue = channelHue(id);
  return {
    /** Dégradé de fond des cartes (pastel en clair pour garder le texte lisible). */
    card:
      mode === 'dark'
        ? ([`hsla(${hue}, 55%, 30%, 0.55)`, `hsla(${hue}, 45%, 12%, 0.35)`] as [string, string])
        : ([`hsla(${hue}, 70%, 62%, 0.26)`, `hsla(${hue}, 60%, 85%, 0.18)`] as [string, string]),
    /** Anneau et halo autour du logo. */
    ring: `hsl(${hue}, 70%, ${mode === 'dark' ? 60 : 50}%)`,
    glow: `hsla(${hue}, 80%, 55%, ${mode === 'dark' ? 0.45 : 0.3})`,
  };
}

export function navigationTheme(mode: ThemeMode): Theme {
  const base = mode === 'dark' ? DarkTheme : DefaultTheme;
  const c = palettes[mode];
  return {
    ...base,
    colors: {
      ...base.colors,
      primary: c.accent,
      background: c.background,
      card: c.background,
      text: c.text,
      border: c.border,
      notification: c.live,
    },
  };
}
