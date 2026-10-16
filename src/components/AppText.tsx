import { Text, type TextProps } from 'react-native';

import { useLocalized } from '@/i18n';
import { fonts, typography, useColors, type FontWeightKey, type TypographyVariant } from '@/theme';

interface AppTextProps extends TextProps {
  variant?: TypographyVariant;
  weight?: FontWeightKey;
  color?: string;
  center?: boolean;
}

/** Texte de l'app : applique la typographie du thème et la police adaptée à la langue (Inter / Cairo). */
export function AppText({ variant = 'body', weight, color, center, style, ...rest }: AppTextProps) {
  const { lang } = useLocalized();
  const colors = useColors();
  const spec = typography[variant];
  const family = (lang === 'ar' ? fonts.arabic : fonts.latin)[weight ?? spec.weight];
  return (
    <Text
      {...rest}
      style={[
        {
          fontFamily: family,
          fontSize: spec.fontSize,
          // Cairo a des ascendantes plus hautes : on aère la ligne.
          lineHeight: lang === 'ar' ? Math.round(spec.lineHeight * 1.2) : spec.lineHeight,
          color: color ?? colors.text,
          textAlign: center ? 'center' : undefined,
        },
        style,
      ]}
    />
  );
}
