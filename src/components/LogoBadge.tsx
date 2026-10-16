import { Image } from 'expo-image';
import { useState } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { channelTint, fonts, useTheme } from '@/theme';
import type { Channel } from '@/types';

import { AppText } from './AppText';

interface LogoBadgeProps {
  channel: Pick<Channel, 'id' | 'name' | 'logoUrl'>;
  size: number;
  /** Halo lumineux autour de l'anneau (cartes, lecteur). */
  glow?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** Logo rond sur pastille claire, cerclé d'un anneau à la couleur de la chaîne. */
export function LogoBadge({ channel, size, glow, style }: LogoBadgeProps) {
  const [failed, setFailed] = useState(false);
  const { mode } = useTheme();
  const tint = channelTint(channel.id, mode);
  const ring = Math.max(2, Math.round(size * 0.05));
  const initials = channel.name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <View
      style={[
        styles.ring,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: ring,
          borderColor: tint.ring,
          boxShadow: glow ? `0 0 ${Math.round(size * 0.28)}px ${tint.glow}` : undefined,
        },
        style,
      ]}
    >
      <View style={[styles.disc, { borderRadius: size / 2 }]}>
        {channel.logoUrl && !failed ? (
          <Image
            source={{ uri: channel.logoUrl }}
            style={{ width: size * 0.68, height: size * 0.68 }}
            contentFit="contain"
            transition={200}
            onError={() => setFailed(true)}
            accessibilityIgnoresInvertColors
          />
        ) : (
          <AppText style={{ fontFamily: fonts.latin.bold, fontSize: size * 0.3, lineHeight: size * 0.4, color: INITIALS_COLOR }}>
            {initials}
          </AppText>
        )}
      </View>
    </View>
  );
}

/** Initiales sombres sur la pastille claire, dans les deux thèmes. */
const INITIALS_COLOR = '#060C11';

const styles = StyleSheet.create({
  ring: { padding: 2, backgroundColor: 'rgba(255,255,255,0.08)' },
  disc: { flex: 1, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', backgroundColor: '#F4F6F8' },
});
