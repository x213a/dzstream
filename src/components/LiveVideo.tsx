import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Video from 'react-native-video';

import type { PlayerStatus } from '@/providers/PlayerProvider';
import type { Channel } from '@/types';

interface LiveVideoProps {
  channel: Channel;
  paused: boolean;
  controls?: boolean;
  onStatus: (status: PlayerStatus) => void;
  style?: StyleProp<ViewStyle>;
}

/** Lecteur HLS (.m3u8) des chaînes TV, basé sur react-native-video. */
export function LiveVideo({ channel, paused, controls, onStatus, style }: LiveVideoProps) {
  return (
    <Video
      // Changer de clé force le rechargement quand un admin modifie l'URL du flux.
      key={channel.streamUrl}
      source={{
        uri: channel.streamUrl,
        headers: channel.headers,
        metadata: { title: channel.name, imageUri: channel.logoUrl },
      }}
      style={[StyleSheet.absoluteFill, style]}
      resizeMode="contain"
      paused={paused}
      controls={controls}
      ignoreSilentSwitch="ignore"
      playInBackground={false}
      onLoadStart={() => onStatus('loading')}
      onBuffer={({ isBuffering }) => onStatus(isBuffering ? 'loading' : 'playing')}
      onPlaybackStateChanged={({ isPlaying }) => isPlaying && onStatus('playing')}
      onError={(e) => {
        console.warn('[video]', channel.id, e.error);
        onStatus('error');
      }}
    />
  );
}
