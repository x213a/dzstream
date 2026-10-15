import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Share } from 'react-native';

import { useLocalized } from '@/i18n';
import { useAuth } from '@/providers/AuthProvider';
import type { Channel } from '@/types';
import { Alert } from '@/utils/alert';

/** Favori et partage d'une chaîne, communs aux fiches TV et radio. */
export function useChannelActions(channel: Channel | undefined) {
  const { t } = useTranslation();
  const { channelName } = useLocalized();
  const { isGuest, available, isFavorite, toggleFavorite } = useAuth();
  const [favBusy, setFavBusy] = useState(false);

  const favorite = channel ? isFavorite(channel.id) : false;

  const onFavorite = async () => {
    if (!channel) return;
    if (isGuest) {
      return Alert.alert(t('channel.addFavorite'), available ? t('channel.favoriteNeedsAccount') : t('auth.unavailable'), [
        { text: t('common.cancel'), style: 'cancel' },
        ...(available ? [{ text: t('profile.signIn'), onPress: () => router.push('/auth/login') }] : []),
      ]);
    }
    setFavBusy(true);
    try {
      await toggleFavorite(channel.id);
    } catch {
      Alert.alert(t('common.error'));
    } finally {
      setFavBusy(false);
    }
  };

  const onShare = () => {
    if (!channel) return;
    // Partage indisponible (certains navigateurs) : sans conséquence.
    Share.share({ message: t('channel.shareMessage', { name: channelName(channel) }) }).catch(() => undefined);
  };

  return { favorite, favBusy, onFavorite, onShare };
}
