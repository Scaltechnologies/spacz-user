import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';

interface HomeHeaderProps {
  name: string;
  /** Exams the student is preparing for (from their profile). */
  aspirations?: string[];
}

export function HomeHeader({ name, aspirations = [] }: HomeHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>SPACZ</Text>
      <Text style={styles.greeting}>Hey! 👋</Text>
      <Text style={styles.name}>{name}</Text>
      {aspirations.length > 0 ? (
        <Text style={styles.aspirations}>Preparing for {aspirations.join(' · ')}</Text>
      ) : null}
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
  aspirations: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: Spacing.xxs,
  },
});
