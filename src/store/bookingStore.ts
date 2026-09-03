import { create } from 'zustand';

import { DurationOption, PriceBreakup } from '@/types/booking';

export interface SelectedSeat {
  id: string;
  label: string;
}

interface BookingState {
  studyCentreId: string | null;
  seatCount: number;
  validFrom: string | null;
  durationDays: DurationOption;
  selectedSeats: SelectedSeat[];
  priceBreakup: PriceBreakup | null;
  setStudyCentreId: (id: string) => void;
  setSeatCount: (count: number) => void;
  setDateAndDuration: (validFrom: string, durationDays: DurationOption) => void;
  toggleSeat: (seat: SelectedSeat) => void;
  setPriceBreakup: (breakup: PriceBreakup) => void;
  reset: () => void;
}

const initialState = {
  studyCentreId: null,
  seatCount: 1,
  validFrom: null,
  durationDays: 30 as DurationOption,
  selectedSeats: [] as SelectedSeat[],
  priceBreakup: null,
};

export const useBookingStore = create<BookingState>((set, get) => ({
  ...initialState,

  setStudyCentreId: (id) => set({ studyCentreId: id }),

  setSeatCount: (count) => set({ seatCount: count }),

  setDateAndDuration: (validFrom, durationDays) => set({ validFrom, durationDays }),

  toggleSeat: (seat) => {
    const { selectedSeats, seatCount } = get();
    const isSelected = selectedSeats.some((item) => item.id === seat.id);
    if (isSelected) {
      set({ selectedSeats: selectedSeats.filter((item) => item.id !== seat.id) });
      return;
    }
    if (selectedSeats.length >= seatCount) return;
    set({ selectedSeats: [...selectedSeats, seat] });
  },

  setPriceBreakup: (breakup) => set({ priceBreakup: breakup }),

  reset: () => set({ ...initialState }),
}));
