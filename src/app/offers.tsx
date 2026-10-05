import { FlatList, StyleSheet } from 'react-native';

import { ScreenContainer } from '@/components/common/ScreenContainer';
import { OfferCard } from '@/components/home/OfferCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Loader } from '@/components/ui/Loader';
import { Spacing } from '@/constants/spacing';
import { useOffers } from '@/hooks/useOffers';

export default function OffersScreen() {
  const { offers, status, error, refresh } = useOffers();

  return (
    <ScreenContainer title="Exclusive Offers" showBackButton>
      {(status === 'loading' || status === 'idle') && <Loader />}
      {status === 'error' && <ErrorMessage message={error ?? 'Unable to load offers.'} onRetry={refresh} />}
      {status === 'success' && offers.length === 0 && (
        <EmptyState
          icon="pricetag-outline"
          title="No offers available right now"
          message="Check back later for new offers."
        />
      )}
      {status === 'success' && offers.length > 0 && (
        <FlatList
          data={offers}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          onRefresh={refresh}
          refreshing={false}
          renderItem={({ item }) => <OfferCard offer={item} />}
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
    paddingBottom: Spacing.xl,
  },
});
