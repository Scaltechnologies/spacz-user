import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';

interface HomeHeaderProps {
  name: string;
}

export function HomeHeader({ name }: HomeHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>SPACZ</Text>
      <Text style={styles.greeting}>Hey! 👋</Text>
      <Text style={styles.name}>{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 2,
    marginBottom: Spacing.lg,
  },
  logo: {
    ...Typography.captionBold,
    color: Colors.primary,
    letterSpacing: 2,
    marginBottom: Spacing.sm,
  },
  greeting: {
    ...Typography.h2,
    color: Colors.text,
  },
  name: {
    ...Typography.h1,
    color: Colors.text,
  },
});
