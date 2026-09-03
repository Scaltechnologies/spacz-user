import { Pressable, StyleSheet, Text } from 'react-native';

import { Colors } from '@/constants/colors';
import { Radius } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { Seat as SeatType } from '@/types/booking';

interface SeatProps {
  seat: SeatType;
  onPress: (seat: SeatType) => void;
}

export function Seat({ seat, onPress }: SeatProps) {
  const isOccupied = seat.status === 'OCCUPIED';
  const isSelected = seat.status === 'SELECTED';

  return (
    <Pressable
      disabled={isOccupied}
      onPress={() => onPress(seat)}
      style={[styles.seat, isOccupied && styles.occupied, isSelected && styles.selected]}>
      <Text style={[styles.label, (isOccupied || isSelected) && styles.labelLight]}>{seat.label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  seat: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.seatAvailable,
    alignItems: 'center',
    justifyContent: 'center',
  },
  occupied: {
    backgroundColor: Colors.seatOccupied,
    borderColor: Colors.seatOccupied,
  },
  selected: {
    backgroundColor: Colors.seatSelected,
    borderColor: Colors.seatSelected,
  },
  label: {
    ...Typography.small,
    fontWeight: '700',
    color: Colors.text,
  },
  labelLight: {
    color: Colors.white,
  },
});
