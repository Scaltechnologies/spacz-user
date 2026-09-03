import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';

interface SeatCountSelectorProps {
  value: number;
  onChange: (count: number) => void;
  max?: number;
}

export function SeatCountSelector({ value, onChange, max = 5 }: SeatCountSelectorProps) {
  const options = Array.from({ length: max }, (_, index) => index + 1);

  return (
    <View style={styles.row}>
      {options.map((count) => {
        const isSelected = count === value;
        return (
          <Pressable
            key={count}
            onPress={() => onChange(count)}
            style={[styles.circle, isSelected && styles.circleSelected]}>
            <Text style={[styles.label, isSelected && styles.labelSelected]}>{count}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  circle: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  circleSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  label: {
    ...Typography.bodyBold,
    color: Colors.text,
  },
  labelSelected: {
    color: Colors.white,
  },
});
