import { create } from 'zustand';

import { DurationOption } from '@/types/booking';

export interface SelectedSeat {
  /** Backend seatId — what the booking API receives. */
  id: string;
  label: string;
  blockId: string;
  blockName: string;
  pricePerDay: number;
  pricePerMonth: number | null;
}

interface BookingState {
  studyCentreId: string | null;
  seatCount: number;
  validFrom: string | null;
  durationDays: DurationOption;
  selectedSeats: SelectedSeat[];
  setStudyCentreId: (id: string) => void;
  setDateAndDuration: (validFrom: string, durationDays: DurationOption) => void;
  toggleSeat: (seat: SelectedSeat) => void;
  reset: () => void;
}

const initialState = {
  studyCentreId: null,
  seatCount: 1,
  validFrom: null,
  durationDays: 30 as DurationOption,
  selectedSeats: [] as SelectedSeat[],
};

export const useBookingStore = create<BookingState>((set, get) => ({
  ...initialState,

  setStudyCentreId: (id) => set({ studyCentreId: id }),

  // Seat availability depends on the dates, so a date change clears the seat selection.
  setDateAndDuration: (validFrom, durationDays) => set({ validFrom, durationDays, selectedSeats: [] }),

  toggleSeat: (seat) => {
    const { selectedSeats, seatCount } = get();
    const isSelected = selectedSeats.some((item) => item.id === seat.id);
    if (isSelected) {
      set({ selectedSeats: selectedSeats.filter((item) => item.id !== seat.id) });
      return;
    }
    if (selectedSeats.length >= seatCount) {
      if (seatCount === 1) set({ selectedSeats: [seat] });
      return;
    }
    set({ selectedSeats: [...selectedSeats, seat] });
  },

  reset: () => set({ ...initialState }),
}));
