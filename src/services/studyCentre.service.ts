import { mockDelay } from '@/services/api';
import { findStudyCentreById, mockStudyCentres } from '@/services/mock/studyCentres.mock';
import { generateSeatMap } from '@/services/mock/seats.mock';
import { Seat } from '@/types/booking';
import { StudyCentre, StudyCentreFilters } from '@/types/studyCentre';

export async function getStudyCentres(filters?: StudyCentreFilters): Promise<StudyCentre[]> {
  let results = [...mockStudyCentres];

  if (filters?.query) {
    const query = filters.query.toLowerCase();
    results = results.filter(
      (centre) =>
        centre.name.toLowerCase().includes(query) || centre.location.toLowerCase().includes(query)
    );
  }

  if (filters?.location) {
    results = results.filter((centre) => centre.location.includes(filters.location as string));
  }

  if (filters?.aspiringFor) {
    results = results.filter((centre) => centre.aspiringFor.includes(filters.aspiringFor!));
  }

  if (filters?.sortBy === 'priceLowToHigh') {
    results.sort((a, b) => a.pricePerMonth - b.pricePerMonth);
  } else if (filters?.sortBy === 'priceHighToLow') {
    results.sort((a, b) => b.pricePerMonth - a.pricePerMonth);
  } else if (filters?.sortBy === 'rating') {
    results.sort((a, b) => b.rating - a.rating);
  }

  return mockDelay(results);
}

export async function getStudyCentreById(id: string): Promise<StudyCentre | null> {
  return mockDelay(findStudyCentreById(id) ?? null);
}

export async function getSeatMap(studyCentreId: string): Promise<Seat[]> {
  return mockDelay(generateSeatMap(studyCentreId));
}
