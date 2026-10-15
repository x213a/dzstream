import AsyncStorage from '@react-native-async-storage/async-storage';
import { createInstance } from 'i18next';
import { useCallback } from 'react';
import { initReactI18next, useTranslation } from 'react-i18next';
import { I18nManager, Platform } from 'react-native';

import type { Channel, Language, LocalizedText } from '@/types';

import ar from './locales/ar';
import en from './locales/en';
import fr from './locales/fr';

export const DEFAULT_LANGUAGE: Language = 'fr';

export const LANGUAGES: { code: Language; label: string; rtl: boolean }[] = [
  { code: 'fr', label: 'Français', rtl: false },
  { code: 'ar', label: 'العربية', rtl: true },
  { code: 'en', label: 'English', rtl: false },
];

const STORAGE_KEY = 'dzstream.language';

// Instance dédiée, branchée sur react-i18next lors de `initI18n()`.
const i18n = createInstance();

export const resources = {
  fr: { translation: fr },
  ar: { translation: ar },
  en: { translation: en },
} as const;

export const isRTLLanguage = (lang: string) => LANGUAGES.find((l) => l.code === lang)?.rtl ?? false;

const isLanguage = (value: unknown): value is Language =>
  typeof value === 'string' && LANGUAGES.some((l) => l.code === value);

/** Charge la langue enregistrée (français par défaut) puis initialise i18next. */
export async function initI18n(): Promise<void> {
  let stored: string | null = null;
  try {
    stored = await AsyncStorage.getItem(STORAGE_KEY);
  } catch {
    // Stockage indisponible : on reste sur la langue par défaut.
  }
  const lng = isLanguage(stored) ? stored : DEFAULT_LANGUAGE;

  await i18n.use(initReactI18next).init({
    resources,
    lng,
    fallbackLng: DEFAULT_LANGUAGE,
    interpolation: { escapeValue: false },
    returnNull: false,
  });

  // Le sens de lecture natif est figé au démarrage : on aligne la préférence pour
  // le prochain lancement si elle diverge (ex. stockage restauré).
  syncNativeDirection(lng);
}

function syncNativeDirection(lng: Language): boolean {
  if (Platform.OS === 'web') return false;
  const rtl = isRTLLanguage(lng);
  if (I18nManager.isRTL === rtl) return false;
  I18nManager.allowRTL(rtl);
  I18nManager.forceRTL(rtl);
  return true;
}

/**
 * Change la langue et la mémorise. Retourne `true` si un redémarrage est
 * nécessaire pour basculer entre LTR et RTL.
 */
export async function setLanguage(lng: Language): Promise<boolean> {
  await i18n.changeLanguage(lng);
  try {
    await AsyncStorage.setItem(STORAGE_KEY, lng);
  } catch {
    // Non bloquant : la langue s'applique pour la session en cours.
  }
  return syncNativeDirection(lng);
}

/** Traductions des données du catalogue (noms de catégories, descriptions…). */
export function useLocalized() {
  const { i18n: instance } = useTranslation();
  const lang = (isLanguage(instance.language) ? instance.language : DEFAULT_LANGUAGE) as Language;

  const text = useCallback((value?: LocalizedText) => (value ? value[lang] || value.fr : ''), [lang]);
  const channelName = useCallback(
    (channel: Pick<Channel, 'name' | 'nameAr'>) => (lang === 'ar' && channel.nameAr ? channel.nameAr : channel.name),
    [lang],
  );

  return { lang, isRTL: isRTLLanguage(lang), text, channelName };
}

export default i18n;
