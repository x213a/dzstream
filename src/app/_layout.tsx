import { Cairo_400Regular, Cairo_500Medium, Cairo_600SemiBold, Cairo_800ExtraBold } from '@expo-google-fonts/cairo';
import { DancingScript_700Bold } from '@expo-google-fonts/dancing-script';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_800ExtraBold } from '@expo-google-fonts/inter';
import { useFonts } from 'expo-font';
import { Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { initI18n } from '@/i18n';
import { AuthProvider } from '@/providers/AuthProvider';
import { CatalogProvider } from '@/providers/CatalogProvider';
import { PlayerProvider } from '@/providers/PlayerProvider';
import { colors, navigationTheme } from '@/theme';

SplashScreen.preventAutoHideAsync().catch(() => undefined);

export default function RootLayout() {
  const [i18nReady, setI18nReady] = useState(false);
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_800ExtraBold,
    Cairo_400Regular,
    Cairo_500Medium,
    Cairo_600SemiBold,
    Cairo_800ExtraBold,
    DancingScript_700Bold,
  });

  useEffect(() => {
    initI18n()
      .catch((e) => console.warn('[i18n]', e))
      .finally(() => setI18nReady(true));
  }, []);

  const ready = i18nReady && (fontsLoaded || !!fontError);

  useEffect(() => {
    if (ready) SplashScreen.hideAsync().catch(() => undefined);
  }, [ready]);

  if (!ready) return <View style={{ flex: 1, backgroundColor: colors.background }} />;

  return (
    <SafeAreaProvider style={{ backgroundColor: colors.background }}>
      <ThemeProvider value={navigationTheme}>
        <AuthProvider>
          <CatalogProvider>
            <PlayerProvider>
              <StatusBar style="light" />
              <RootStack />
            </PlayerProvider>
          </CatalogProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

function RootStack() {
  const { t } = useTranslation();
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
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="channel/[id]" options={{ headerShown: false }} />
      <Stack.Screen
        name="player/[id]"
        options={{ headerShown: false, presentation: 'fullScreenModal', animation: 'fade', orientation: 'all' }}
      />
      <Stack.Screen name="auth/login" options={{ presentation: 'modal', title: t('auth.loginTitle') }} />
      <Stack.Screen name="auth/register" options={{ presentation: 'modal', title: t('auth.registerTitle') }} />
      <Stack.Screen name="admin" options={{ headerShown: false }} />
    </Stack>
  );
}
