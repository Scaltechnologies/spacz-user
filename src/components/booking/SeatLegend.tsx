import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';

const items: { label: string; color: string }[] = [
  { label: 'Available', color: Colors.seatAvailable },
  { label: 'Occupied', color: Colors.seatOccupied },
  { label: 'Selected', color: Colors.seatSelected },
];

export function SeatLegend() {
  return (
    <View style={styles.row}>
      {items.map((item) => (
        <View key={item.label} style={styles.item}>
          <View style={[styles.swatch, { backgroundColor: item.color }]} />
          <Text style={styles.label}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xxs,
  },
  swatch: {
    width: 14,
    height: 14,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  label: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
});
