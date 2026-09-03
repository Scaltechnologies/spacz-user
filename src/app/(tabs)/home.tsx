import { router } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ExclusiveBanner } from '@/components/home/ExclusiveBanner';
import { HomeHeader } from '@/components/home/HomeHeader';
import { HomeServiceCard } from '@/components/home/HomeServiceCard';
import { SectionTitle } from '@/components/common/SectionTitle';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { useAuthStore } from '@/store/authStore';

export default function HomeScreen() {
  const user = useAuthStore((state) => state.user);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <HomeHeader name={user?.fullName ?? 'Aspirant'} />

        <HomeServiceCard
          icon="school-outline"
          title="Study Center"
          description="Find and book your slot in one of the best and nearest study centers"
          onPress={() => router.push('/(tabs)/study-centre')}
        />
        <HomeServiceCard
          icon="fast-food-outline"
          title="Meal Cards"
          description="Find and book your slot in one of the best and nearest meal providers"
          onPress={() => router.push('/(tabs)/meal-card')}
        />

        <SectionTitle title="Exclusively for you" />
        <ExclusiveBanner
          title="Exclusive Offers"
          description="Get early access to new study centres and meal partners near you."
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
