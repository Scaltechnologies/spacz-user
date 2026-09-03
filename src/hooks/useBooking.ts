import { useCallback, useEffect, useState } from 'react';

import * as bookingService from '@/services/booking.service';
import * as studyCentreService from '@/services/studyCentre.service';
import { useBookingStore } from '@/store/bookingStore';
import { Booking, Seat } from '@/types/booking';

export function useSeatMap(studyCentreId: string | null) {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const selectedSeats = useBookingStore((state) => state.selectedSeats);

  useEffect(() => {
    if (!studyCentreId) return;
    let cancelled = false;
    Promise.resolve().then(() => {
      if (!cancelled) setIsLoading(true);
    });
    studyCentreService
      .getSeatMap(studyCentreId)
      .then((results) => {
        if (!cancelled) setSeats(results);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load seat map');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [studyCentreId]);

  const seatsWithSelection: Seat[] = seats.map((seat) =>
    selectedSeats.some((item) => item.id === seat.id) ? { ...seat, status: 'SELECTED' } : seat
  );

  return { seats: seatsWithSelection, isLoading, error };
}

export function useCreateBooking() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);
  const bookingState = useBookingStore();

  const submit = useCallback(async () => {
    const { studyCentreId, selectedSeats, validFrom, durationDays, priceBreakup, seatCount } =
      useBookingStore.getState();

    if (!studyCentreId || !validFrom || !priceBreakup) {
      setError('Booking details are incomplete');
      return null;
    }
    if (selectedSeats.length !== seatCount) {
      setError(`Please select ${seatCount} seat(s)`);
      return null;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const result = await bookingService.createBooking({
        studyCentreId,
        seatNumbers: selectedSeats.map((seat) => seat.label),
        validFrom,
        durationDays,
        priceBreakup,
      });
      setBooking(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not complete booking');
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return { submit, isSubmitting, error, booking, bookingState };
}
