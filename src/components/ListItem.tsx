import { Ionicons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useLocalized } from '@/i18n';
import { colors, spacing } from '@/theme';

import { AppText } from './AppText';

interface ListItemProps {
  icon?: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  onPress?: () => void;
  right?: ReactNode;
  color?: string;
}

/** Ligne de réglage (profil, administration). */
export function ListItem({ icon, label, value, onPress, right, color = colors.text }: ListItemProps) {
  const { isRTL } = useLocalized();
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      style={({ pressed }) => [styles.row, pressed && { backgroundColor: colors.surfacePressed }]}
    >
      {icon && <Ionicons name={icon} size={20} color={color} />}
      {/* Alignement explicite : sinon le web aligne à droite un libellé en arabe (« العربية »). */}
      <AppText style={[styles.label, { textAlign: isRTL ? 'right' : 'left' }]} color={color} numberOfLines={1}>
        {label}
      </AppText>
      {value && (
        <AppText variant="label" color={colors.textSecondary}>
          {value}
        </AppText>
      )}
      {right}
      {onPress && !right && (
        // Les chevrons ne sont pas inversés automatiquement en RTL.
        <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={18} color={colors.textMuted} />
      )}
    </Pressable>
  );
}

export function ListGroup({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <View style={styles.groupWrapper}>
      {title && (
        <AppText variant="caption" color={colors.textMuted} style={styles.groupTitle}>
          {title.toUpperCase()}
        </AppText>
      )}
      <View style={styles.group}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 52,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
  },
  label: { flex: 1 },
  groupWrapper: { marginHorizontal: spacing.lg, marginBottom: spacing.xl },
  groupTitle: { marginBottom: spacing.sm, marginStart: spacing.xs },
  group: { borderRadius: 14, overflow: 'hidden', gap: StyleSheet.hairlineWidth, backgroundColor: colors.border },
});
