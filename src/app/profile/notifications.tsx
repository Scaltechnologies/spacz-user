import { useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';

import { ScreenContainer } from '@/components/common/ScreenContainer';
import { SegmentedTabs } from '@/components/ui/SegmentedTabs';
import { NotificationItem } from '@/components/profile/NotificationItem';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Loader } from '@/components/ui/Loader';
import { Spacing } from '@/constants/spacing';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationCategory } from '@/types/notification';

const CATEGORY_LABELS: Record<NotificationCategory, string> = {
  OFFER: 'Offers',
  UPDATE: 'Updates',
};

const EMPTY_STATES: Record<NotificationCategory, { title: string; message: string }> = {
  OFFER: { title: 'No offers available right now', message: 'Check back later for new offers.' },
  UPDATE: { title: 'No updates available right now', message: 'New announcements will show up here.' },
};

export default function NotificationsScreen() {
  const [category, setCategory] = useState<NotificationCategory>('OFFER');
  const { notifications, status, error, refresh } = useNotifications(category);

  return (
    <ScreenContainer title="Notifications" showBackButton>
      <SegmentedTabs
        options={['Offers', 'Updates'] as const}
        selected={CATEGORY_LABELS[category] as 'Offers' | 'Updates'}
        onSelect={(value) => setCategory(value === 'Updates' ? 'UPDATE' : 'OFFER')}
      />

      {status === 'loading' && <Loader />}
      {status === 'error' && <ErrorMessage message={error ?? 'Unable to load notifications.'} onRetry={refresh} />}
      {status === 'success' && notifications.length === 0 && (
        <EmptyState
          icon="notifications-outline"
          title={EMPTY_STATES[category].title}
          message={EMPTY_STATES[category].message}
        />
      )}
      {status === 'success' && notifications.length > 0 && (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          onRefresh={refresh}
          refreshing={false}
          renderItem={({ item }) => <NotificationItem notification={item} />}
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
