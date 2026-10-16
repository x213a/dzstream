import { Ionicons } from '@expo/vector-icons';
import { router, useIsFocused } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useChannelActions } from '@/hooks/useChannelActions';
import { useLocalized } from '@/i18n';
import { useCatalog } from '@/providers/CatalogProvider';
import { usePlayer } from '@/providers/PlayerProvider';
import { makeStyles, mediaColors, radius, spacing, useColors } from '@/theme';
import type { Channel } from '@/types';

import { ActionTile } from './ActionTile';
import { AppText } from './AppText';
import { Button } from './Button';
import { ChannelRow } from './ChannelRow';
import { LiveBadge } from './LiveBadge';
import { LiveVideo } from './LiveVideo';
import { LogoBadge } from './LogoBadge';
import { IconButton, ScreenBackground, SectionHeader } from './Screen';

/** Fiche TV : direct intégré en 16:9, informations, actions et autres chaînes. */
export function TvChannelView({ channel }: { channel: Channel }) {
  const { t } = useTranslation();
  const { channelName, text, isRTL } = useLocalized();
  const insets = useSafeAreaInsets();
  const { channels, getCategory } = useCatalog();
  const { play, current, status, setFullscreen, reportVideoStatus } = usePlayer();
  const { favorite, favBusy, onFavorite, onShare } = useChannelActions(channel);
  const focused = useIsFocused();
  const [attempt, setAttempt] = useState(0);
  const colors = useColors();
  const styles = useStyles();

  const isCurrent = current?.id === channel.id;
  const others = useMemo(() => channels.filter((c) => c.type === 'tv' && c.id !== channel.id), [channels, channel.id]);

  // Ouvrir la fiche lance le direct (sauf si cette chaîne est déjà en cours).
  useEffect(() => {
    if (current?.id !== channel.id) play(channel);
    // Uniquement à l'arrivée sur une nouvelle chaîne.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channel.id]);

  // Tant que la fiche est visible, elle porte la vidéo : le mini-lecteur masque la sienne.
  // Recouverte par le plein écran, elle la libère pour éviter un double décodage.
  useEffect(() => {
    if (!focused) return;
    setFullscreen(true);
    return () => setFullscreen(false);
  }, [focused, setFullscreen]);

  const openFullscreen = () => router.push({ pathname: '/player/[id]', params: { id: channel.id } });
  const retry = () => {
    setAttempt((n) => n + 1);
    play(channel);
  };

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + spacing.sm, paddingBottom: insets.bottom + spacing.xl }}>
        <View style={styles.topBar}>
          <IconButton icon={isRTL ? 'chevron-forward' : 'chevron-back'} label={t('common.close')} onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))} size={26} />
          <Ionicons name="tv-outline" size={26} color={colors.text} />
          <View style={{ flex: 1 }}>
            <AppText variant="heading" numberOfLines={1}>
              {channelName(channel)}
            </AppText>
            <AppText variant="caption" weight="regular" color={colors.textSecondary}>
              {t('common.tv')}
            </AppText>
          </View>
          <IconButton icon="expand" label={t('channel.fullscreen')} onPress={openFullscreen} />
        </View>

        <View style={styles.video}>
          {focused && isCurrent && <LiveVideo key={attempt} channel={channel} paused={status === 'paused'} onStatus={reportVideoStatus} />}
          {isCurrent && status === 'loading' && (
            <View style={styles.overlay} pointerEvents="none">
              <ActivityIndicator size="large" color={mediaColors.text} />
            </View>
          )}
          {isCurrent && status === 'error' && (
            <View style={[styles.overlay, styles.error]}>
              <AppText variant="heading" center color={mediaColors.text}>
                {t('player.error')}
              </AppText>
              <Button label={t('common.retry')} variant="secondary" icon="refresh" onPress={retry} />
            </View>
          )}
          <View style={styles.liveTag} pointerEvents="none">
            <LiveBadge />
          </View>
          <View style={styles.logoTag} pointerEvents="none">
            <LogoBadge channel={channel} size={32} />
          </View>
        </View>

        <View style={styles.info}>
          <View style={{ flex: 1 }}>
            <AppText variant="title" numberOfLines={2}>
              {channelName(channel)}
            </AppText>
            <AppText variant="label" color={colors.textSecondary}>
              {text(getCategory(channel.categoryId)?.name)}
            </AppText>
          </View>
          <LiveBadge variant="pill" />
        </View>

        {channel.description && (
          <AppText color={colors.textSecondary} style={styles.description}>
            {text(channel.description)}
          </AppText>
        )}

        <View style={styles.actions}>
          <ActionTile
            icon={favorite ? 'heart' : 'heart-outline'}
            label={t('channel.favorite')}
            onPress={onFavorite}
            active={favorite}
            disabled={favBusy}
          />
          <ActionTile icon="share-social-outline" label={t('channel.share')} onPress={onShare} />
          <ActionTile icon="expand" label={t('channel.fullscreen')} onPress={openFullscreen} />
        </View>

        {others.length > 0 && (
          <>
            <SectionHeader title={t('channel.otherTv')} />
            {others.map((c) => (
              <ChannelRow key={c.id} channel={c} />
            ))}
          </>
        )}
      </ScrollView>
    </ScreenBackground>
  );
}

const useStyles = makeStyles((colors) => ({
  topBar: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.sm, marginBottom: spacing.md },
  video: {
    aspectRatio: 16 / 9,
    marginHorizontal: spacing.lg,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: mediaColors.background,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  overlay: { position: 'absolute', top: 0, bottom: 0, start: 0, end: 0, alignItems: 'center', justifyContent: 'center' },
  error: { gap: spacing.md, padding: spacing.lg, backgroundColor: colors.overlay },
  liveTag: { position: 'absolute', top: spacing.sm, start: spacing.sm },
  logoTag: { position: 'absolute', top: spacing.sm, end: spacing.sm, opacity: 0.9 },
  info: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, marginHorizontal: spacing.lg, marginTop: spacing.lg },
  description: { marginHorizontal: spacing.lg, marginTop: spacing.sm },
  actions: { flexDirection: 'row', gap: spacing.md, margin: spacing.lg, marginBottom: spacing.xl },
}));
