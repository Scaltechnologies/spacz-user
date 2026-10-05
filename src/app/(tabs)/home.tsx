import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ExclusiveBanner } from '@/components/home/ExclusiveBanner';
import { HomeHeader } from '@/components/home/HomeHeader';
import { HomeServiceCard } from '@/components/home/HomeServiceCard';
import { formatOfferDiscount } from '@/components/home/OfferCard';
import { SectionTitle } from '@/components/common/SectionTitle';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { useOffers } from '@/hooks/useOffers';
import * as profileService from '@/services/profile.service';
import { useAuthStore } from '@/store/authStore';

export default function HomeScreen() {
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const [aspirations, setAspirations] = useState<string[]>([]);
  const { offers, status: offersStatus, refresh: refreshOffers } = useOffers();

  // Name and exams always come from the signed-in user's backend profile.
  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      profileService
        .getProfile()
        .then((profile) => !cancelled && updateUser(profile))
        .catch(() => undefined);
      profileService
        .getMyPrograms()
        .then((programs) => !cancelled && setAspirations(programs.map((program) => program.programName)))
        .catch(() => undefined);
      refreshOffers();
      return () => {
        cancelled = true;
      };
    }, [updateUser, refreshOffers])
  );

  const topOffer = offers[0];
  const bannerDescription =
    offersStatus === 'loading' || offersStatus === 'idle'
      ? 'Loading offers…'
      : offersStatus === 'error'
        ? 'Unable to load offers. Tap to retry.'
        : topOffer
          ? `${topOffer.title} · ${formatOfferDiscount(topOffer)}${offers.length > 1 ? ` · +${offers.length - 1} more` : ''}`
          : 'No offers available right now';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <HomeHeader name={user?.fullName || 'Aspirant'} aspirations={aspirations} />

        <HomeServiceCard
          icon="school-outline"
          title="Study Center"
          description="Find and book your slot in one of the best and nearest study centers"
          onPress={() => router.push('/(tabs)/study-centre')}
        />

        <SectionTitle title="Exclusively for you" />
        <ExclusiveBanner
          title="Exclusive Offers"
          description={bannerDescription}
          onPress={() => (offersStatus === 'error' ? refreshOffers() : router.push('/offers'))}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
  },
});
