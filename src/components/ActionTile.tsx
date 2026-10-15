import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet } from 'react-native';

import { colors, radius, spacing } from '@/theme';

import { AppText } from './AppText';

interface ActionTileProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  active?: boolean;
  disabled?: boolean;
}

/** Bouton carré icône + libellé (Favoris, Partager, Plein écran…). */
export function ActionTile({ icon, label, onPress, active, disabled }: ActionTileProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ selected: active, disabled }}
      style={({ pressed }) => [styles.tile, pressed && { backgroundColor: colors.surfacePressed }]}
    >
      <Ionicons name={icon} size={22} color={active ? colors.live : colors.text} />
      <AppText variant="caption" weight="medium" numberOfLines={1}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    minHeight: 64,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
});
