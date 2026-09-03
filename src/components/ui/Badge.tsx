import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';

export type BadgeTone = 'primary' | 'success' | 'warning' | 'error' | 'neutral';

interface BadgeProps {
  label: string;
  tone?: BadgeTone;
}

const toneStyles: Record<BadgeTone, { background: string; text: string }> = {
  primary: { background: Colors.primary, text: Colors.white },
  success: { background: Colors.success, text: Colors.white },
  warning: { background: Colors.warning, text: Colors.white },
  error: { background: Colors.error, text: Colors.white },
  neutral: { background: Colors.surfaceAlt, text: Colors.textSecondary },
};

export function Badge({ label, tone = 'neutral' }: BadgeProps) {
  const colors = toneStyles[tone];
  return (
    <View style={[styles.badge, { backgroundColor: colors.background }]}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.xs,
    paddingVertical: 4,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
  },
  label: {
    ...Typography.small,
    fontWeight: '700',
  },
});
