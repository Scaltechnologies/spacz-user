import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SectionTitle } from '@/components/common/SectionTitle';
import { FilterChips } from '@/components/study-centre/FilterChips';
import { StudyCentreCard } from '@/components/study-centre/StudyCentreCard';
import { StudyCentreSearchBar } from '@/components/study-centre/StudyCentreSearchBar';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Loader } from '@/components/ui/Loader';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { useLocation } from '@/hooks/useLocation';
import { useStudyCentres } from '@/hooks/useStudyCentres';
import { AspiringCategory, ASPIRING_CATEGORIES } from '@/types/common';

const LOCATIONS = ['Near Me', 'Ameerpet', 'SR Nagar'];

export default function StudyCentreScreen() {
  const { currentLocation, setCurrentLocation } = useLocation();
  const { studyCentres, status, error, filters, setFilters, refresh } = useStudyCentres();

  const topRated = [...studyCentres].sort((a, b) => b.rating - a.rating);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <StudyCentreSearchBar
          value={filters.query ?? ''}
          onChangeText={(text) => setFilters({ ...filters, query: text })}
        />

        <FilterChips
          options={LOCATIONS}
          selected={LOCATIONS.includes(currentLocation) ? currentLocation : 'Near Me'}
          onSelect={(value) => setCurrentLocation(value ?? 'Near Me')}
          leadingIcon="navigate-outline"
        />

        <View style={styles.section}>
          <SectionTitle title="Aspiring for" />
          <FilterChips
            options={ASPIRING_CATEGORIES}
            selected={filters.aspiringFor ?? null}
            onSelect={(value) => setFilters({ ...filters, aspiringFor: (value as AspiringCategory) ?? undefined })}
          />
        </View>

        {status === 'loading' && <Loader />}
        {status === 'error' && <ErrorMessage message={error ?? 'Something went wrong'} onRetry={refresh} />}
        {status === 'success' && studyCentres.length === 0 && (
          <EmptyState icon="business-outline" title="No study centres found" message="Try adjusting your filters" />
        )}

        {status === 'success' && studyCentres.length > 0 && (
          <>
            <View style={styles.section}>
              <SectionTitle title="Recommended" />
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
                {studyCentres.map((centre) => (
                  <StudyCentreCard
                    key={centre.id}
                    studyCentre={centre}
                    onPress={() => router.push({ pathname: '/study-centre/[id]', params: { id: centre.id } })}
                  />
                ))}
              </ScrollView>
            </View>

            <View style={styles.section}>
              <SectionTitle title="Top Rated" />
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
                {topRated.map((centre) => (
                  <StudyCentreCard
                    key={centre.id}
                    studyCentre={centre}
                    onPress={() => router.push({ pathname: '/study-centre/[id]', params: { id: centre.id } })}
                  />
                ))}
              </ScrollView>
            </View>
          </>
        )}
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
    gap: Spacing.md,
  },
  section: {
    gap: Spacing.xs,
  },
  row: {
    gap: Spacing.sm,
  },
});
