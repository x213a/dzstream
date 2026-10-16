import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Chips } from '@/components/Chips';
import { TextField } from '@/components/TextField';
import { useLocalized } from '@/i18n';
import { useCatalog } from '@/providers/CatalogProvider';
import { deleteCategory, saveCategory } from '@/services/catalog';
import { isFirebaseConfigured } from '@/services/firebase';
import { makeStyles, radius, spacing, useColors } from '@/theme';
import type { Category } from '@/types';
import { Alert } from '@/utils/alert';

const ID_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const EMPTY: Category = { id: '', name: { fr: '' }, type: 'both', order: 0 };

export default function AdminCategoriesScreen() {
  const { t } = useTranslation();
  const { text } = useLocalized();
  const { categories, allChannels } = useCatalog();
  /** Catégorie en cours d'édition ; `isNew` distingue création et modification. */
  const [editing, setEditing] = useState<{ value: Category; isNew: boolean } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const colors = useColors();
  const styles = useStyles();

  const startNew = () => {
    setError(null);
    setEditing({ value: { ...EMPTY, order: categories.length }, isNew: true });
  };

  const update = (patch: Partial<Category>) => setEditing((e) => (e ? { ...e, value: { ...e.value, ...patch } } : e));
  const updateName = (lang: 'fr' | 'ar' | 'en', v: string) =>
    setEditing((e) => (e ? { ...e, value: { ...e.value, name: { ...e.value.name, [lang]: v } } } : e));

  const save = async () => {
    if (!editing) return;
    const { value, isNew } = editing;
    if (!value.name.fr.trim()) return setError(t('admin.validation.nameRequired'));
    if (isNew && !ID_RE.test(value.id)) return setError(t('admin.validation.idInvalid'));
    if (isNew && categories.some((c) => c.id === value.id)) return setError(t('admin.validation.idTaken'));
    setSaving(true);
    try {
      await saveCategory(value);
      setEditing(null);
    } catch (e) {
      setError(String(e));
    } finally {
      setSaving(false);
    }
  };

  const remove = (category: Category) => {
    if (allChannels.some((c) => c.categoryId === category.id)) {
      return Alert.alert(t('common.delete'), t('admin.validation.categoryInUse'));
    }
    Alert.alert(t('common.delete'), t('admin.deleteConfirm', { name: text(category.name) }), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: () => deleteCategory(category.id).catch((e) => Alert.alert(t('common.error'), String(e))),
      },
    ]);
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.flex} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {!isFirebaseConfigured && <AppText color={colors.danger}>{t('admin.readOnly')}</AppText>}

        {categories.map((cat) => (
          <View key={cat.id} style={styles.row}>
            <Pressable
              style={{ flex: 1 }}
              onPress={() => {
                setError(null);
                setEditing({ value: cat, isNew: false });
              }}
            >
              <AppText variant="heading">{text(cat.name)}</AppText>
              <AppText variant="label" color={colors.textMuted}>
                {cat.id} · {cat.type === 'both' ? t('admin.typeBoth') : t(cat.type === 'tv' ? 'common.tv' : 'common.radio')} ·{' '}
                {allChannels.filter((c) => c.categoryId === cat.id).length}
              </AppText>
            </Pressable>
            <Pressable onPress={() => remove(cat)} hitSlop={8} accessibilityRole="button" accessibilityLabel={t('common.delete')}>
              <Ionicons name="trash-outline" size={20} color={colors.danger} />
            </Pressable>
          </View>
        ))}

        {editing ? (
          <View style={styles.editor}>
            <AppText variant="heading">{editing.isNew ? t('admin.newCategory') : t('common.edit')}</AppText>
            <TextField
              label={t('admin.fields.id')}
              value={editing.value.id}
              editable={editing.isNew}
              ltr
              autoCapitalize="none"
              onChangeText={(v) => update({ id: v })}
            />
            <TextField label={t('admin.fields.nameFr')} value={editing.value.name.fr} onChangeText={(v) => updateName('fr', v)} />
            <TextField label={t('admin.fields.nameAr')} value={editing.value.name.ar ?? ''} onChangeText={(v) => updateName('ar', v)} />
            <TextField label={t('admin.fields.nameEn')} value={editing.value.name.en ?? ''} onChangeText={(v) => updateName('en', v)} />
            <View style={styles.chipRow}>
              <Chips<Category['type']>
                scroll={false}
                value={editing.value.type}
                onChange={(v) => update({ type: v })}
                options={[
                  { value: 'both', label: t('admin.typeBoth') },
                  { value: 'tv', label: t('common.tv') },
                  { value: 'radio', label: t('common.radio') },
                ]}
              />
            </View>
            <TextField
              label={t('admin.fields.order')}
              value={String(editing.value.order)}
              keyboardType="number-pad"
              ltr
              onChangeText={(v) => update({ order: Number.parseInt(v.replace(/\D/g, '') || '0', 10) })}
            />
            {error && <AppText color={colors.danger}>{error}</AppText>}
            <View style={styles.actions}>
              <Button label={t('common.cancel')} variant="secondary" onPress={() => setEditing(null)} style={{ flex: 1 }} />
              <Button label={t('common.save')} onPress={save} loading={saving} disabled={!isFirebaseConfigured} style={{ flex: 1 }} />
            </View>
          </View>
        ) : (
          <Button label={t('admin.newCategory')} icon="add" variant="secondary" onPress={startNew} />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const useStyles = makeStyles((colors) => ({
  flex: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, gap: spacing.sm, paddingBottom: spacing.xxl },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  editor: { gap: spacing.md, padding: spacing.lg, marginTop: spacing.md, borderRadius: radius.lg, backgroundColor: colors.surface },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  actions: { flexDirection: 'row', gap: spacing.sm },
}));
