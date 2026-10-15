import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { EmptyState } from '@/components/EmptyState';
import { RadioPlayerView } from '@/components/RadioPlayerView';
import { ScreenBackground } from '@/components/Screen';
import { TvChannelView } from '@/components/TvChannelView';
import { useCatalog } from '@/providers/CatalogProvider';

/** Fiche d'une chaîne : lecteur radio plein écran, ou direct TV intégré. */
export default function ChannelScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const { getChannel } = useCatalog();

  const channel = getChannel(id);
  if (!channel) {
    return (
      <ScreenBackground>
        <EmptyState icon="alert-circle-outline" title={t('channel.notFound')} />
      </ScreenBackground>
    );
  }
  return channel.type === 'radio' ? <RadioPlayerView channel={channel} /> : <TvChannelView channel={channel} />;
}
