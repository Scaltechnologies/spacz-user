import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ScreenContainer } from '@/components/common/ScreenContainer';
import { PriceBreakupCard } from '@/components/booking/PriceBreakupCard';
import { Button } from '@/components/ui/Button';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Loader } from '@/components/ui/Loader';
import { Spacing } from '@/constants/spacing';
import { useCreateBooking } from '@/hooks/useBooking';
import * as bookingService from '@/services/booking.service';
import * as studyCentreService from '@/services/studyCentre.service';
import { useBookingStore } from '@/store/bookingStore';
import { StudyCentre } from '@/types/studyCentre';

function parseDiscountPercent(label: string | null): number {
  if (!label) return 0;
  const match = label.match(/(\d+)%/);
  return match ? Number(match[1]) : 0;
}

export default function PriceBreakupScreen() {
  const studyCentreId = useBookingStore((state) => state.studyCentreId);
  const selectedSeats = useBookingStore((state) => state.selectedSeats);
  const priceBreakup = useBookingStore((state) => state.priceBreakup);
  const setPriceBreakup = useBookingStore((state) => state.setPriceBreakup);
  const [studyCentre, setStudyCentre] = useState<StudyCentre | null>(null);
  const { submit, isSubmitting, error: submitError } = useCreateBooking();

  useEffect(() => {
    if (!studyCentreId) return;
    studyCentreService.getStudyCentreById(studyCentreId).then((centre) => {
      setStudyCentre(centre);
      if (centre) {
        const breakup = bookingService.calculatePriceBreakup(
          centre.pricePerMonth,
          selectedSeats.length,
          parseDiscountPercent(centre.discountLabel)
        );
        setPriceBreakup(breakup);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studyCentreId]);

  async function handleBookNow() {
    const booking = await submit();
    if (booking) {
      router.replace({ pathname: '/study-centre/confirmation', params: { bookingId: booking.id } });
    }
  }

  if (!studyCentre || !priceBreakup) return <Loader fullScreen />;

  return (
    <ScreenContainer title="Price Break up" showBackButton>
      <View style={styles.content}>
        <PriceBreakupCard
          seatNumbers={selectedSeats.map((seat) => seat.label)}
          seatCount={selectedSeats.length}
          pricePerSeat={studyCentre.pricePerMonth}
          breakup={priceBreakup}
        />
        {submitError ? <ErrorMessage message={submitError} /> : null}
      </View>
      <Button label="Book Now" onPress={handleBookNow} loading={isSubmitting} style={styles.button} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingTop: Spacing.sm,
  },
  button: {
    marginBottom: Spacing.lg,
  },
});
