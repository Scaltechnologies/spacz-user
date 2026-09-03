import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '@/components/common/ScreenContainer';
import { SeatLegend } from '@/components/booking/SeatLegend';
import { SeatMap as SeatMapView } from '@/components/booking/SeatMap';
import { Button } from '@/components/ui/Button';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Loader } from '@/components/ui/Loader';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { useSeatMap } from '@/hooks/useBooking';
import * as studyCentreService from '@/services/studyCentre.service';
import { useBookingStore } from '@/store/bookingStore';
import { StudyCentre } from '@/types/studyCentre';
import { formatCurrency } from '@/utils/formatting';

export default function SeatMapScreen() {
  const studyCentreId = useBookingStore((state) => state.studyCentreId);
  const seatCount = useBookingStore((state) => state.seatCount);
  const selectedSeats = useBookingStore((state) => state.selectedSeats);
  const toggleSeat = useBookingStore((state) => state.toggleSeat);
  const { seats, isLoading, error } = useSeatMap(studyCentreId);
  const [studyCentre, setStudyCentre] = useState<StudyCentre | null>(null);

  useEffect(() => {
    if (!studyCentreId) return;
    studyCentreService.getStudyCentreById(studyCentreId).then(setStudyCentre);
  }, [studyCentreId]);

  const pricePerSeat = studyCentre?.pricePerMonth ?? 0;
  const total = pricePerSeat * selectedSeats.length;
  const canProceed = selectedSeats.length === seatCount;

  function handleBookNow() {
    router.push('/study-centre/price-breakup');
  }

  if (isLoading || !studyCentre) return <Loader fullScreen />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <ScreenContainer title={studyCentre.name} showBackButton>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <SeatLegend />
        <View style={styles.mapWrap}>
          <SeatMapView seats={seats} onSeatPress={(seat) => toggleSeat({ id: seat.id, label: seat.label })} />
        </View>
        <Text style={styles.hint}>
          Select {seatCount} seat{seatCount > 1 ? 's' : ''} · {selectedSeats.length} selected
        </Text>
      </ScrollView>

      <View style={styles.footer}>
        <View>
          <Text style={styles.price}>{formatCurrency(total)}</Text>
          <Text style={styles.priceSub}>({selectedSeats.length})</Text>
        </View>
        <Button label="Book Now" onPress={handleBookNow} disabled={!canProceed} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    gap: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  mapWrap: {
    paddingVertical: Spacing.md,
  },
  hint: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  price: {
    ...Typography.h3,
    color: Colors.text,
  },
  priceSub: {
    ...Typography.small,
    color: Colors.textSecondary,
  },
});
