/** admin-service OfferResponse (GET /api/offers returns only live offers). */
export interface Offer {
  id: number;
  title: string;
  description: string | null;
  imageUrl: string | null;
  discountType: 'PERCENTAGE' | 'FLAT';
  discountValue: number;
  maxDiscount: number | null;
  minBookingAmount: number | null;
  applicablePlan: 'ANY' | 'DAILY' | 'MONTHLY';
  firstBookingOnly: boolean;
  terms: string | null;
  startAt: string;
  endAt: string;
  priority: number;
}
