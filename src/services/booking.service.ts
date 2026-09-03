import { mockDelay } from '@/services/api';
import { mockBookings } from '@/services/mock/bookings.mock';
import { findStudyCentreById } from '@/services/mock/studyCentres.mock';
import { Booking, CreateBookingInput, PriceBreakup } from '@/types/booking';
import { addDays, todayIso } from '@/utils/date';

/** In-memory mock "database" — seeded once per app session, mutated as the user books/pays. */
const bookingsStore: Booking[] = [...mockBookings];

export function calculatePriceBreakup(
  pricePerSeat: number,
  seatCount: number,
  discountPercent = 0
): PriceBreakup {
  const seatSubtotal = pricePerSeat * seatCount;
  const discount = Math.round((seatSubtotal * discountPercent) / 100);
  const platformCharges = 0;
  const taxes = 0;
  const total = seatSubtotal - discount + platformCharges + taxes;
  return { seatSubtotal, discount, platformCharges, taxes, total };
}

export async function createBooking(input: CreateBookingInput): Promise<Booking> {
  const centre = findStudyCentreById(input.studyCentreId);
  const booking: Booking = {
    id: `SPZ${Date.now()}`,
    type: 'STUDY_CIRCLE',
    studyCentreId: input.studyCentreId,
    studyCentreName: centre?.name ?? 'Study Centre',
    studyCentreLocation: centre?.location ?? '',
    studyCentreImageUrl: centre?.imageUrl ?? '',
    seatNumbers: input.seatNumbers,
    validFrom: input.validFrom,
    validTo: addDays(input.validFrom, input.durationDays),
    durationDays: input.durationDays,
    amount: input.priceBreakup.total,
    priceBreakup: input.priceBreakup,
    paymentStatus: 'PAID',
    createdAt: todayIso(),
  };
  bookingsStore.unshift(booking);
  return mockDelay(booking);
}

export async function getMyBookings(): Promise<Booking[]> {
  return mockDelay([...bookingsStore]);
}

export async function getBookingById(id: string): Promise<Booking | null> {
  return mockDelay(bookingsStore.find((booking) => booking.id === id) ?? null);
}

export async function payBooking(id: string): Promise<Booking | null> {
  const booking = bookingsStore.find((item) => item.id === id);
  if (booking) booking.paymentStatus = 'PAID';
  return mockDelay(booking ?? null);
}
