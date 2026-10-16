import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { useLocalized } from '@/i18n';
import { useCatalog } from '@/providers/CatalogProvider';
import { channelTint, makeStyles, radius, spacing, useTheme } from '@/theme';
import type { Channel } from '@/types';

import { AppText } from './AppText';
import { LogoBadge } from './LogoBadge';

export const TILE_WIDTH = 120;

interface ChannelTileProps {
  channel: Channel;
  width?: number;
  /** Cœur de favori en haut à droite (écran Favoris). */
  onRemoveFavorite?: () => void;
}

/** Carte teintée à la couleur de la chaîne : logo lumineux, nom et catégorie. */
export function ChannelTile({ channel, width = TILE_WIDTH, onRemoveFavorite }: ChannelTileProps) {
  const { t } = useTranslation();
  const { channelName, text } = useLocalized();
  const { getCategory } = useCatalog();
  const { mode, colors } = useTheme();
  const styles = useStyles();
  const tint = channelTint(channel.id, mode);
  const name = channelName(channel);
  const logoSize = Math.round(width * (onRemoveFavorite ? 0.46 : 0.52));

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={name}
      onPress={() => router.push({ pathname: '/channel/[id]', params: { id: channel.id } })}
      style={({ pressed }) => [styles.card, { width, transform: [{ scale: pressed ? 0.97 : 1 }] }]}
    >
      <LinearGradient colors={tint.card} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
      <View style={styles.logo}>
        <LogoBadge channel={channel} size={logoSize} glow />
      </View>
      <AppText variant="label" weight="semibold" numberOfLines={1}>
        {name}
      </AppText>
      <AppText variant="caption" weight="regular" color={colors.textSecondary} numberOfLines={1}>
        {text(getCategory(channel.categoryId)?.name)}
      </AppText>
      {onRemoveFavorite && (
        <Pressable
          onPress={onRemoveFavorite}
          hitSlop={10}
          style={styles.heart}
          accessibilityRole="button"
          accessibilityLabel={t('channel.removeFavorite')}
        >
          <Ionicons name="heart" size={18} color={colors.live} />
        </Pressable>
      )}
    </Pressable>
  );
}

const useStyles = makeStyles((colors) => ({
  card: {
    padding: spacing.md,
    paddingTop: spacing.lg,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  logo: { alignItems: 'center', marginBottom: spacing.md },
  heart: { position: 'absolute', top: spacing.sm, end: spacing.sm },
}));
