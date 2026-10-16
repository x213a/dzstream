import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { useLocalized } from '@/i18n';
import { makeStyles, radius, spacing, useColors } from '@/theme';

import { AppText } from './AppText';

type IconName = keyof typeof Ionicons.glyphMap;

/** Fond commun des écrans : lueur verte en haut, qui se fond dans le bleu nuit. */
export function ScreenBackground({ children, style }: { children?: ReactNode; style?: StyleProp<ViewStyle> }) {
  const colors = useColors();
  const styles = useStyles();
  return (
    <View style={[styles.screen, style]}>
      <LinearGradient
        colors={[colors.backgroundGlow, colors.background]}
        locations={[0, 0.55]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      {children}
    </View>
  );
}

interface ScreenHeaderProps {
  icon: IconName;
  title: string;
  subtitle?: string;
  actions?: { icon: IconName; label: string; onPress: () => void; active?: boolean }[];
}

/** En-tête d'onglet : grande icône, titre, sous-titre et actions à droite. */
export function ScreenHeader({ icon, title, subtitle, actions }: ScreenHeaderProps) {
  const colors = useColors();
  const styles = useStyles();
  return (
    <View style={styles.header}>
      <Ionicons name={icon} size={34} color={colors.text} />
      <View style={{ flex: 1 }}>
        <AppText variant="title" numberOfLines={1}>
          {title}
        </AppText>
        {subtitle && (
          <AppText variant="label" color={colors.textSecondary} numberOfLines={1}>
            {subtitle}
          </AppText>
        )}
      </View>
      {actions?.map((a) => (
        <IconButton key={a.icon} icon={a.icon} label={a.label} onPress={a.onPress} active={a.active} />
      ))}
    </View>
  );
}

interface IconButtonProps {
  icon: IconName;
  label: string;
  onPress: () => void;
  active?: boolean;
  size?: number;
  color?: string;
}

export function IconButton({ icon, label, onPress, active, size = 22, color }: IconButtonProps) {
  const colors = useColors();
  const styles = useStyles();
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.iconButton, (pressed || active) && { backgroundColor: colors.surfaceRaised }]}
    >
      <Ionicons name={icon} size={size} color={color ?? (active ? colors.accent : colors.text)} />
    </Pressable>
  );
}

/** Titre de section avec lien « Voir tout ›». */
export function SectionHeader({ title, onSeeAll, seeAllLabel }: { title: string; onSeeAll?: () => void; seeAllLabel?: string }) {
  const { isRTL } = useLocalized();
  const colors = useColors();
  const styles = useStyles();
  return (
    <View style={styles.section}>
      <AppText variant="title" style={{ flex: 1 }} numberOfLines={1}>
        {title}
      </AppText>
      {onSeeAll && seeAllLabel && (
        <Pressable onPress={onSeeAll} hitSlop={8} style={styles.seeAll} accessibilityRole="link">
          <AppText variant="label" color={colors.textSecondary}>
            {seeAllLabel}
          </AppText>
          <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={14} color={colors.textSecondary} />
        </Pressable>
      )}
    </View>
  );
}

const useStyles = makeStyles((colors) => ({
  screen: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  iconButton: { width: 40, height: 40, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  section: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, marginBottom: spacing.md },
  seeAll: { flexDirection: 'row', alignItems: 'center', gap: 2 },
}));
