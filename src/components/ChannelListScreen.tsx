import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useLocalized } from '@/i18n';
import { useCatalog } from '@/providers/CatalogProvider';
import { fonts, makeStyles, radius, spacing, useTheme } from '@/theme';
import type { MediaType } from '@/types';
import { matchesQuery } from '@/utils/search';

import { ChannelRow } from './ChannelRow';
import { Chips } from './Chips';
import { EmptyState } from './EmptyState';
import { ScreenBackground, ScreenHeader } from './Screen';

/** Onglets « TV » et « Radios » : en-tête, recherche, catégories et liste en cartes. */
export function ChannelListScreen({ type }: { type: MediaType }) {
  const { t } = useTranslation();
  const { text, lang } = useLocalized();
  const insets = useSafeAreaInsets();
  const { channels, categories } = useCatalog();
  const [categoryId, setCategoryId] = useState('all');
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState('');
  const { mode, colors } = useTheme();
  const styles = useStyles();

  const ofType = useMemo(() => channels.filter((c) => c.type === type), [channels, type]);
  // Seules les catégories qui contiennent au moins une chaîne de ce type.
  const usedCategories = categories.filter((cat) => ofType.some((c) => c.categoryId === cat.id));

  const filtered = useMemo(
    () => ofType.filter((c) => (categoryId === 'all' || c.categoryId === categoryId) && matchesQuery(c, query)),
    [ofType, categoryId, query],
  );

  const toggleSearch = () => {
    if (searching) setQuery('');
    setSearching((s) => !s);
  };

  const isTv = type === 'tv';

  return (
    <ScreenBackground style={{ paddingTop: insets.top + spacing.md }}>
      <ScreenHeader
        icon={isTv ? 'tv-outline' : 'radio-outline'}
        title={isTv ? t('lists.tvTitle') : t('lists.radiosTitle')}
        subtitle={isTv ? t('lists.tvSubtitle') : t('lists.radiosSubtitle')}
        actions={[{ icon: searching ? 'close' : 'search', label: t('lists.search'), onPress: toggleSearch, active: searching }]}
      />

      {searching && (
        <View style={styles.search}>
          <Ionicons name="search" size={18} color={colors.textMuted} />
          <TextInput
            autoFocus
            value={query}
            onChangeText={setQuery}
            placeholder={t('home.searchPlaceholder')}
            placeholderTextColor={colors.textMuted}
            selectionColor={colors.accent}
            keyboardAppearance={mode}
            style={[styles.searchInput, { fontFamily: lang === 'ar' ? fonts.arabic.regular : fonts.latin.regular }]}
            returnKeyType="search"
          />
        </View>
      )}

      {usedCategories.length > 1 && (
        <View style={styles.filters}>
          <Chips
            value={categoryId}
            onChange={setCategoryId}
            options={[{ value: 'all', label: t('common.all') }, ...usedCategories.map((c) => ({ value: c.id, label: text(c.name) }))]}
          />
        </View>
      )}

      <FlatList
        data={filtered}
        keyExtractor={(c) => c.id}
        renderItem={({ item }) => <ChannelRow channel={item} />}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={filtered.length === 0 ? { flex: 1 } : { paddingBottom: spacing.lg }}
        ListEmptyComponent={<EmptyState icon="search" title={t('channels.empty')} />}
      />
    </ScreenBackground>
  );
}

const useStyles = makeStyles((colors) => ({
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: { flex: 1, minHeight: 44, color: colors.text, fontSize: 15 },
  filters: { paddingBottom: spacing.md },
}));
