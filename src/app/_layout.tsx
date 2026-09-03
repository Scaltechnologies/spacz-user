import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';

import { Loader } from '@/components/ui/Loader';
import { useAuthStore } from '@/store/authStore';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const hydrate = useAuthStore((state) => state.hydrate);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const [splashHidden, setSplashHidden] = useState(false);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (isHydrated && !splashHidden) {
      SplashScreen.hideAsync()
        .catch(() => {})
        .finally(() => setSplashHidden(true));
    }
  }, [isHydrated, splashHidden]);

  if (!isHydrated) {
    return <Loader fullScreen />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="study-centre" />
      <Stack.Screen name="bookings" />
      <Stack.Screen name="profile" />
    </Stack>
  );
}
