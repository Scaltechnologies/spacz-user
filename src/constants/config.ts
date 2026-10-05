import Constants from 'expo-constants';

/**
 * SPACZ gateway URL — single source: EXPO_PUBLIC_API_BASE_URL (.env, inlined when Metro bundles).
 * - Set (production / preview builds, or to force a host): used as-is.
 * - Empty in development: the gateway on the same PC that serves this bundle, i.e.
 *   http://<metro host>:<EXPO_PUBLIC_API_PORT or 8080>. Expo Go / a dev build on a phone gets the PC's
 *   current Wi-Fi IP from Metro, so a DHCP change of the PC's IP never leaves the app on a stale address.
 *   (Not for tunnel mode — set the URL explicitly there.)
 */
function resolveApiBaseUrl(): string {
  const configured = (process.env.EXPO_PUBLIC_API_BASE_URL ?? '').trim().replace(/\/+$/, '');
  if (configured) return configured;
  // native: the PC serving the bundle (Expo Go / dev build); web: the page's own host (same PC)
  const metroHost =
    Constants.expoConfig?.hostUri?.split(':')[0] ?? (typeof window !== 'undefined' ? window.location?.hostname : undefined);
  if (__DEV__ && metroHost) return `http://${metroHost}:${process.env.EXPO_PUBLIC_API_PORT || '8080'}`;
  return '';
}

export const Config = {
  apiBaseUrl: resolveApiBaseUrl(),
  otpResendSeconds: 30,
  currencySymbol: 'Rs.',
  supportEmail: 'support@spacz.com',
} as const;
