import * as Location from 'expo-location';
import { useCallback, useState } from 'react';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * The device's current position for "Near Me". Asks for permission when first used; a denial or
 * failure returns null with a message, and the caller falls back to city/search filtering.
 */
export function useLocation() {
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const getCurrentPosition = useCallback(async (): Promise<Coordinates | null> => {
    setIsLocating(true);
    setLocationError(null);
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status !== 'granted') {
        setLocationError('Location permission denied. Showing study centers in all locations.');
        return null;
      }
      const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      return { latitude: position.coords.latitude, longitude: position.coords.longitude };
    } catch {
      setLocationError('Could not get your location. Showing study centers in all locations.');
      return null;
    } finally {
      setIsLocating(false);
    }
  }, []);

  return { getCurrentPosition, isLocating, locationError };
}
