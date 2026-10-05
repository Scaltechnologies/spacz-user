import { request } from '@/services/api';
import {
  Booking,
  BookingPlan,
  BookingQuote,
  BookingStatus,
  CreateBookingRequest,
  DurationOption,
  PaymentStatus,
  Seat,
} from '@/types/booking';
import { PageResponse } from '@/types/common';
import { addDays, addMonths, daysBetweenInclusive } from '@/utils/date';

interface BookingResponse {
  id: number;
  bookingReference: string;
  studyHallId: number;
  studyHallName: string;
  studyHallCity: string | null;
  seatNumber: string;
  plan: BookingPlan;
  startDate: string;
  endDate: string;
  units: number;
  unitPrice: number;
  baseAmount: number;
  discountAmount: number;
  offerTitle: string | null;
  platformCharges: number;
  taxes: number;
  totalPrice: number;
  status: BookingStatus;
  holdExpiresAt: string | null;
  createdAt: string;
}

const money = (value: number | null | undefined) => Number(value ?? 0);

const PAYMENT_STATUS: Record<BookingStatus, PaymentStatus> = {
  PENDING: 'PENDING',
  CONFIRMED: 'PAID',
  COMPLETED: 'PAID',
  CANCELLED: 'CANCELLED',
  EXPIRED: 'EXPIRED',
};

function toBooking(booking: BookingResponse): Booking {
  return {
    id: String(booking.id),
    reference: booking.bookingReference,
    studyCentreId: String(booking.studyHallId),
    studyCentreName: booking.studyHallName,
    studyCentreLocation: booking.studyHallCity ?? '',
    studyCentreImageUrl: null,
    seatNumbers: [booking.seatNumber],
    validFrom: booking.startDate,
    validTo: booking.endDate,
    plan: booking.plan,
    units: booking.units,
    unitPrice: money(booking.unitPrice),
    baseAmount: money(booking.baseAmount ?? booking.totalPrice),
    discountAmount: money(booking.discountAmount),
    offerTitle: booking.offerTitle,
    platformCharges: money(booking.platformCharges),
    taxes: money(booking.taxes),
    amount: money(booking.totalPrice),
    status: booking.status,
    paymentStatus: PAYMENT_STATUS[booking.status],
    holdExpiresAt: booking.holdExpiresAt,
    createdAt: booking.createdAt,
  };
}

/**
 * POST /api/bookings/quote — validates the seat/dates and returns the price exactly as the backend
 * will charge it (base, best live offer discount, platform charges, taxes, total).
 */
export async function getQuote(input: CreateBookingRequest): Promise<BookingQuote> {
  const quote = await request<BookingQuote>('/api/bookings/quote', { method: 'POST', body: input });
  return {
    ...quote,
    unitPrice: money(quote.unitPrice),
    baseAmount: money(quote.baseAmount),
    discountAmount: money(quote.discountAmount),
    platformCharges: money(quote.platformCharges),
    taxes: money(quote.taxes),
    totalPrice: money(quote.totalPrice),
  };
}

/** POST /api/bookings — holds one seat (status PENDING until confirmed). */
export async function createBooking(input: CreateBookingRequest): Promise<Booking> {
  return toBooking(await request<BookingResponse>('/api/bookings', { method: 'POST', body: input }));
}

/** GET /api/bookings/me */
export async function getMyBookings(status?: BookingStatus): Promise<Booking[]> {
  const page = await request<PageResponse<BookingResponse>>('/api/bookings/me', {
    query: { status, size: 100, sort: 'createdAt,desc' },
  });
  return page.content.map(toBooking);
}

/** GET /api/bookings/{id} */
export async function getBookingById(id: string): Promise<Booking> {
  return toBooking(await request<BookingResponse>(`/api/bookings/${id}`));
}

/** POST /api/bookings/{id}/confirm — the backend's post-payment confirmation step. */
export async function confirmBooking(id: string): Promise<Booking> {
  return toBooking(await request<BookingResponse>(`/api/bookings/${id}/confirm`, { method: 'POST' }));
}

/** POST /api/bookings/{id}/cancel */
export async function cancelBooking(id: string, reason?: string): Promise<Booking> {
  return toBooking(
    await request<BookingResponse>(`/api/bookings/${id}/cancel`, { method: 'POST', body: { reason } })
  );
}

export interface BookingPeriod {
  startDate: string;
  /** inclusive */
  endDate: string;
  days: number;
}

/**
 * 15 days → DAILY range; 30 days → one calendar month (the MONTHLY plan's derived
 * end date, startDate + 1 month - 1 day), so the seat map is queried for the exact range booked.
 */
export function getBookingPeriod(startDate: string, duration: DurationOption): BookingPeriod {
  const endDate = duration === 30 ? addDays(addMonths(startDate, 1), -1) : addDays(startDate, duration - 1);
  return { startDate, endDate, days: daysBetweenInclusive(startDate, endDate) };
}

type PricedSeat = Pick<Seat, 'pricePerDay' | 'pricePerMonth'>;

/**
 * MONTHLY when a month is chosen and the seat offers monthly booking (the backend returns a
 * monthly price only then); otherwise DAILY. The price itself always comes from the backend.
 */
export function planForSeat(seat: PricedSeat, duration: DurationOption): BookingPlan {
  return duration === 30 && seat.pricePerMonth != null ? 'MONTHLY' : 'DAILY';
}

export function buildBookingRequest(
  studyHallId: string,
  seat: PricedSeat & { id: string },
  duration: DurationOption,
  period: BookingPeriod
): CreateBookingRequest {
  const plan = planForSeat(seat, duration);
  return {
    studyHallId: Number(studyHallId),
    seatId: Number(seat.id),
    plan,
    startDate: period.startDate,
    ...(plan === 'MONTHLY' ? { months: 1 } : { endDate: period.endDate }),
  };
}

export function formatBookingDuration(booking: Pick<Booking, 'plan' | 'units'>): string {
  if (booking.plan === 'MONTHLY') return `${booking.units} Month${booking.units === 1 ? '' : 's'}`;
  return `${booking.units} Day${booking.units === 1 ? '' : 's'}`;
}
