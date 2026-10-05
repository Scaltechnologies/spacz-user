/** studyhall-service ProgramResponse (GET /api/programs). */
export interface Program {
  id: number;
  code: string;
  name: string;
  description: string | null;
  category: string;
  active: boolean;
}

export interface StudyCentreProgram {
  id: number;
  name: string;
}

export interface StudyCentre {
  id: string;
  name: string;
  location: string;
  fullAddress: string;
  city: string | null;
  description: string | null;
  rules: string | null;
  imageUrl: string | null;
  pricePerDay: number;
  /** null = monthly bookings not offered */
  pricePerMonth: number | null;
  totalSeats: number;
  /** Free seats today (detail only; null when unknown). */
  slotsLeft: number | null;
  isOpen24x7: boolean;
  amenities: string[];
  programs: StudyCentreProgram[];
}

export interface StudyCentreFilters {
  query?: string;
  city?: string;
  programId?: number;
  /** "Near Me": search centre and radius (km) */
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
  sortBy?: 'recommended' | 'priceLowToHigh' | 'priceHighToLow';
}

/** studyhall-service LocationResponse: a city with live halls. */
export interface StudyCentreLocation {
  city: string;
  state: string | null;
  hallCount: number;
}
