import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import * as Updates from 'expo-updates';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DevSettings, ScrollView, Share, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AlgeriaFlag } from '@/components/AlgeriaFlag';
import { AlgiersSkyline } from '@/components/AlgiersSkyline';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { ListGroup, ListItem } from '@/components/ListItem';
import { ScreenBackground } from '@/components/Screen';
import { LANGUAGES, setLanguage, useLocalized } from '@/i18n';
import { useAuth } from '@/providers/AuthProvider';
import { fonts, makeStyles, radius, spacing, useTheme, type ThemeMode } from '@/theme';
import type { Language } from '@/types';
import { Alert } from '@/utils/alert';

async function restartApp() {
  try {
    if (__DEV__) DevSettings.reload();
    else await Updates.reloadAsync();
  } catch {
    // Rechargement impossible (ex. expo-updates désactivé) : l'utilisateur relancera l'app.
  }
}

const THEMES: { mode: ThemeMode; label: 'profile.themeDark' | 'profile.themeLight'; icon: keyof typeof Ionicons.glyphMap }[] = [
  { mode: 'dark', label: 'profile.themeDark', icon: 'moon-outline' },
  { mode: 'light', label: 'profile.themeLight', icon: 'sunny-outline' },
];

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { lang } = useLocalized();
  const insets = useSafeAreaInsets();
  const { available, isGuest, isAdmin, user, profile, signOut, clearHistory } = useAuth();
  const [busy, setBusy] = useState(false);
  const { mode, setMode, colors } = useTheme();
  const styles = useStyles();

  const changeLanguage = async (code: Language) => {
    if (code === lang) return;
    const needsRestart = await setLanguage(code);
    if (needsRestart) {
      Alert.alert(t('profile.language'), t('profile.languageRestart'), [{ text: 'OK', onPress: restartApp }]);
    }
  };

  const doSignOut = async () => {
    setBusy(true);
    try {
      await signOut();
    } finally {
      setBusy(false);
    }
  };

  const name = profile?.displayName || user?.displayName || user?.email || t('profile.guest');
  const version = Constants.expoConfig?.version ?? '1.0.0';

  const shareApp = () => {
    // Partage indisponible (certains navigateurs) : sans conséquence.
    Share.share({ message: t('profile.shareMessage') }).catch(() => undefined);
  };

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + spacing.md }}>
        <View style={styles.header}>
          <AlgeriaFlag size={60} round style={styles.avatar} />
          <View style={{ flex: 1 }}>
            <View style={styles.nameRow}>
              <AppText variant="title" numberOfLines={1} style={{ flexShrink: 1 }}>
                {isGuest ? t('profile.accountTitle') : name}
              </AppText>
              {isAdmin && (
                <View style={styles.adminBadge}>
                  <AppText variant="caption">{t('profile.adminBadge')}</AppText>
                </View>
              )}
            </View>
            <AppText variant="label" color={colors.textSecondary} numberOfLines={2}>
              {isGuest ? (available ? t('profile.guestBody') : t('auth.unavailable')) : t('profile.accountSubtitle')}
            </AppText>
          </View>
        </View>

        {isGuest && available && (
          <View style={styles.actions}>
            <Button label={t('profile.signUp')} onPress={() => router.push('/auth/register')} />
            <Button label={t('profile.signIn')} variant="secondary" onPress={() => router.push('/auth/login')} />
          </View>
        )}

        {isAdmin && (
          <ListGroup>
            <ListItem icon="shield-checkmark-outline" label={t('profile.admin')} color={colors.accent} onPress={() => router.push('/admin')} />
          </ListGroup>
        )}

        <ListGroup>
          <ListItem icon="heart-outline" label={t('profile.myFavorites')} onPress={() => router.navigate('/favorites')} />
          {!isGuest && (
            <ListItem
              icon="time-outline"
              label={t('profile.clearHistory')}
              value={String(profile?.history.length ?? 0)}
              onPress={() => clearHistory().catch(() => Alert.alert(t('common.error')))}
            />
          )}
          <ListItem icon="share-social-outline" label={t('profile.share')} onPress={shareApp} />
          <ListItem
            icon="information-circle-outline"
            label={t('profile.about')}
            value={version}
            onPress={() => Alert.alert(t('common.appName'), t('profile.version', { version }))}
          />
        </ListGroup>

        <ListGroup title={t('profile.language')}>
          {LANGUAGES.map((l) => (
            <ListItem
              key={l.code}
              icon="language-outline"
              label={l.label}
              onPress={() => changeLanguage(l.code)}
              right={l.code === lang ? <Ionicons name="checkmark-circle" size={20} color={colors.accent} /> : <View />}
            />
          ))}
        </ListGroup>

        <ListGroup title={t('profile.appearance')}>
          {THEMES.map((th) => (
            <ListItem
              key={th.mode}
              icon={th.icon}
              label={t(th.label)}
              onPress={() => setMode(th.mode)}
              right={th.mode === mode ? <Ionicons name="checkmark-circle" size={20} color={colors.accent} /> : <View />}
            />
          ))}
        </ListGroup>

        {!isGuest && (
          <ListGroup>
            <ListItem icon="log-out-outline" label={t('profile.signOut')} color={colors.danger} onPress={busy ? undefined : doSignOut} />
          </ListGroup>
        )}

        <View style={styles.footer}>
          <AlgiersSkyline style={StyleSheet.absoluteFill} />
          <View style={styles.footerText}>
            <AppText style={lang === 'ar' ? styles.footerArabic : styles.footerScript}>{t('profile.footerTitle')}</AppText>
            <View style={styles.footerLine}>
              <AppText style={lang === 'ar' ? styles.footerArabicSmall : styles.footerScriptSmall}>{t('profile.footerSubtitle')}</AppText>
              <Ionicons name="heart" size={16} color={colors.live} />
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenBackground>
  );
}

const useStyles = makeStyles((colors) => ({
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg, marginHorizontal: spacing.lg, marginBottom: spacing.xl },
  avatar: { borderWidth: 2, borderColor: 'rgba(255,255,255,0.85)', boxShadow: '0 0 18px rgba(31,203,92,0.35)' },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  adminBadge: { backgroundColor: colors.accent, borderRadius: radius.sm, paddingHorizontal: spacing.sm, paddingVertical: 2 },
  actions: { gap: spacing.sm, marginHorizontal: spacing.lg, marginBottom: spacing.xl },
  footer: { height: 170, justifyContent: 'center' },
  footerText: { paddingHorizontal: spacing.xl, transform: [{ rotate: '-4deg' }] },
  footerLine: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  footerScript: { fontFamily: fonts.script, fontSize: 32, lineHeight: 36, color: colors.text },
  footerScriptSmall: { fontFamily: fonts.script, fontSize: 20, lineHeight: 24, color: colors.text },
  footerArabic: { fontFamily: fonts.arabic.bold, fontSize: 26, lineHeight: 38, color: colors.text },
  footerArabicSmall: { fontFamily: fonts.arabic.semibold, fontSize: 16, lineHeight: 26, color: colors.text },
}));
