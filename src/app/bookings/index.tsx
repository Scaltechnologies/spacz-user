import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';

import { BookingCard } from '@/components/booking/BookingCard';
import { ScreenContainer } from '@/components/common/ScreenContainer';
import { FilterChips } from '@/components/study-centre/FilterChips';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Loader } from '@/components/ui/Loader';
import { Spacing } from '@/constants/spacing';
import * as bookingService from '@/services/booking.service';
import { AsyncStatus } from '@/types/common';
import { Booking, BookingType } from '@/types/booking';
import { todayIso } from '@/utils/date';

const TYPE_LABELS: Record<BookingType, string> = {
  STUDY_CIRCLE: 'Study circle',
  MEAL_CARD: 'Meal Cards',
};

type StatusFilter = 'All' | 'Active' | 'Past';

export default function MyBookingsScreen() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [status, setStatus] = useState<AsyncStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<BookingType>('STUDY_CIRCLE');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');

  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (!cancelled) {
        setStatus('loading');
        setError(null);
      }
    });
    bookingService
      .getMyBookings()
      .then((results) => {
        if (cancelled) return;
        setBookings(results);
        setStatus('success');
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Failed to load bookings');
        setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, [reloadToken]);

  const refresh = useCallback(() => setReloadToken((token) => token + 1), []);

  const today = todayIso();
  const filtered = bookings.filter((booking) => {
    if (booking.type !== typeFilter) return false;
    if (statusFilter === 'Active') return booking.validTo >= today;
    if (statusFilter === 'Past') return booking.validTo < today;
    return true;
  });

  return (
    <ScreenContainer title="My Bookings" showBackButton>
      <FilterChips
        options={['Study circle', 'Meal Cards']}
        selected={TYPE_LABELS[typeFilter]}
        onSelect={(value) => setTypeFilter(value === 'Meal Cards' ? 'MEAL_CARD' : 'STUDY_CIRCLE')}
      />
      <FilterChips
        options={['All', 'Active', 'Past']}
        selected={statusFilter}
        onSelect={(value) => setStatusFilter((value as StatusFilter) ?? 'All')}
      />

      {status === 'loading' && <Loader />}
      {status === 'error' && <ErrorMessage message={error ?? 'Something went wrong'} onRetry={refresh} />}
      {status === 'success' && filtered.length === 0 && (
        <EmptyState icon="calendar-outline" title="No bookings found" message="Your bookings will show up here" />
      )}

      {status === 'success' && filtered.length > 0 && (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <BookingCard booking={item} onPress={() => router.push({ pathname: '/bookings/[id]', params: { id: item.id } })} />
          )}
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    paddingBottom: Spacing.xl,
  },
});
