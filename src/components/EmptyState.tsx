import { Ionicons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, spacing } from '@/theme';

import { AppText } from './AppText';

interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  body?: string;
  children?: ReactNode;
}

export function EmptyState({ icon, title, body, children }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Ionicons name={icon} size={32} color={colors.accent} />
      </View>
      <AppText variant="title" center>
        {title}
      </AppText>
      {body && (
        <AppText color={colors.textSecondary} center>
          {body}
        </AppText>
      )}
      {children && <View style={styles.actions}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xxl, gap: spacing.md },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  actions: { alignSelf: 'stretch', gap: spacing.sm, marginTop: spacing.lg },
});
