import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { useLocalized } from '@/i18n';
import { colors, fonts, radius, spacing } from '@/theme';

import { AlgeriaFlag } from './AlgeriaFlag';
import { AlgiersSkyline } from './AlgiersSkyline';
import { AppText } from './AppText';

/** Bandeau d'accueil : Alger au crépuscule et l'accroche de l'app. */
export function HeroBanner() {
  const { t } = useTranslation();
  const { lang } = useLocalized();
  // La police manuscrite n'a pas de glyphes arabes.
  const scriptStyle = lang === 'ar' ? { fontFamily: fonts.arabic.bold, fontSize: 22, lineHeight: 34 } : styles.script;

  return (
    <View style={styles.banner}>
      <LinearGradient
        colors={['#1E3A4A', '#3B4A5A', '#B87A4B']}
        locations={[0, 0.55, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.3, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <AlgiersSkyline style={styles.skyline} />
      <AlgeriaFlag size={22} style={styles.flag} />
      <LinearGradient
        colors={['rgba(6,12,17,0.75)', 'rgba(6,12,17,0)']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 0.7, y: 0.5 }}
        style={StyleSheet.absoluteFill}
      />
      <AppText style={[scriptStyle, styles.text]} accessibilityRole="header">
        {t('home.slogan')}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    height: 150,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    borderRadius: radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderStrong,
    justifyContent: 'center',
  },
  skyline: { position: 'absolute', end: 0, bottom: 0, width: '78%', height: '100%' },
  flag: { position: 'absolute', end: '38%', top: '42%', transform: [{ skewY: '-6deg' }] },
  text: { paddingHorizontal: spacing.xl, maxWidth: '62%', transform: [{ rotate: '-4deg' }] },
  script: { fontFamily: fonts.script, fontSize: 30, lineHeight: 32, color: colors.text, textShadowColor: 'rgba(0,0,0,0.6)', textShadowRadius: 8 },
});
