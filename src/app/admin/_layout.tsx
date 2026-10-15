import { Redirect, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, View } from 'react-native';

import { useAuth } from '@/providers/AuthProvider';
import { colors } from '@/theme';

/**
 * Garde d'accès du panneau d'administration.
 * Côté client, on masque l'accès aux non-admins ; côté serveur, les règles
 * Firestore (firestore.rules) refusent toute écriture du catalogue sans rôle admin.
 */
export default function AdminLayout() {
  const { t } = useTranslation();
  const { initializing, user, profile, isAdmin } = useAuth();

  // On attend le profil Firestore avant de décider (le rôle y est stocké).
  if (initializing || (user && !profile)) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }
  if (!isAdmin) return <Redirect href="/" />;

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerShadowVisible: false,
        headerBackButtonDisplayMode: 'minimal',
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="index" options={{ title: t('admin.title') }} />
      <Stack.Screen name="channel/[id]" options={{ title: t('admin.editChannel') }} />
      <Stack.Screen name="categories" options={{ title: t('admin.categories') }} />
    </Stack>
  );
}
