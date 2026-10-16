import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { LiveBadge } from '@/components/LiveBadge';
import { LiveVideo } from '@/components/LiveVideo';
import { useLocalized } from '@/i18n';
import { useCatalog } from '@/providers/CatalogProvider';
import { usePlayer } from '@/providers/PlayerProvider';
import { mediaColors, spacing } from '@/theme';

/** Lecteur TV plein écran (HLS via react-native-video). */
export default function PlayerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const { channelName } = useLocalized();
  const insets = useSafeAreaInsets();
  const { getChannel } = useCatalog();
  const { current, status, play, setFullscreen, reportVideoStatus } = usePlayer();

  const channel = getChannel(id);
  const [attempt, setAttempt] = useState(0);

  const retry = () => {
    if (!channel) return;
    setAttempt((n) => n + 1);
    play(channel);
  };

  // Ouverture directe (lien profond) : on démarre la lecture si nécessaire.
  useEffect(() => {
    if (channel && current?.id !== channel.id) play(channel);
  }, [channel, current?.id, play]);

  useEffect(() => {
    setFullscreen(true);
    return () => setFullscreen(false);
  }, [setFullscreen]);

  const close = () => (router.canGoBack() ? router.back() : router.replace('/'));

  return (
    <View style={styles.screen}>
      {channel && current?.id === channel.id && (
        <LiveVideo key={attempt} channel={channel} paused={status === 'paused'} controls onStatus={reportVideoStatus} />
      )}

      {status === 'loading' && (
        <View style={styles.center} pointerEvents="none">
          <ActivityIndicator size="large" color={mediaColors.text} />
        </View>
      )}

      {(status === 'error' || !channel) && (
        <View style={[styles.center, styles.errorBox]}>
          <AppText variant="heading" center color={mediaColors.text}>
            {channel ? t('player.error') : t('channel.notFound')}
          </AppText>
          {channel && <Button label={t('common.retry')} variant="secondary" icon="refresh" onPress={retry} />}
        </View>
      )}

      <View style={[styles.topBar, { paddingTop: insets.top + spacing.sm, paddingStart: insets.left + spacing.lg, paddingEnd: insets.right + spacing.lg }]}>
        <Pressable onPress={close} hitSlop={12} accessibilityRole="button" accessibilityLabel={t('common.close')}>
          <Ionicons name="chevron-down" size={28} color={mediaColors.text} />
        </Pressable>
        {channel && (
          <View style={styles.titleBox}>
            <LiveBadge />
            <AppText variant="heading" numberOfLines={1} color={mediaColors.text} style={{ flexShrink: 1 }}>
              {channelName(channel)}
            </AppText>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Lecteur plein écran : toujours sur fond noir, quel que soit le thème.
  screen: { flex: 1, backgroundColor: mediaColors.background },
  center: { position: 'absolute', top: 0, bottom: 0, start: 0, end: 0, alignItems: 'center', justifyContent: 'center' },
  errorBox: { gap: spacing.lg, padding: spacing.xl, backgroundColor: 'rgba(0,0,0,0.6)' },
  topBar: { position: 'absolute', top: 0, start: 0, end: 0, flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  titleBox: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
});
