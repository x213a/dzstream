import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { ChannelTile } from '@/components/ChannelTile';
import { EmptyState } from '@/components/EmptyState';
import { ScreenBackground, ScreenHeader } from '@/components/Screen';
import { useAuth } from '@/providers/AuthProvider';
import { useCatalog } from '@/providers/CatalogProvider';
import { colors, radius, spacing } from '@/theme';
import type { Channel, MediaType } from '@/types';
import { Alert } from '@/utils/alert';

export default function FavoritesScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { isGuest, profile, available, toggleFavorite } = useAuth();
  const { getChannel } = useCatalog();
  const [type, setType] = useState<MediaType>('tv');

  const favorites = (profile?.favorites ?? []).map(getChannel).filter((c): c is Channel => !!c);
  const shown = favorites.filter((c) => c.type === type);
  // Deux colonnes, marges latérales et gouttière comprises (largeur bornée sur tablette / web).
  const tileWidth = Math.floor((Math.min(width, 600) - spacing.lg * 2 - spacing.md) / 2);

  const remove = (channel: Channel) => toggleFavorite(channel.id).catch(() => Alert.alert(t('common.error')));

  return (
    <ScreenBackground style={{ paddingTop: insets.top + spacing.md }}>
      <ScreenHeader icon="heart-outline" title={t('favorites.title')} subtitle={t('favorites.subtitle')} />

      {isGuest ? (
        <EmptyState icon="heart-outline" title={t('favorites.guestTitle')} body={available ? t('favorites.guestBody') : t('auth.unavailable')}>
          {available && (
            <>
              <Button label={t('profile.signUp')} onPress={() => router.push('/auth/register')} />
              <Button label={t('profile.signIn')} variant="secondary" onPress={() => router.push('/auth/login')} />
            </>
          )}
        </EmptyState>
      ) : (
        <>
          <View style={styles.segment}>
            {(['tv', 'radio'] as const).map((value) => {
              const selected = value === type;
              return (
                <Pressable
                  key={value}
                  onPress={() => setType(value)}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  style={[styles.segmentItem, selected && styles.segmentSelected]}
                >
                  <AppText variant="heading" color={selected ? colors.text : colors.textSecondary}>
                    {value === 'tv' ? t('common.tv') : t('tabs.radios')}
                  </AppText>
                </Pressable>
              );
            })}
          </View>

          <FlatList
            key={type}
            data={shown}
            numColumns={2}
            keyExtractor={(c) => c.id}
            renderItem={({ item }) => <ChannelTile channel={item} width={tileWidth} onRemoveFavorite={() => remove(item)} />}
            columnWrapperStyle={styles.columns}
            contentContainerStyle={shown.length === 0 ? { flex: 1 } : styles.grid}
            ListEmptyComponent={
              <EmptyState icon="heart-outline" title={type === 'tv' ? t('favorites.emptyTv') : t('favorites.emptyRadio')} body={t('favorites.empty')} />
            }
          />
        </>
      )}
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  segment: { flexDirection: 'row', gap: spacing.md, marginHorizontal: spacing.lg, marginBottom: spacing.lg },
  segmentItem: {
    flex: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  segmentSelected: { backgroundColor: colors.accent, borderColor: colors.accent, boxShadow: '0 0 16px rgba(31,203,92,0.45)' },
  grid: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg, gap: spacing.md },
  columns: { gap: spacing.md },
});
