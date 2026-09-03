import { StyleSheet, Text, View } from 'react-native';

import { Seat } from '@/components/booking/Seat';
import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { Seat as SeatType } from '@/types/booking';

interface SeatMapProps {
  seats: SeatType[];
  onSeatPress: (seat: SeatType) => void;
}

export function SeatMap({ seats, onSeatPress }: SeatMapProps) {
  const rows = Array.from(new Set(seats.map((seat) => seat.row))).sort((a, b) => a - b);

  return (
    <View style={styles.container}>
      <View style={styles.entrance}>
        <Text style={styles.entranceLabel}>Entrance</Text>
      </View>
      {rows.map((row) => (
        <View key={row} style={styles.row}>
          {seats
            .filter((seat) => seat.row === row)
            .sort((a, b) => a.column - b.column)
            .map((seat) => (
              <Seat key={seat.id} seat={seat} onPress={onSeatPress} />
            ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
    alignItems: 'center',
  },
  entrance: {
    alignSelf: 'stretch',
    alignItems: 'center',
    paddingVertical: Spacing.xxs,
    marginBottom: Spacing.xxs,
    borderRadius: Radius.sm,
    backgroundColor: Colors.surface,
  },
  entranceLabel: {
    ...Typography.small,
    color: Colors.textSecondary,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
});
