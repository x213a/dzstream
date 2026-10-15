import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { useLocalized } from '@/i18n';
import { useCatalog } from '@/providers/CatalogProvider';
import { usePlayer } from '@/providers/PlayerProvider';
import { channelTint, colors, radius, spacing } from '@/theme';
import type { Channel } from '@/types';

import { AppText } from './AppText';
import { LiveBadge } from './LiveBadge';
import { LogoBadge } from './LogoBadge';

/** Ligne de liste en carte : logo, nom, catégorie, « En direct » et lecture directe. */
export function ChannelRow({ channel }: { channel: Channel }) {
  const { t } = useTranslation();
  const { channelName, text } = useLocalized();
  const { getCategory } = useCatalog();
  const { play, current, status, togglePause } = usePlayer();
  const tint = channelTint(channel.id);
  const isCurrent = current?.id === channel.id && status !== 'idle';
  const isPlaying = isCurrent && status === 'playing';

  const open = () => router.push({ pathname: '/channel/[id]', params: { id: channel.id } });

  const onPlay = () => {
    if (channel.type === 'tv') {
      if (!isCurrent) play(channel);
      router.push({ pathname: '/player/[id]', params: { id: channel.id } });
    } else if (isCurrent) {
      togglePause();
    } else {
      play(channel);
    }
  };

  return (
    <Pressable onPress={open} style={({ pressed }) => [styles.row, isCurrent && styles.rowActive, pressed && { opacity: 0.85 }]}>
      <LinearGradient
        colors={[tint.card[0], 'transparent']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 0.7, y: 0.5 }}
        style={StyleSheet.absoluteFill}
      />
      <LogoBadge channel={channel} size={52} glow />
      <View style={styles.texts}>
        <AppText variant="heading" numberOfLines={1} color={isCurrent ? colors.accent : colors.text}>
          {channelName(channel)}
        </AppText>
        <AppText variant="label" weight="regular" color={colors.textSecondary} numberOfLines={1}>
          {text(getCategory(channel.categoryId)?.name)}
        </AppText>
        <View style={{ marginTop: 3 }}>
          <LiveBadge variant="inline" />
        </View>
      </View>
      <Pressable
        onPress={onPlay}
        hitSlop={8}
        style={({ pressed }) => [styles.play, pressed && { backgroundColor: colors.accentSoft }]}
        accessibilityRole="button"
        accessibilityLabel={`${isPlaying ? t('common.pause') : t('common.play')} ${channelName(channel)}`}
      >
        {isCurrent && status === 'loading' && channel.type === 'radio' ? (
          <ActivityIndicator size="small" color={colors.accent} />
        ) : (
          <Ionicons name={isPlaying && channel.type === 'radio' ? 'pause' : 'play'} size={18} color={colors.accent} style={{ marginStart: 2 }} />
        )}
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rowActive: { borderColor: 'rgba(31,203,92,0.5)' },
  texts: { flex: 1 },
  play: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 12px rgba(31,203,92,0.35)',
  },
});
