import { type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

/**
 * Silhouette d'Alger au crépuscule : Maqam Echahid (trois palmes) dominant la baie.
 * Purement décorative ; s'étire en largeur, ancrée en bas à droite.
 */
export function AlgiersSkyline({ style, lights = true }: { style?: StyleProp<ViewStyle>; lights?: boolean }) {
  return (
    <Svg viewBox="0 0 400 180" preserveAspectRatio="xMaxYMax meet" style={style} pointerEvents="none">
      <Defs>
        <LinearGradient id="monument" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#F6E7C8" />
          <Stop offset="0.55" stopColor="#D9B98A" />
          <Stop offset="1" stopColor="#8C6E4D" />
        </LinearGradient>
        <LinearGradient id="city" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#1B2A36" />
          <Stop offset="1" stopColor="#0A1219" />
        </LinearGradient>
      </Defs>

      {/* Collines */}
      <Path d="M0,150 C60,128 120,132 180,140 C240,124 320,118 400,128 L400,180 L0,180 Z" fill="#101C25" />

      {/* Maqam Echahid : trois palmes qui se rejoignent au sommet */}
      <Path d="M262,26 C252,70 246,110 238,150 L256,150 C258,112 260,70 262,26 Z" fill="url(#monument)" />
      <Path d="M262,26 C266,70 270,110 286,150 L268,150 C264,112 263,70 262,26 Z" fill="url(#monument)" opacity={0.85} />
      <Path d="M262,26 C258,76 258,116 262,150 L266,150 C266,116 265,76 262,26 Z" fill="#FFF6E2" />
      <Rect x={232} y={98} width={60} height={5} rx={2} fill="#E9D3AE" opacity={0.9} />
      <Rect x={226} y={146} width={72} height={8} rx={2} fill="#C9A87A" />

      {/* Immeubles */}
      <Path
        d="M0,180 L0,150 L18,150 L18,138 L34,138 L34,152 L52,152 L52,132 L66,132 L66,148 L88,148 L88,140 L104,140 L104,156 L130,156 L130,144 L150,144 L150,158 L176,158 L176,148 L196,148 L196,160 L222,160 L222,156 L300,156 L300,146 L318,146 L318,154 L340,154 L340,140 L356,140 L356,152 L378,152 L378,144 L400,144 L400,180 Z"
        fill="url(#city)"
      />

      {/* Fenêtres allumées */}
      {lights &&
        [
          [8, 156], [24, 146], [42, 160], [58, 140], [74, 156], [94, 150], [116, 162], [138, 152],
          [160, 164], [184, 156], [206, 166], [308, 154], [328, 162], [346, 148], [366, 160], [388, 152],
        ].map(([x, y]) => <Circle key={`${x}-${y}`} cx={x} cy={y} r={1.3} fill="#FFD48A" opacity={0.85} />)}
    </Svg>
  );
}
