import { Ionicons } from '@expo/vector-icons';
import { BottomTabBar, Tabs } from 'expo-router/js-tabs';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View, type ColorValue } from 'react-native';

import { MiniPlayer } from '@/components/MiniPlayer';
import { useLocalized } from '@/i18n';
import { colors, fonts, radius } from '@/theme';

type IconName = keyof typeof Ionicons.glyphMap;

/** Icône d'onglet ; l'onglet actif est posé sur une pastille verte lumineuse. */
const tabIcon = (active: IconName, inactive: IconName) =>
  function TabIcon({ color, focused }: { color: ColorValue; focused: boolean }) {
    return (
      <View style={[styles.icon, focused && styles.iconActive]}>
        <Ionicons name={focused ? active : inactive} color={color} size={22} />
      </View>
    );
  };

export default function TabsLayout() {
  const { t } = useTranslation();
  const { lang } = useLocalized();

  return (
    <Tabs
      // Le mini-lecteur vit dans la barre d'onglets : il reste visible sur tous les onglets.
      tabBar={(props) => (
        <View style={styles.bar}>
          <MiniPlayer />
          <BottomTabBar {...props} />
        </View>
      )}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.background },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: { backgroundColor: 'transparent', borderTopWidth: 0, elevation: 0, height: 64 },
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

const styles = StyleSheet.create({
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
});
