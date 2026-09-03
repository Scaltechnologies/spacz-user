import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';

interface AuthHeaderProps {
  heading: string;
  subheading?: string;
}

export function AuthHeader({ heading, subheading }: AuthHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>SPACZ</Text>
      <Text style={styles.heading}>{heading}</Text>
      {subheading ? <Text style={styles.subheading}>{subheading}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.xs,
    marginBottom: Spacing.lg,
  },
  logo: {
    ...Typography.captionBold,
    color: Colors.primary,
    letterSpacing: 2,
  },
  heading: {
    ...Typography.h1,
    color: Colors.text,
  },
  subheading: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
});
