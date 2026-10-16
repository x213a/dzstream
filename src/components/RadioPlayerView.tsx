import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useChannelActions } from '@/hooks/useChannelActions';
import { useLocalized } from '@/i18n';
import { useCatalog } from '@/providers/CatalogProvider';
import { usePlayer } from '@/providers/PlayerProvider';
import { channelTint, makeStyles, radius, spacing, useTheme } from '@/theme';
import type { Channel } from '@/types';

import { ActionTile } from './ActionTile';
import { AppText } from './AppText';
import { Carousel } from './Carousel';
import { Equalizer } from './Equalizer';
import { LiveBadge } from './LiveBadge';
import { LogoBadge } from './LogoBadge';
import { IconButton } from './Screen';

/** Débit annoncé dans l'URL des flux Radio Algérienne (`…_64K.mp3`). */
function bitrateOf(url: string) {
  const match = /_(\d{2,3})K\b/i.exec(url);
  return match ? `${match[1]} kbps` : null;
}

/** Lecteur radio plein écran : grand logo lumineux, égaliseur, commandes et radios voisines. */
export function RadioPlayerView({ channel }: { channel: Channel }) {
  const { t } = useTranslation();
  const { channelName, text, isRTL } = useLocalized();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { channels, getCategory } = useCatalog();
  const { play, current, status, togglePause } = usePlayer();
  const { favorite, favBusy, onFavorite, onShare } = useChannelActions(channel);
  const { mode, colors } = useTheme();
  const styles = useStyles();

  const tint = channelTint(channel.id, mode);
  const isCurrent = current?.id === channel.id;
  const playing = isCurrent && status === 'playing';
  const loading = isCurrent && status === 'loading';
  const logoSize = Math.min(Math.round(width * 0.48), 220);
  const bitrate = bitrateOf(channel.streamUrl);

  const radios = useMemo(() => channels.filter((c) => c.type === 'radio'), [channels]);
  const index = radios.findIndex((c) => c.id === channel.id);
  const related = radios.filter((c) => c.categoryId === channel.categoryId && c.id !== channel.id);

  // Ouvrir la fiche lance l'écoute (sauf si cette radio est déjà en cours).
  useEffect(() => {
    if (current?.id !== channel.id) play(channel);
    // Uniquement à l'arrivée sur une nouvelle radio.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channel.id]);

  const goTo = (offset: number) => {
    if (radios.length < 2) return;
    const next = radios[(index + offset + radios.length) % radios.length];
    router.setParams({ id: next.id });
  };

  return (
    <View style={styles.screen}>
      <LinearGradient colors={[tint.glow, colors.background]} locations={[0, 0.6]} style={StyleSheet.absoluteFill} />
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + spacing.sm, paddingBottom: insets.bottom + spacing.xl }}>
        <View style={styles.topBar}>
          <IconButton icon={isRTL ? 'chevron-forward' : 'chevron-back'} label={t('common.close')} onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))} size={26} />
          <View style={{ flex: 1 }} />
          <IconButton
            icon={favorite ? 'heart' : 'heart-outline'}
            label={favorite ? t('channel.removeFavorite') : t('channel.addFavorite')}
            onPress={onFavorite}
            color={favorite ? colors.live : colors.text}
          />
          <IconButton icon="share-social-outline" label={t('channel.share')} onPress={onShare} />
        </View>

        <View style={styles.hero}>
          <View style={[styles.halo, { width: logoSize * 1.35, height: logoSize * 1.35, borderRadius: logoSize, boxShadow: `0 0 80px ${tint.glow}` }]}>
            <LogoBadge channel={channel} size={logoSize} glow />
          </View>
          <AppText variant="display" center numberOfLines={2}>
            {channelName(channel)}
          </AppText>
          <AppText variant="heading" weight="regular" color={colors.textSecondary} center>
            {text(getCategory(channel.categoryId)?.name)}
          </AppText>
          <View style={styles.badges}>
            <LiveBadge variant="pill" />
            {bitrate && (
              <View style={styles.pill}>
                <Ionicons name="pulse" size={13} color={colors.textSecondary} />
                <AppText variant="label" color={colors.textSecondary}>
                  {bitrate}
                </AppText>
              </View>
            )}
          </View>
        </View>

        <Equalizer bars={Math.min(44, Math.floor((width - spacing.xl * 2) / 7))} height={64} active={playing} style={styles.equalizer} />

        {isCurrent && status === 'error' && (
          <AppText variant="label" color={colors.danger} center style={{ marginBottom: spacing.md }}>
            {t('player.error')}
          </AppText>
        )}

        <View style={styles.controls}>
          <Pressable onPress={() => goTo(isRTL ? 1 : -1)} hitSlop={8} style={styles.sideControl} accessibilityRole="button" accessibilityLabel={t('channel.previous')}>
            <Ionicons name="play-skip-back" size={24} color={colors.text} />
          </Pressable>
          <Pressable
            onPress={() => (isCurrent && status !== 'error' ? togglePause() : play(channel))}
            style={({ pressed }) => [styles.mainControl, pressed && { transform: [{ scale: 0.96 }] }]}
            accessibilityRole="button"
            accessibilityLabel={playing ? t('common.pause') : t('common.listen')}
          >
            {loading ? (
              <ActivityIndicator color={colors.accent} size="large" />
            ) : (
              <Ionicons name={playing ? 'pause' : 'play'} size={38} color={colors.accent} style={!playing && { marginStart: 4 }} />
            )}
          </Pressable>
          <Pressable onPress={() => goTo(isRTL ? -1 : 1)} hitSlop={8} style={styles.sideControl} accessibilityRole="button" accessibilityLabel={t('channel.next')}>
            <Ionicons name="play-skip-forward" size={24} color={colors.text} />
          </Pressable>
        </View>

        <View style={styles.actions}>
          <ActionTile
            icon={favorite ? 'heart' : 'heart-outline'}
            label={t('channel.favorite')}
            onPress={onFavorite}
            active={favorite}
            disabled={favBusy}
          />
          <ActionTile icon="share-social-outline" label={t('channel.share')} onPress={onShare} />
        </View>

        {channel.description && (
          <AppText color={colors.textSecondary} style={styles.description}>
            {text(channel.description)}
          </AppText>
        )}

        <Carousel title={t('channel.otherRadio')} channels={related.length > 0 ? related : radios.filter((c) => c.id !== channel.id)} />
      </ScrollView>
    </View>
  );
}

const useStyles = makeStyles((colors) => ({
  screen: { flex: 1, backgroundColor: colors.background },
  topBar: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingHorizontal: spacing.sm },
  hero: { alignItems: 'center', gap: spacing.xs, paddingHorizontal: spacing.lg, marginTop: spacing.md },
  halo: { alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg },
  badges: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.md },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  equalizer: { marginVertical: spacing.xl, marginHorizontal: spacing.xl },
  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xxl, marginBottom: spacing.xl },
  sideControl: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainControl: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 3,
    borderColor: colors.accent,
    backgroundColor: 'rgba(31,203,92,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 28px rgba(31,203,92,0.5)',
  },
  actions: { flexDirection: 'row', gap: spacing.md, marginHorizontal: spacing.lg, marginBottom: spacing.xl },
  description: { marginHorizontal: spacing.lg, marginBottom: spacing.xl },
}));
