import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '@/components/common/ScreenContainer';
import { SeatCountSelector } from '@/components/booking/SeatCountSelector';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { useBookingStore } from '@/store/bookingStore';

export default function SelectSeatsScreen() {
  const seatCount = useBookingStore((state) => state.seatCount);
  const setSeatCount = useBookingStore((state) => state.setSeatCount);

  function handleNext() {
    router.push('/study-centre/select-date');
  }

  return (
    <ScreenContainer title="Select seats" showBackButton>
      <View style={styles.content}>
        <Badge label="Flat 50% off" tone="primary" />
        <Text style={styles.hint}>Book 2 seats and get flat 50% off. Offer valid till 13th March, hurry up!</Text>

        <Text style={styles.label}>Number of seats</Text>
        <SeatCountSelector value={seatCount} onChange={setSeatCount} />
      </View>

      <Button label="Next" onPress={handleNext} style={styles.button} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    gap: Spacing.sm,
    paddingTop: Spacing.sm,
  },
  hint: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  label: {
    ...Typography.bodyBold,
    color: Colors.text,
    marginTop: Spacing.md,
  },
  button: {
    marginBottom: Spacing.lg,
  },
});
