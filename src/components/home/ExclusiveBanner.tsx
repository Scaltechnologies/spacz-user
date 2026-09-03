import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';

interface ExclusiveBannerProps {
  title: string;
  description: string;
}

export function ExclusiveBanner({ title, description }: ExclusiveBannerProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.primaryDark,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    gap: Spacing.xxs,
  },
  title: {
    ...Typography.h3,
    color: Colors.white,
  },
  description: {
    ...Typography.caption,
    color: 'rgba(255,255,255,0.8)',
  },
});
