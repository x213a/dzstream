import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';

const GREEN = '#006233';
const RED = '#D21034';

/** Étoile à cinq branches, une pointe tournée vers le croissant (à gauche). */
function starPath(cx: number, cy: number, outer: number, inner: number) {
  const points = Array.from({ length: 10 }, (_, i) => {
    const r = i % 2 === 0 ? outer : inner;
    const a = Math.PI + (i * Math.PI) / 5;
    return `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`;
  });
  return `M${points.join('L')}Z`;
}

// Proportions 3:2. Croissant : deux cercles tangents à droite, en règle pair-impair.
const CRESCENT = 'M100,150 a50,50 0 1,0 100,0 a50,50 0 1,0 -100,0 Z M120,150 a40,40 0 1,0 80,0 a40,40 0 1,0 -80,0 Z';
const STAR = starPath(178, 150, 24, 9.5);

interface AlgeriaFlagProps {
  /** Hauteur ; la largeur suit le ratio 3:2 (ou égale la hauteur en mode rond). */
  size: number;
  round?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function AlgeriaFlag({ size, round, style }: AlgeriaFlagProps) {
  const width = round ? size : (size * 3) / 2;
  return (
    <View
      style={[{ width, height: size, overflow: 'hidden' }, round ? { borderRadius: size / 2 } : styles.rect, style]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {/* En mode rond, on recadre le centre du drapeau. */}
      <Svg width="100%" height="100%" viewBox={round ? '50 50 200 200' : '0 50 300 200'} preserveAspectRatio="xMidYMid slice">
        <Rect x={0} y={0} width={150} height={300} fill={GREEN} />
        <Rect x={150} y={0} width={150} height={300} fill="#FFFFFF" />
        <Path d={CRESCENT} fill={RED} fillRule="evenodd" />
        <Path d={STAR} fill={RED} />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  rect: { borderRadius: 2 },
});
