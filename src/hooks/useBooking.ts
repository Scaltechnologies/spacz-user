import { useCallback, useEffect, useState } from 'react';

import { ApiError, errorMessage } from '@/services/api';
import * as bookingService from '@/services/booking.service';
import * as studyCentreService from '@/services/studyCentre.service';
import { useBookingStore } from '@/store/bookingStore';
import { Booking, LayoutBlock } from '@/types/booking';

/** The vendor's seat layout for the dates, with the student's current selection overlaid. */
export function useSeatMap(studyCentreId: string | null, startDate: string | null, endDate: string | null) {
  const [blocks, setBlocks] = useState<LayoutBlock[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);
  const selectedSeats = useBookingStore((state) => state.selectedSeats);

  useEffect(() => {
    if (!studyCentreId || !startDate || !endDate) return;
    let cancelled = false;
    Promise.resolve().then(() => {
      if (!cancelled) {
        setIsLoading(true);
        setError(null);
      }
    });
    studyCentreService
      .getSeatLayout(studyCentreId, startDate, endDate)
      .then((results) => {
        if (!cancelled) setBlocks(results);
      })
      .catch((err) => {
        if (!cancelled) setError(errorMessage(err, 'Unable to load the seat layout. Please try again.'));
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [studyCentreId, startDate, endDate, reloadToken]);

  const refresh = useCallback(() => setReloadToken((token) => token + 1), []);

  const blocksWithSelection: LayoutBlock[] = blocks.map((block) => ({
    ...block,
    cells: block.cells.map((cell) =>
      cell.seat && selectedSeats.some((item) => item.id === cell.seat!.id)
        ? { ...cell, seat: { ...cell.seat, status: 'SELECTED' } }
        : cell
    ),
  }));

  return { blocks: blocksWithSelection, isLoading, error, refresh };
}

export function useCreateBooking() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);

  /** The backend books one seat per booking, so each selected seat becomes its own booking. */
  const submit = useCallback(async () => {
    const { studyCentreId, selectedSeats, validFrom, durationDays, seatCount } = useBookingStore.getState();

    if (!studyCentreId || !validFrom) {
      setError('Booking details are incomplete');
      return null;
    }
    if (selectedSeats.length !== seatCount) {
      setError(`Please select ${seatCount} seat(s)`);
      return null;
    }

    setIsSubmitting(true);
    setError(null);
    const period = bookingService.getBookingPeriod(validFrom, durationDays);
    const created: Booking[] = [];
    try {
      for (const seat of selectedSeats) {
        created.push(
          await bookingService.createBooking(bookingService.buildBookingRequest(studyCentreId, seat, durationDays, period))
        );
      }
      setBookings(created);
      return created;
    } catch (err) {
      // Release the seats already held so a partial multi-seat booking isn't left behind.
      await Promise.all(
        created.map((booking) =>
          bookingService.cancelBooking(booking.id, 'Multi-seat booking could not be completed').catch(() => undefined)
        )
      );
      const message = errorMessage(err, 'Could not complete booking');
      setError(
        err instanceof ApiError && err.code === 'SEAT_UNAVAILABLE'
          ? 'One of the selected seats was just taken. Go back and pick another seat.'
          : message
      );
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return { submit, isSubmitting, error, bookings };
}
