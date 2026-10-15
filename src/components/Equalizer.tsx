import { useEffect, useMemo } from 'react';
import { Animated, Easing, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '@/theme';

interface EqualizerProps {
  bars?: number;
  height: number;
  active: boolean;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

/** Barres d'égaliseur animées (décoratives), plus hautes au centre, figées en pause. */
export function Equalizer({ bars = 32, height, active, color = colors.accent, style }: EqualizerProps) {
  const values = useMemo(() => Array.from({ length: bars }, () => new Animated.Value(0.3)), [bars]);
  // Enveloppe en cloche : le centre bouge plus que les bords.
  const envelope = useMemo(
    () => Array.from({ length: bars }, (_, i) => 0.35 + 0.65 * Math.sin((Math.PI * (i + 0.5)) / bars)),
    [bars],
  );

  useEffect(() => {
    if (!active) {
      const settle = Animated.parallel(
        values.map((v) => Animated.timing(v, { toValue: 0.18, duration: 400, useNativeDriver: true })),
      );
      settle.start();
      return () => settle.stop();
    }
    const loops = values.map((v, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(v, {
            toValue: 0.4 + Math.random() * 0.6,
            duration: 260 + ((i * 37) % 220),
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(v, {
            toValue: 0.12 + Math.random() * 0.3,
            duration: 240 + ((i * 53) % 200),
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
      ),
    );
    loops.forEach((l) => l.start());
    return () => loops.forEach((l) => l.stop());
  }, [active, values]);

  return (
    <View style={[styles.row, { height }, style]} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {values.map((v, i) => (
        <Animated.View
          key={i}
          style={[
            styles.bar,
            {
              height: height * envelope[i],
              backgroundColor: color,
              opacity: 0.55 + 0.45 * envelope[i],
              transform: [{ scaleY: v }],
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 3 },
  bar: { width: 3, borderRadius: 2 },
});
