import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, ScrollView, Switch, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Chips } from '@/components/Chips';
import { TextField } from '@/components/TextField';
import { useLocalized } from '@/i18n';
import { useCatalog } from '@/providers/CatalogProvider';
import { deleteChannel, saveChannel } from '@/services/catalog';
import { isFirebaseConfigured } from '@/services/firebase';
import { makeStyles, spacing, useColors } from '@/theme';
import type { Channel, MediaType } from '@/types';
import { Alert } from '@/utils/alert';

const ID_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const URL_RE = /^https?:\/\/\S+$/i;

const slugify = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

type Errors = Partial<Record<'id' | 'name' | 'streamUrl' | 'logoUrl' | 'categoryId', string>>;

/** Vérifie qu'un flux répond (requête partielle pour ne pas télécharger le direct). */
async function probeStream(url: string): Promise<number> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(url, { headers: { Range: 'bytes=0-2047' }, signal: controller.signal });
    return res.status;
  } catch {
    return 0;
  } finally {
    clearTimeout(timer);
  }
}

export default function AdminChannelScreen() {
  const params = useLocalSearchParams<{ id: string; type?: MediaType }>();
  const { t } = useTranslation();
  const { text } = useLocalized();
  const { allChannels, categories } = useCatalog();
  const existing = allChannels.find((c) => c.id === params.id);
  const isNew = params.id === 'new' || !existing;

  const [form, setForm] = useState<Channel>(
    () =>
      existing ?? {
        id: '',
        name: '',
        type: params.type === 'radio' ? 'radio' : 'tv',
        streamUrl: '',
        categoryId: '',
        order: allChannels.length,
        isActive: true,
      },
  );
  const [idTouched, setIdTouched] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const colors = useColors();
  const styles = useStyles();

  const set = <K extends keyof Channel>(key: K, value: Channel[K]) => setForm((f) => ({ ...f, [key]: value }));
  const setDescription = (lang: 'fr' | 'ar' | 'en', value: string) =>
    setForm((f) => ({ ...f, description: { fr: '', ...f.description, [lang]: value } }));

  const typeCategories = categories.filter((c) => c.type === 'both' || c.type === form.type);

  const validate = (): boolean => {
    const next: Errors = {};
    if (!form.name.trim()) next.name = t('admin.validation.nameRequired');
    if (isNew && !ID_RE.test(form.id)) next.id = t('admin.validation.idInvalid');
    else if (isNew && allChannels.some((c) => c.id === form.id)) next.id = t('admin.validation.idTaken');
    if (form.streamUrl && !URL_RE.test(form.streamUrl.trim())) next.streamUrl = t('admin.validation.urlInvalid');
    if (form.isActive && !form.streamUrl.trim()) next.streamUrl = t('admin.validation.urlRequired');
    if (form.logoUrl && !URL_RE.test(form.logoUrl.trim())) next.logoUrl = t('admin.validation.urlInvalid');
    if (!form.categoryId) next.categoryId = t('admin.validation.categoryRequired');
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const save = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const description = form.description?.fr || form.description?.ar || form.description?.en ? form.description : undefined;
      await saveChannel({
        ...form,
        name: form.name.trim(),
        nameAr: form.nameAr?.trim() || undefined,
        streamUrl: form.streamUrl.trim(),
        logoUrl: form.logoUrl?.trim() || undefined,
        description,
      });
      router.back();
    } catch (e) {
      Alert.alert(t('common.error'), String(e));
    } finally {
      setSaving(false);
    }
  };

  const remove = () =>
    Alert.alert(t('common.delete'), t('admin.deleteConfirm', { name: form.name }), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteChannel(form.id);
            router.back();
          } catch (e) {
            Alert.alert(t('common.error'), String(e));
          }
        },
      },
    ]);

  const test = async () => {
    const url = form.streamUrl.trim();
    if (!URL_RE.test(url)) return setErrors((e) => ({ ...e, streamUrl: t('admin.validation.urlInvalid') }));
    setTesting(true);
    const status = await probeStream(url);
    setTesting(false);
    Alert.alert(t('admin.testStream'), status >= 200 && status < 400 ? t('admin.testOk') : t('admin.testFail', { code: status }));
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Stack.Screen options={{ title: isNew ? t('admin.newChannel') : t('admin.editChannel') }} />
      <ScrollView style={styles.flex} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {!isFirebaseConfigured && <AppText color={colors.danger}>{t('admin.readOnly')}</AppText>}

        <View style={styles.field}>
          <AppText variant="label" color={colors.textSecondary}>
            {t('admin.fields.type')}
          </AppText>
          <View style={styles.chipRow}>
            <Chips<MediaType>
              scroll={false}
              value={form.type}
              onChange={(v) => setForm((f) => ({ ...f, type: v, categoryId: '' }))}
              options={[
                { value: 'tv', label: t('common.tv') },
                { value: 'radio', label: t('common.radio') },
              ]}
            />
          </View>
        </View>

        <TextField
          label={t('admin.fields.name')}
          value={form.name}
          error={errors.name}
          onChangeText={(v) => setForm((f) => ({ ...f, name: v, id: isNew && !idTouched ? slugify(v) : f.id }))}
        />
        <TextField
          label={t('admin.fields.id')}
          value={form.id}
          error={errors.id}
          editable={isNew}
          ltr
          autoCapitalize="none"
          onChangeText={(v) => {
            setIdTouched(true);
            set('id', v);
          }}
        />
        <TextField label={t('admin.fields.nameAr')} value={form.nameAr ?? ''} onChangeText={(v) => set('nameAr', v)} />
        <TextField
          label={t('admin.fields.streamUrl')}
          hint={t('admin.fields.streamUrlHint')}
          value={form.streamUrl}
          error={errors.streamUrl}
          onChangeText={(v) => set('streamUrl', v)}
          ltr
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
        />
        <Button label={t('admin.testStream')} variant="secondary" icon="pulse" onPress={test} loading={testing} />
        <TextField
          label={t('admin.fields.logoUrl')}
          value={form.logoUrl ?? ''}
          error={errors.logoUrl}
          onChangeText={(v) => set('logoUrl', v)}
          ltr
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
        />

        <View style={styles.field}>
          <AppText variant="label" color={colors.textSecondary}>
            {t('admin.fields.category')}
          </AppText>
          <View style={styles.chipRow}>
            <Chips
              scroll={false}
              value={form.categoryId}
              onChange={(v) => set('categoryId', v)}
              options={typeCategories.map((c) => ({ value: c.id, label: text(c.name) }))}
            />
          </View>
          {errors.categoryId && (
            <AppText variant="label" color={colors.danger}>
              {errors.categoryId}
            </AppText>
          )}
        </View>

        <TextField
          label={t('admin.fields.order')}
          value={String(form.order)}
          onChangeText={(v) => set('order', Number.parseInt(v.replace(/\D/g, '') || '0', 10))}
          keyboardType="number-pad"
          ltr
        />

        <View style={styles.switchRow}>
          <AppText style={{ flex: 1 }}>{t('admin.fields.active')}</AppText>
          <Switch
            value={form.isActive}
            onValueChange={(v) => set('isActive', v)}
            trackColor={{ true: colors.accent, false: colors.surfaceRaised }}
          />
        </View>

        <TextField label={t('admin.fields.descriptionFr')} value={form.description?.fr ?? ''} onChangeText={(v) => setDescription('fr', v)} multiline />
        <TextField label={t('admin.fields.descriptionAr')} value={form.description?.ar ?? ''} onChangeText={(v) => setDescription('ar', v)} multiline />
        <TextField label={t('admin.fields.descriptionEn')} value={form.description?.en ?? ''} onChangeText={(v) => setDescription('en', v)} multiline />

        <Button label={t('common.save')} icon="checkmark" onPress={save} loading={saving} disabled={!isFirebaseConfigured} />
        {!isNew && <Button label={t('common.delete')} variant="danger" icon="trash-outline" onPress={remove} disabled={!isFirebaseConfigured} />}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const useStyles = makeStyles((colors) => ({
  flex: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxl },
  field: { gap: spacing.sm },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
}));
