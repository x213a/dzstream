import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { channelHue } from '@/theme';
import type { Channel } from '@/types';

import { AppText } from './AppText';

/** Dégradé sombre déterministe par chaîne, pour un rendu « affiche » à la Molotov. */
export function channelGradient(id: string): [string, string] {
  const hue = channelHue(id);
  return [`hsl(${hue}, 45%, 22%)`, `hsl(${(hue + 40) % 360}, 35%, 9%)`];
}

interface ChannelLogoProps {
  channel: Pick<Channel, 'id' | 'name' | 'logoUrl'>;
  /** Taille du logo (le fond occupe tout le conteneur). */
  logoSize: number;
  style?: StyleProp<ViewStyle>;
}

export function ChannelLogo({ channel, logoSize, style }: ChannelLogoProps) {
  const [failed, setFailed] = useState(false);
  const initials = channel.name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <View style={[styles.container, style]}>
      <LinearGradient colors={channelGradient(channel.id)} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
      {channel.logoUrl && !failed ? (
        <Image
          source={{ uri: channel.logoUrl }}
          style={{ width: logoSize, height: logoSize }}
          contentFit="contain"
          transition={200}
          onError={() => setFailed(true)}
          accessibilityIgnoresInvertColors
        />
      ) : (
        <AppText variant="title" color="#FFFFFF" style={{ fontSize: logoSize * 0.38, lineHeight: logoSize * 0.5 }}>
          {initials}
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
});
