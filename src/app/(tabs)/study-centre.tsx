import { router, useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
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
import { Typography } from '@/constants/typography';
import { useLocation } from '@/hooks/useLocation';
import { usePrograms, useStudyCentreLocations, useStudyCentres } from '@/hooks/useStudyCentres';
import * as profileService from '@/services/profile.service';
import { StudyCentre } from '@/types/studyCentre';

const NEAR_ME = 'Near Me';
const NEAR_ME_RADIUS_KM = 10;

export default function StudyCentreScreen() {
  const { getCurrentPosition, isLocating, locationError } = useLocation();
  const locations = useStudyCentreLocations();
  const { studyCentres, status, error, filters, setFilters, refresh } = useStudyCentres();
  const { programs } = usePrograms();
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [myProgramIds, setMyProgramIds] = useState<number[]>([]);
  const selectedProgram = programs.find((program) => program.id === filters.programId);

  // The student's exams (chosen at registration) put matching halls first.
  useFocusEffect(
    useCallback(() => {
      profileService
        .getMyPrograms()
        .then((items) => setMyProgramIds(items.map((item) => item.programId)))
        .catch(() => undefined);
    }, [])
  );

  const recommended = useMemo(() => {
    const matches = (centre: StudyCentre) => centre.programs.some((program) => myProgramIds.includes(program.id));
    return [...studyCentres].sort((a, b) => Number(matches(b)) - Number(matches(a)));
  }, [studyCentres, myProgramIds]);

  async function handleLocation(value: string | null) {
    const { latitude, longitude, radiusKm, city, ...rest } = filters;
    if (value === NEAR_ME) {
      setSelectedLocation(NEAR_ME);
      const position = await getCurrentPosition();
      if (!position) {
        setSelectedLocation(null);
        setFilters(rest);
        return;
      }
      setFilters({ ...rest, ...position, radiusKm: NEAR_ME_RADIUS_KM });
      return;
    }
    setSelectedLocation(value);
    setFilters(value ? { ...rest, city: value } : rest);
  }

  const isFiltered = Boolean(filters.query?.trim() || filters.programId || filters.city);
  const emptyTitle =
    selectedLocation === NEAR_ME
      ? 'No study centers found nearby'
      : filters.query?.trim()
        ? 'No study centers match your search'
        : 'No study centers found';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <StudyCentreSearchBar
          value={filters.query ?? ''}
          onChangeText={(text) => setFilters({ ...filters, query: text })}
        />

        <FilterChips
          options={[NEAR_ME, ...locations.map((location) => location.city)]}
          selected={selectedLocation}
          onSelect={handleLocation}
          leadingIcon="navigate-outline"
        />
        {isLocating ? <Text style={styles.note}>Finding study centers near you…</Text> : null}
        {locationError ? <Text style={styles.note}>{locationError}</Text> : null}

        {programs.length > 0 ? (
          <View style={styles.section}>
            <SectionTitle title="Aspiring for" />
            <FilterChips
              options={programs.map((program) => program.name)}
              selected={selectedProgram?.name ?? null}
              onSelect={(value) =>
                setFilters({ ...filters, programId: programs.find((program) => program.name === value)?.id })
              }
            />
          </View>
        ) : null}

        {status === 'loading' && <Loader />}
        {status === 'error' && (
          <ErrorMessage message={error ?? 'Unable to load study centers. Please try again.'} onRetry={refresh} />
        )}
        {status === 'success' && studyCentres.length === 0 && (
          <EmptyState
            icon="business-outline"
            title={emptyTitle}
            message={isFiltered || selectedLocation ? 'Try adjusting your search or filters' : 'Check back soon'}
          />
        )}

        {status === 'success' && studyCentres.length > 0 && (
          <View style={styles.section}>
            <SectionTitle title="Recommended" />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
              {recommended.map((centre) => (
                <StudyCentreCard
                  key={centre.id}
                  studyCentre={centre}
                  onPress={() => router.push({ pathname: '/study-centre/[id]', params: { id: centre.id } })}
                />
              ))}
            </ScrollView>
          </View>
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
  note: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
});
