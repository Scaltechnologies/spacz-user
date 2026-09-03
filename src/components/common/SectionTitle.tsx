import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';

interface SectionTitleProps {
  title: string;
  action?: string;
  onActionPress?: () => void;
}

export function SectionTitle({ title, action, onActionPress }: SectionTitleProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {action ? (
        <Text style={styles.action} onPress={onActionPress}>
          {action}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  title: {
    ...Typography.h3,
    color: Colors.text,
  },
  action: {
    ...Typography.captionBold,
    color: Colors.primary,
  },
});
