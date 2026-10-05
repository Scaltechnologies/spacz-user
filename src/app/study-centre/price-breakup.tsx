import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ScreenContainer } from '@/components/common/ScreenContainer';
import { PriceBreakupCard } from '@/components/booking/PriceBreakupCard';
import { Button } from '@/components/ui/Button';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Loader } from '@/components/ui/Loader';
import { Spacing } from '@/constants/spacing';
import { useCreateBooking } from '@/hooks/useBooking';
import { errorMessage } from '@/services/api';
import * as bookingService from '@/services/booking.service';
import { useBookingStore } from '@/store/bookingStore';
import { BookingQuote } from '@/types/booking';

export default function PriceBreakupScreen() {
  const studyCentreId = useBookingStore((state) => state.studyCentreId);
  const selectedSeats = useBookingStore((state) => state.selectedSeats);
  const validFrom = useBookingStore((state) => state.validFrom);
  const durationDays = useBookingStore((state) => state.durationDays);
  const [quote, setQuote] = useState<BookingQuote | null>(null);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const { submit, isSubmitting, error: submitError } = useCreateBooking();

  // The price is computed by the backend (same rules as the booking itself); nothing is priced here.
  const loadQuote = useCallback(() => {
    const seat = selectedSeats[0];
    if (!studyCentreId || !validFrom || !seat) return;
    setQuote(null);
    setQuoteError(null);
    const period = bookingService.getBookingPeriod(validFrom, durationDays);
    bookingService
      .getQuote(bookingService.buildBookingRequest(studyCentreId, seat, durationDays, period))
      .then(setQuote)
      .catch((err) => setQuoteError(errorMessage(err, 'Unable to calculate the price. Please try again.')));
  }, [studyCentreId, selectedSeats, validFrom, durationDays]);

  useEffect(() => {
    Promise.resolve().then(loadQuote);
  }, [loadQuote]);

  async function handleBookNow() {
    const bookings = await submit();
    if (bookings) {
      router.replace({
        pathname: '/study-centre/confirmation',
        params: { bookingIds: bookings.map((booking) => booking.id).join(',') },
      });
    }
  }

  if (quoteError) return <ErrorMessage message={quoteError} onRetry={loadQuote} />;
  if (!quote) return <Loader fullScreen />;

  return (
    <ScreenContainer title="Price Break up" showBackButton>
      <View style={styles.content}>
        <PriceBreakupCard seatNumbers={selectedSeats.map((seat) => seat.label)} quote={quote} />
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
