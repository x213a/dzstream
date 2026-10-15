import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { useLocalized } from '@/i18n';
import { usePlayer } from '@/providers/PlayerProvider';
import { colors, radius, spacing } from '@/theme';

import { AppText } from './AppText';
import { Equalizer } from './Equalizer';
import { LiveVideo } from './LiveVideo';
import { LogoBadge } from './LogoBadge';

const THUMB_WIDTH = 72;

/**
 * Mini-lecteur persistant, posé au-dessus de la barre d'onglets.
 * Radio : contrôle du lecteur expo-audio. TV : vignette vidéo en direct.
 */
export function MiniPlayer() {
  const { t } = useTranslation();
  const { channelName } = useLocalized();
  const { current, status, togglePause, stop, fullscreen, reportVideoStatus } = usePlayer();

  if (!current) return null;
  const isTv = current.type === 'tv';

  const open = () =>
    isTv
      ? router.push({ pathname: '/player/[id]', params: { id: current.id } })
      : router.push({ pathname: '/channel/[id]', params: { id: current.id } });

  const subtitle =
    status === 'error' ? t('player.error') : status === 'loading' ? t('player.buffering') : t('player.nowPlaying');

  return (
    <View style={styles.container}>
      <Pressable style={styles.main} onPress={open} accessibilityRole="button" accessibilityLabel={channelName(current)}>
        {isTv ? (
          <View style={styles.thumbTv}>
            {!fullscreen && <LiveVideo channel={current} paused={status === 'paused'} onStatus={reportVideoStatus} />}
          </View>
        ) : (
          <LogoBadge channel={current} size={44} />
        )}
        <View style={styles.texts}>
          <AppText variant="heading" numberOfLines={1}>
            {channelName(current)}
          </AppText>
          <AppText variant="label" numberOfLines={1} color={status === 'error' ? colors.danger : colors.textSecondary}>
            {subtitle}
          </AppText>
        </View>
        {!isTv && <Equalizer bars={5} height={18} active={status === 'playing'} />}
      </Pressable>
      <Pressable
        onPress={togglePause}
        hitSlop={8}
        style={[styles.control, styles.playControl]}
        accessibilityRole="button"
        accessibilityLabel={status === 'playing' ? t('common.pause') : t('common.play')}
      >
        {status === 'loading' ? (
          <ActivityIndicator color={colors.background} />
        ) : (
          <Ionicons name={status === 'playing' ? 'pause' : 'play'} size={22} color={colors.background} />
        )}
      </Pressable>
      <Pressable onPress={stop} hitSlop={8} style={styles.control} accessibilityRole="button" accessibilityLabel={t('common.close')}>
        <Ionicons name="close" size={24} color={colors.textSecondary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    padding: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: 'rgba(31,203,92,0.35)',
    boxShadow: '0 6px 20px rgba(0,0,0,0.45)',
    gap: spacing.sm,
  },
  main: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  thumbTv: { width: THUMB_WIDTH, height: (THUMB_WIDTH * 9) / 16, borderRadius: radius.sm, overflow: 'hidden', backgroundColor: '#000' },
  texts: { flex: 1 },
  control: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  playControl: { borderRadius: 20, backgroundColor: colors.accent, boxShadow: '0 0 12px rgba(31,203,92,0.45)' },
});
