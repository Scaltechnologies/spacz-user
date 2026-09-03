import { useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';

import { ScreenContainer } from '@/components/common/ScreenContainer';
import { FilterChips } from '@/components/study-centre/FilterChips';
import { NotificationItem } from '@/components/profile/NotificationItem';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Loader } from '@/components/ui/Loader';
import { Spacing } from '@/constants/spacing';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationCategory } from '@/types/notification';

const CATEGORY_LABELS: Record<NotificationCategory, string> = {
  OFFERS: 'Offers',
  UPDATES: 'Updates',
};

export default function NotificationsScreen() {
  const [category, setCategory] = useState<NotificationCategory>('OFFERS');
  const { notifications, status, error, refresh } = useNotifications(category);

  return (
    <ScreenContainer title="Notifications" showBackButton>
      <FilterChips
        options={['Offers', 'Updates']}
        selected={CATEGORY_LABELS[category]}
        onSelect={(value) => setCategory(value === 'Updates' ? 'UPDATES' : 'OFFERS')}
      />

      {status === 'loading' && <Loader />}
      {status === 'error' && <ErrorMessage message={error ?? 'Something went wrong'} onRetry={refresh} />}
      {status === 'success' && notifications.length === 0 && (
        <EmptyState icon="notifications-outline" title="No notifications yet" />
      )}
      {status === 'success' && notifications.length > 0 && (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
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
