import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { makeStyles, radius, spacing, useColors, type Palette } from '@/theme';

import { AppText } from './AppText';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  icon?: keyof typeof Ionicons.glyphMap;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

const paletteOf = (colors: Palette): Record<Variant, { bg: string; pressed: string; fg: string }> => ({
  primary: { bg: colors.accent, pressed: colors.accentPressed, fg: colors.onAccent },
  secondary: { bg: colors.surfaceRaised, pressed: colors.surfacePressed, fg: colors.text },
  ghost: { bg: 'transparent', pressed: colors.surface, fg: colors.text },
  danger: { bg: 'transparent', pressed: colors.surface, fg: colors.danger },
});

export function Button({ label, onPress, variant = 'primary', icon, loading, disabled, style }: ButtonProps) {
  const colors = useColors();
  const styles = useStyles();
  const p = paletteOf(colors)[variant];
  const inactive = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive, busy: loading }}
      onPress={onPress}
      disabled={inactive}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: pressed ? p.pressed : p.bg, opacity: inactive ? 0.5 : 1 },
        variant === 'danger' && styles.dangerBorder,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={p.fg} />
      ) : (
        <View style={styles.content}>
          {icon && <Ionicons name={icon} size={18} color={p.fg} />}
          <AppText variant="heading" color={p.fg}>
            {label}
          </AppText>
        </View>
      )}
    </Pressable>
  );
}

const useStyles = makeStyles((colors) => ({
  base: {
    minHeight: 48,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  dangerBorder: { borderWidth: StyleSheet.hairlineWidth, borderColor: colors.danger },
}));
