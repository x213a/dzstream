import { DarkTheme, type Theme } from 'expo-router';

/** Bleu nuit profond, cartes teintées, accent vert algérien lumineux. */
export const colors = {
  background: '#060C11',
  /** Haut des écrans : lueur verte discrète qui se fond dans le fond. */
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
  live: '#E5263D',
  danger: '#FF4D5E',
  overlay: 'rgba(0,0,0,0.6)',
} as const;

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

export function channelTint(id: string) {
  const hue = channelHue(id);
  return {
    /** Dégradé de fond des cartes. */
    card: [`hsla(${hue}, 55%, 30%, 0.55)`, `hsla(${hue}, 45%, 12%, 0.35)`] as [string, string],
    /** Anneau et halo autour du logo. */
    ring: `hsl(${hue}, 70%, 60%)`,
    glow: `hsla(${hue}, 80%, 55%, 0.45)`,
  };
}

export const navigationTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.accent,
    background: colors.background,
    card: colors.background,
    text: colors.text,
    border: colors.border,
    notification: colors.live,
  },
};
