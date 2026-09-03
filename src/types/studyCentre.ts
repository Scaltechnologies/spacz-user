import { AspiringCategory } from '@/types/common';

export interface StudyCentreReview {
  id: string;
  authorName: string;
  rating: number;
  title: string;
  comment: string;
  postedOn: string;
}

export interface StudyCentre {
  id: string;
  name: string;
  location: string;
  fullAddress: string;
  imageUrl: string;
  rating: number;
  ratingCount: number;
  pricePerMonth: number;
  originalPricePerMonth: number | null;
  discountLabel: string | null;
  slotsLeft: number;
  isOpen24x7: boolean;
  amenities: string[];
  aspiringFor: AspiringCategory[];
  reviews: StudyCentreReview[];
}

export interface StudyCentreFilters {
  query?: string;
  location?: string;
  aspiringFor?: AspiringCategory;
  sortBy?: 'recommended' | 'priceLowToHigh' | 'priceHighToLow' | 'rating';
}
