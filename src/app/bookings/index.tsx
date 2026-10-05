import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';

import { BookingCard } from '@/components/booking/BookingCard';
import { ScreenContainer } from '@/components/common/ScreenContainer';
import { SegmentedTabs } from '@/components/ui/SegmentedTabs';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Loader } from '@/components/ui/Loader';
import { Spacing } from '@/constants/spacing';
import { errorMessage } from '@/services/api';
import * as bookingService from '@/services/booking.service';
import { AsyncStatus } from '@/types/common';
import { Booking } from '@/types/booking';
import { todayIso } from '@/utils/date';

type StatusFilter = 'All' | 'Active' | 'Past';

export default function MyBookingsScreen() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [status, setStatus] = useState<AsyncStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');

  const load = useCallback(() => {
    let cancelled = false;
    setStatus('loading');
    setError(null);
    bookingService
      .getMyBookings()
      .then((results) => {
        if (cancelled) return;
        setBookings(results);
        setStatus('success');
      })
      .catch((err) => {
        if (cancelled) return;
        setError(errorMessage(err, 'Failed to load bookings'));
        setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Reload on focus so a booking confirmed on the details screen shows its new status.
  useFocusEffect(load);

  const today = todayIso();
  const filtered = bookings.filter((booking) => {
    const isActive = booking.validTo >= today && (booking.status === 'PENDING' || booking.status === 'CONFIRMED');
    if (statusFilter === 'Active') return isActive;
    if (statusFilter === 'Past') return !isActive;
    return true;
  });

  return (
    <ScreenContainer title="My Bookings" showBackButton>
      <SegmentedTabs<StatusFilter>
        options={['All', 'Active', 'Past']}
        selected={statusFilter}
        onSelect={setStatusFilter}
      />

      {status === 'loading' && <Loader />}
      {status === 'error' && <ErrorMessage message={error ?? 'Something went wrong'} onRetry={load} />}
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
