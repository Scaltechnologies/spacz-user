import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';

interface LegalSection {
  heading: string;
  body: string;
}

interface LegalDocumentProps {
  intro: string;
  sections: LegalSection[];
}

export function LegalDocument({ intro, sections }: LegalDocumentProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.intro}>{intro}</Text>
      {sections.map((section) => (
        <View key={section.heading} style={styles.section}>
          <Text style={styles.heading}>{section.heading}</Text>
          <Text style={styles.body}>{section.body}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  intro: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  section: {
    gap: Spacing.xxs,
  },
  heading: {
    ...Typography.bodyBold,
    color: Colors.text,
  },
  body: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
});
