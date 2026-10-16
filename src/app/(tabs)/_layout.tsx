import { Ionicons } from '@expo/vector-icons';
import { BottomTabBar, Tabs } from 'expo-router/js-tabs';
import { useTranslation } from 'react-i18next';
import { View, type ColorValue } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MiniPlayer } from '@/components/MiniPlayer';
import { useLocalized } from '@/i18n';
import { fonts, makeStyles, radius, spacing, useColors } from '@/theme';

type IconName = keyof typeof Ionicons.glyphMap;

/** Hauteur utile des onglets (pastille d'icône + libellé), hors zone de sécurité. */
const TAB_BAR_CONTENT_HEIGHT = 58;

/** Icône d'onglet ; l'onglet actif est posé sur une pastille verte lumineuse. */
const tabIcon = (active: IconName, inactive: IconName) =>
  function TabIcon({ color, focused }: { color: ColorValue; focused: boolean }) {
    const styles = useStyles();
    return (
      <View style={[styles.icon, focused && styles.iconActive]}>
        <Ionicons name={focused ? active : inactive} color={color} size={22} />
      </View>
    );
  };

export default function TabsLayout() {
  const { t } = useTranslation();
  const { lang } = useLocalized();
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const styles = useStyles();
  // La barre réserve la zone de la Home bar (iPhone) au lieu de l'écraser ;
  // sans zone de sécurité (Android à boutons, web), on garde un peu d'air sous les libellés.
  const bottom = Math.max(insets.bottom, spacing.sm);

  return (
    <Tabs
      // Le mini-lecteur vit dans la barre d'onglets : il reste visible sur tous les onglets.
      tabBar={(props) => (
        <View style={styles.bar}>
          <View style={{ paddingHorizontal: Math.max(insets.left, insets.right) }}>
            <MiniPlayer />
          </View>
          <BottomTabBar {...props} />
        </View>
      )}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.background },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
          height: TAB_BAR_CONTENT_HEIGHT + bottom,
          paddingBottom: bottom,
        },
        tabBarItemStyle: { paddingTop: 6 },
        tabBarLabelStyle: { fontFamily: lang === 'ar' ? fonts.arabic.medium : fonts.latin.medium, fontSize: 11, marginTop: 2 },
      }}
    >
      <Tabs.Screen name="index" options={{ title: t('tabs.home'), tabBarIcon: tabIcon('home', 'home-outline') }} />
      <Tabs.Screen name="tv" options={{ title: t('tabs.tv'), tabBarIcon: tabIcon('tv', 'tv-outline') }} />
      <Tabs.Screen name="radios" options={{ title: t('tabs.radios'), tabBarIcon: tabIcon('radio', 'radio-outline') }} />
      <Tabs.Screen name="favorites" options={{ title: t('tabs.favorites'), tabBarIcon: tabIcon('heart', 'heart-outline') }} />
      <Tabs.Screen name="profile" options={{ title: t('tabs.more'), tabBarIcon: tabIcon('grid', 'grid-outline') }} />
    </Tabs>
  );
}

const useStyles = makeStyles((colors) => ({
  bar: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingTop: 8,
  },
  icon: { width: 44, height: 30, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  iconActive: { backgroundColor: colors.accentSoft, boxShadow: '0 0 14px rgba(31,203,92,0.35)' },
}));
