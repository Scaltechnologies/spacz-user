import { Seat } from '@/types/booking';

const ROWS = 4;
const COLUMNS = 6;

/** Deterministic pseudo-random occupancy so the seat map is stable across renders for a given centre. */
function isOccupied(seedKey: string, index: number): boolean {
  let hash = 0;
  for (let i = 0; i < seedKey.length; i++) {
    hash = (hash * 31 + seedKey.charCodeAt(i)) % 997;
  }
  return (hash + index * 7) % 5 === 0;
}

export function generateSeatMap(studyCentreId: string): Seat[] {
  const seats: Seat[] = [];
  let index = 0;
  for (let row = 1; row <= ROWS; row++) {
    for (let column = 1; column <= COLUMNS; column++) {
      index += 1;
      seats.push({
        id: `${studyCentreId}-r${row}c${column}`,
        label: `C${index}`,
        row,
        column,
        status: isOccupied(studyCentreId, index) ? 'OCCUPIED' : 'AVAILABLE',
      });
    }
  }
  return seats;
}
