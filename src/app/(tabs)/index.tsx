import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AlgeriaFlag } from '@/components/AlgeriaFlag';
import { AppText } from '@/components/AppText';
import { Carousel } from '@/components/Carousel';
import { ChannelRow } from '@/components/ChannelRow';
import { Chips } from '@/components/Chips';
import { EmptyState } from '@/components/EmptyState';
import { HeroBanner } from '@/components/HeroBanner';
import { ScreenBackground } from '@/components/Screen';
import { useLocalized } from '@/i18n';
import { useAuth } from '@/providers/AuthProvider';
import { useCatalog } from '@/providers/CatalogProvider';
import { isFirebaseConfigured } from '@/services/firebase';
import { colors, fonts, radius, spacing } from '@/theme';
import type { Channel, MediaType } from '@/types';
import { matchesQuery } from '@/utils/search';

type Filter = 'all' | MediaType | 'favorites';

export default function HomeScreen() {
  const { t } = useTranslation();
  const { text, lang } = useLocalized();
  const insets = useSafeAreaInsets();
  const { channels, categories, loading, getChannel } = useCatalog();
  const { profile } = useAuth();
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');

  const data = useMemo(() => {
    const resolve = (ids: string[]) => ids.map(getChannel).filter((c): c is Channel => !!c);
    // Rangées par catégorie, pour les filtres TV / Radio.
    const railsOf = (type: MediaType) =>
      categories
        .map((cat) => ({ id: cat.id, title: text(cat.name), channels: channels.filter((c) => c.type === type && c.categoryId === cat.id) }))
        .filter((r) => r.channels.length > 0);
    return {
      tv: channels.filter((c) => c.type === 'tv'),
      radio: channels.filter((c) => c.type === 'radio'),
      tvRails: railsOf('tv'),
      radioRails: railsOf('radio'),
      favorites: resolve(profile?.favorites ?? []),
      // Dédoublonné : l'historique peut contenir plusieurs écoutes d'une même chaîne.
      recent: resolve([...new Set((profile?.history ?? []).map((h) => h.channelId))]),
    };
  }, [channels, categories, getChannel, profile, text]);

  const results = useMemo(() => (query.trim() ? channels.filter((c) => matchesQuery(c, query)) : []), [channels, query]);

  if (loading) {
    return (
      <ScreenBackground style={styles.center}>
        <ActivityIndicator color={colors.accent} />
      </ScreenBackground>
    );
  }

  const seeAll = t('home.seeAll');

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + spacing.md, paddingBottom: spacing.xl }} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <AlgeriaFlag size={56} round style={styles.flag} />
          <View style={{ flex: 1 }}>
            <AppText variant="title" numberOfLines={1}>
              {t('home.title')}
            </AppText>
            <AppText variant="heading" numberOfLines={1}>
              {t('home.country')}
            </AppText>
            <AppText variant="caption" weight="regular" color={colors.textSecondary} numberOfLines={1}>
              {t('home.tagline')}
            </AppText>
          </View>
        </View>

        {!isFirebaseConfigured && (
          <AppText variant="label" color={colors.textSecondary} style={styles.demo}>
            {t('common.demoMode')}
          </AppText>
        )}

        <View style={styles.search}>
          <Ionicons name="search" size={18} color={colors.textSecondary} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={t('home.searchPlaceholder')}
            placeholderTextColor={colors.textMuted}
            selectionColor={colors.accent}
            style={[styles.searchInput, { fontFamily: lang === 'ar' ? fonts.arabic.regular : fonts.latin.regular }]}
            returnKeyType="search"
          />
          {query.length > 0 && <Ionicons name="close-circle" size={18} color={colors.textMuted} onPress={() => setQuery('')} />}
        </View>

        {query.trim() ? (
          results.length > 0 ? (
            results.map((c) => <ChannelRow key={c.id} channel={c} />)
          ) : (
            <EmptyState icon="search" title={t('home.noResults')} />
          )
        ) : (
          <>
            <HeroBanner />

            <View style={styles.filters}>
              <Chips
                value={filter}
                onChange={setFilter}
                options={[
                  { value: 'all', label: t('common.all') },
                  { value: 'tv', label: t('common.tv'), icon: 'tv-outline' },
                  { value: 'radio', label: t('common.radio'), icon: 'radio-outline' },
                  { value: 'favorites', label: t('tabs.favorites'), icon: 'star' },
                ]}
              />
            </View>

            {filter === 'all' && (
              <>
                <Carousel title={t('home.favorites')} channels={data.favorites} onSeeAll={() => router.navigate('/favorites')} seeAllLabel={seeAll} />
                <Carousel title={t('home.recent')} channels={data.recent} />
                <Carousel title={t('home.tvSection')} channels={data.tv} onSeeAll={() => router.navigate('/tv')} seeAllLabel={seeAll} />
                <Carousel title={t('home.radioSection')} channels={data.radio} onSeeAll={() => router.navigate('/radios')} seeAllLabel={seeAll} />
              </>
            )}
            {filter === 'tv' && data.tvRails.map((r) => <Carousel key={r.id} title={r.title} channels={r.channels} />)}
            {filter === 'radio' && data.radioRails.map((r) => <Carousel key={r.id} title={r.title} channels={r.channels} />)}
            {filter === 'favorites' &&
              (data.favorites.length > 0 ? (
                <>
                  <Carousel title={t('home.tvSection')} channels={data.favorites.filter((c) => c.type === 'tv')} />
                  <Carousel title={t('home.radioSection')} channels={data.favorites.filter((c) => c.type === 'radio')} />
                </>
              ) : (
                <EmptyState icon="heart-outline" title={t('favorites.title')} body={t('favorites.empty')} />
              ))}
          </>
        )}
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.lg, marginBottom: spacing.lg },
  flag: { borderWidth: 2, borderColor: 'rgba(255,255,255,0.85)', boxShadow: '0 0 18px rgba(31,203,92,0.35)' },
  demo: { marginHorizontal: spacing.lg, marginBottom: spacing.md },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  searchInput: { flex: 1, minHeight: 46, color: colors.text, fontSize: 15 },
  filters: { marginBottom: spacing.xl },
});
