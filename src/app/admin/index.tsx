import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { ChannelLogo } from '@/components/ChannelLogo';
import { Chips } from '@/components/Chips';
import { useLocalized } from '@/i18n';
import { useCatalog } from '@/providers/CatalogProvider';
import { importSeedCatalog } from '@/services/catalog';
import { colors, radius, spacing } from '@/theme';
import type { Channel, MediaType } from '@/types';
import { Alert } from '@/utils/alert';

export default function AdminHomeScreen() {
  const { t } = useTranslation();
  const { allChannels, getCategory } = useCatalog();
  const { text, isRTL } = useLocalized();
  const [type, setType] = useState<MediaType>('tv');
  const [importing, setImporting] = useState(false);

  const list = allChannels.filter((c) => c.type === type);

  const importSeed = () =>
    Alert.alert(t('admin.importSeed'), t('admin.importSeedConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: 'OK',
        onPress: async () => {
          setImporting(true);
          try {
            await importSeedCatalog();
            Alert.alert(t('admin.importDone'));
          } catch (e) {
            Alert.alert(t('common.error'), String(e));
          } finally {
            setImporting(false);
          }
        },
      },
    ]);

  const renderItem = ({ item }: { item: Channel }) => (
    <Pressable
      onPress={() => router.push({ pathname: '/admin/channel/[id]', params: { id: item.id } })}
      style={({ pressed }) => [styles.row, pressed && { backgroundColor: colors.surfacePressed }]}
    >
      <ChannelLogo channel={item} logoSize={28} style={styles.logo} />
      <View style={{ flex: 1 }}>
        <AppText variant="heading" numberOfLines={1}>
          {item.name}
        </AppText>
        <AppText variant="label" color={colors.textMuted} numberOfLines={1}>
          {text(getCategory(item.categoryId)?.name) || item.categoryId} · {item.streamUrl || '—'}
        </AppText>
      </View>
      <View style={[styles.dot, { backgroundColor: item.isActive && item.streamUrl ? colors.accent : colors.danger }]} />
      <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={18} color={colors.textMuted} />
    </Pressable>
  );

  return (
    <FlatList
      style={{ backgroundColor: colors.background }}
      data={list}
      keyExtractor={(c) => c.id}
      renderItem={renderItem}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      contentContainerStyle={{ paddingBottom: spacing.xxl }}
      ListHeaderComponent={
        <View style={styles.header}>
          <View style={styles.actions}>
            <Button
              label={t('admin.newChannel')}
              icon="add"
              onPress={() => router.push({ pathname: '/admin/channel/[id]', params: { id: 'new', type } })}
              style={{ flex: 1 }}
            />
            <Button label={t('admin.categories')} variant="secondary" icon="pricetags-outline" onPress={() => router.push('/admin/categories')} />
          </View>
          <Button label={t('admin.importSeed')} variant="ghost" icon="cloud-upload-outline" onPress={importSeed} loading={importing} />
          <View style={styles.filter}>
            <Chips
              value={type}
              onChange={setType}
              scroll={false}
              options={[
                { value: 'tv', label: `${t('common.tv')} (${allChannels.filter((c) => c.type === 'tv').length})` },
                { value: 'radio', label: `${t('common.radio')} (${allChannels.filter((c) => c.type === 'radio').length})` },
              ]}
            />
          </View>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  header: { padding: spacing.lg, gap: spacing.md },
  actions: { flexDirection: 'row', gap: spacing.sm },
  filter: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  logo: { width: 44, height: 44, borderRadius: radius.sm },
  dot: { width: 8, height: 8, borderRadius: 4 },
  separator: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border, marginStart: 76 },
});
