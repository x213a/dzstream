import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView } from 'react-native';

import { makeStyles, radius, spacing, useColors } from '@/theme';

import { AppText } from './AppText';

export interface ChipOption<T extends string> {
  value: T;
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

interface ChipsProps<T extends string> {
  options: ChipOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Défilement horizontal (catégories) ou retour à la ligne (formulaires). */
  scroll?: boolean;
}

export function Chips<T extends string>({ options, value, onChange, scroll = true }: ChipsProps<T>) {
  const colors = useColors();
  const styles = useStyles();
  const chips = options.map((o) => {
    const selected = o.value === value;
    const fg = selected ? colors.onAccent : colors.textSecondary;
    return (
      <Pressable
        key={o.value}
        accessibilityRole="button"
        accessibilityState={{ selected }}
        onPress={() => onChange(o.value)}
        style={[styles.chip, selected && styles.chipSelected]}
      >
        {o.icon && <Ionicons name={o.icon} size={15} color={fg} />}
        <AppText variant="label" weight={selected ? 'semibold' : 'medium'} color={fg}>
          {o.label}
        </AppText>
      </Pressable>
    );
  });

  if (!scroll) return <>{chips}</>;
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {chips}
    </ScrollView>
  );
}

const useStyles = makeStyles((colors) => ({
  row: { gap: spacing.sm, paddingHorizontal: spacing.lg },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
    boxShadow: '0 0 14px rgba(31,203,92,0.45)',
  },
}));
