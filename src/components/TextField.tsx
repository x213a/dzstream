import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { useLocalized } from '@/i18n';
import { fonts, makeStyles, radius, spacing, useTheme } from '@/theme';

import { AppText } from './AppText';

interface TextFieldProps extends TextInputProps {
  label: string;
  hint?: string;
  error?: string;
  /** Champ toujours LTR (URL, e-mail…) même quand l'interface est en arabe. */
  ltr?: boolean;
}

export function TextField({ label, hint, error, ltr, style, ...rest }: TextFieldProps) {
  const { lang, isRTL } = useLocalized();
  const { mode, colors } = useTheme();
  const styles = useStyles();
  return (
    <View style={styles.wrapper}>
      <AppText variant="label" color={colors.textSecondary}>
        {label}
      </AppText>
      <TextInput
        placeholderTextColor={colors.textMuted}
        selectionColor={colors.accent}
        keyboardAppearance={mode}
        {...rest}
        style={[
          styles.input,
          { fontFamily: lang === 'ar' && !ltr ? fonts.arabic.regular : fonts.latin.regular },
          // writingDirection n'est pas inversé automatiquement pour les champs LTR forcés.
          ltr && isRTL ? { textAlign: 'right', writingDirection: 'ltr' } : null,
          error ? styles.inputError : null,
          style,
        ]}
      />
      {error ? (
        <AppText variant="label" color={colors.danger}>
          {error}
        </AppText>
      ) : hint ? (
        <AppText variant="label" color={colors.textMuted}>
          {hint}
        </AppText>
      ) : null}
    </View>
  );
}

const useStyles = makeStyles((colors) => ({
  wrapper: { gap: spacing.xs },
  input: {
    minHeight: 48,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    color: colors.text,
    fontSize: 15,
  },
  inputError: { borderColor: colors.danger },
}));
