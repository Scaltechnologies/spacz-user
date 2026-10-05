import { request } from '@/services/api';
import { Offer } from '@/types/offer';

/** GET /api/offers (public) — admin-managed offers that are live right now, highest priority first. */
export async function getActiveOffers(): Promise<Offer[]> {
  const offers = await request<Offer[]>('/api/offers', { auth: false });
  return offers.map((offer) => ({
    ...offer,
    discountValue: Number(offer.discountValue),
    maxDiscount: offer.maxDiscount == null ? null : Number(offer.maxDiscount),
    minBookingAmount: offer.minBookingAmount == null ? null : Number(offer.minBookingAmount),
  }));
}
