import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { colors, radius, spacing } from '@/theme';

import { AppText } from './AppText';

type Variant = 'solid' | 'pill' | 'inline';

/**
 * Indicateur « en direct » :
 * - `solid` : étiquette rouge « DIRECT » posée sur une image ;
 * - `pill` : pastille sombre « ● En direct » (lecteurs) ;
 * - `inline` : point rouge et texte, dans les listes.
 */
export function LiveBadge({ variant = 'solid' }: { variant?: Variant }) {
  const { t } = useTranslation();

  if (variant === 'solid') {
    return (
      <View style={[styles.row, styles.solid]}>
        <View style={[styles.dot, { backgroundColor: colors.text }]} />
        <AppText variant="caption">{t('common.live').toUpperCase()}</AppText>
      </View>
    );
  }

  return (
    <View style={[styles.row, variant === 'pill' && styles.pill]}>
      <View style={[styles.dot, styles.liveDot]} />
      <AppText variant={variant === 'pill' ? 'label' : 'caption'} color={variant === 'pill' ? colors.text : colors.textSecondary}>
        {t('common.onAir')}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs + 2, alignSelf: 'flex-start' },
  solid: { backgroundColor: colors.live, borderRadius: radius.sm, paddingHorizontal: spacing.sm, paddingVertical: 2 },
  pill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(229,38,61,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(229,38,61,0.45)',
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  liveDot: { backgroundColor: colors.live, boxShadow: `0 0 6px ${colors.live}` },
});
