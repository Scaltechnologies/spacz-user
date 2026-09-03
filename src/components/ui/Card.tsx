import { StyleSheet, View, ViewProps } from 'react-native';

import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/spacing';
import { Shadow } from '@/constants/theme';

interface CardProps extends ViewProps {
  noPadding?: boolean;
}

export function Card({ style, noPadding, ...rest }: CardProps) {
  return <View style={[styles.card, noPadding ? undefined : styles.padding, style]} {...rest} />;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.card,
  },
  padding: {
    padding: Spacing.md,
  },
});
