export type SeatStatus = 'AVAILABLE' | 'OCCUPIED' | 'SELECTED';

export interface Seat {
  id: string;
  label: string;
  row: number;
  column: number;
  blockId: string;
  blockName: string;
  status: SeatStatus;
  pricePerDay: number;
  /** null = monthly bookings not offered for this seat */
  pricePerMonth: number | null;
}

/** studyhall-service LayoutCellType: SEAT cells are bookable, the rest are physical features. */
export type LayoutCellType =
  | 'EMPTY'
  | 'SEAT'
  | 'WALKWAY'
  | 'ENTRANCE'
  | 'EXIT'
  | 'TABLE'
  | 'WALL'
  | 'PILLAR'
  | 'RECEPTION'
  | 'STAIRS'
  | 'LIFT'
  | 'RESTROOM'
  | 'AC'
  | 'OTHER';

export interface LayoutCell {
  row: number;
  column: number;
  type: LayoutCellType;
  label: string | null;
  seat: Seat | null;
}

/**
 * A fixture (currently AC) mounted on a block edge or its centre. It takes no grid position, so it never
 * replaces a seat and is never bookable. `offset` is the column (NORTH/SOUTH) or row (EAST/WEST) along the edge;
 * null = centred on that edge.
 */
export interface LayoutFixture {
  type: 'AC';
  position: 'NORTH' | 'SOUTH' | 'EAST' | 'WEST' | 'CENTER';
  offset: number | null;
  direction: 'NORTH' | 'EAST' | 'SOUTH' | 'WEST' | 'CENTER' | null;
  label: string | null;
}

/** One vendor-configured block: a rows × columns grid exactly as the vendor laid it out. */
export interface LayoutBlock {
  id: string;
  name: string;
  floorName: string | null;
  rows: number;
  columns: number;
  /** Facilities (AC) around the grid; not seats. */
  fixtures: LayoutFixture[];
  cells: LayoutCell[];
}

/** studyhall-service BookingStatus. */
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'EXPIRED';

export type BookingPlan = 'DAILY' | 'MONTHLY';

export type PaymentStatus = 'PAID' | 'PENDING' | 'CANCELLED' | 'EXPIRED';

export type DurationOption = 15 | 30;

export interface Booking {
  id: string;
  reference: string;
  studyCentreId: string;
  studyCentreName: string;
  studyCentreLocation: string;
  studyCentreImageUrl: string | null;
  seatNumbers: string[];
  validFrom: string;
  validTo: string;
  plan: BookingPlan;
  /** days (DAILY) or months (MONTHLY) */
  units: number;
  unitPrice: number;
  baseAmount: number;
  discountAmount: number;
  offerTitle: string | null;
  platformCharges: number;
  taxes: number;
  /** Server-computed total: baseAmount - discountAmount + platformCharges + taxes */
  amount: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  holdExpiresAt: string | null;
  createdAt: string;
}

/** studyhall-service CreateBookingRequest (one seat per booking). */
export interface CreateBookingRequest {
  studyHallId: number;
  seatId: number;
  plan: BookingPlan;
  startDate: string;
  endDate?: string;
  months?: number;
  programId?: number;
}

/** studyhall-service BookingQuoteResponse (POST /api/bookings/quote). */
export interface BookingQuote {
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
}
