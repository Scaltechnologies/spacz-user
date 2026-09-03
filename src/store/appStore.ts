import { create } from 'zustand';

interface AppState {
  currentLocation: string;
  setCurrentLocation: (location: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentLocation: 'Ameerpet, Hyderabad',
  setCurrentLocation: (location) => set({ currentLocation: location }),
}));
