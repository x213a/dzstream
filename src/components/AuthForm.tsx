import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

import { authErrorKey, useAuth } from '@/providers/AuthProvider';
import { makeStyles, spacing, useColors } from '@/theme';

import { AppText } from './AppText';
import { Button } from './Button';
import { TextField } from './TextField';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const { t } = useTranslation();
  const { signIn, signUp, available } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const isRegister = mode === 'register';
  const colors = useColors();
  const styles = useStyles();

  const submit = async () => {
    setError(null);
    if (!EMAIL_RE.test(email.trim())) return setError(t('auth.errors.invalidEmail'));
    if (password.length < 6) return setError(t('auth.errors.weakPassword'));
    setLoading(true);
    try {
      if (isRegister) await signUp(email, password, displayName);
      else await signIn(email, password);
      router.back();
    } catch (e) {
      setError(t(authErrorKey(e)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.flex} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <AppText color={colors.textSecondary}>{available ? t('auth.perks') : t('auth.unavailable')}</AppText>
        {isRegister && (
          <TextField
            label={t('auth.displayName')}
            value={displayName}
            onChangeText={setDisplayName}
            autoComplete="name"
            textContentType="name"
          />
        )}
        <TextField
          label={t('auth.email')}
          value={email}
          onChangeText={setEmail}
          ltr
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          textContentType="emailAddress"
        />
        <TextField
          label={t('auth.password')}
          value={password}
          onChangeText={setPassword}
          ltr
          secureTextEntry
          autoComplete={isRegister ? 'new-password' : 'current-password'}
          textContentType={isRegister ? 'newPassword' : 'password'}
          onSubmitEditing={submit}
        />
        {error && <AppText color={colors.danger}>{error}</AppText>}
        <Button
          label={isRegister ? t('auth.submitRegister') : t('auth.submitLogin')}
          onPress={submit}
          loading={loading}
          disabled={!available}
          style={styles.submit}
        />
        <Button
          variant="ghost"
          label={isRegister ? t('auth.hasAccount') : t('auth.noAccount')}
          onPress={() => router.replace(isRegister ? '/auth/login' : '/auth/register')}
        />
        <Button variant="ghost" label={t('auth.continueAsGuest')} onPress={() => router.back()} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const useStyles = makeStyles((colors) => ({
  flex: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, gap: spacing.lg },
  submit: { marginTop: spacing.sm },
}));
