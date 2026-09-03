import { useAppStore } from '@/store/appStore';

/**
 * Abstraction over the user's current area. Currently backed by a static
 * mock value in appStore — swap the implementation for expo-location once
 * real geolocation is required, without changing any screen that calls this.
 */
export function useLocation() {
  const currentLocation = useAppStore((state) => state.currentLocation);
  const setCurrentLocation = useAppStore((state) => state.setCurrentLocation);

  return { currentLocation, setCurrentLocation };
}
