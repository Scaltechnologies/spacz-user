export type SeatStatus = 'AVAILABLE' | 'OCCUPIED' | 'SELECTED';

export interface Seat {
  id: string;
  label: string;
  row: number;
  column: number;
  status: SeatStatus;
}

export type PaymentStatus = 'PAID' | 'PENDING';

export type BookingType = 'STUDY_CIRCLE' | 'MEAL_CARD';

export type DurationOption = 15 | 30;

export interface PriceBreakup {
  seatSubtotal: number;
  discount: number;
  platformCharges: number;
  taxes: number;
  total: number;
}

export interface Booking {
  id: string;
  type: BookingType;
  studyCentreId: string;
  studyCentreName: string;
  studyCentreLocation: string;
  studyCentreImageUrl: string;
  seatNumbers: string[];
  validFrom: string;
  validTo: string;
  durationDays: DurationOption;
  amount: number;
  priceBreakup: PriceBreakup;
  paymentStatus: PaymentStatus;
  createdAt: string;
}

export interface CreateBookingInput {
  studyCentreId: string;
  seatNumbers: string[];
  validFrom: string;
  durationDays: DurationOption;
  priceBreakup: PriceBreakup;
}
