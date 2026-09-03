import { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Loader } from '@/components/ui/Loader';
import { RatingStars } from '@/components/ui/RatingStars';
import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import * as mealCardService from '@/services/mealCard.service';
import { AsyncStatus } from '@/types/common';
import { MealCard } from '@/types/mealCard';
import { formatCurrency } from '@/utils/formatting';

export default function MealCardScreen() {
  const [mealCards, setMealCards] = useState<MealCard[]>([]);
  const [status, setStatus] = useState<AsyncStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (!cancelled) {
        setStatus('loading');
        setError(null);
      }
    });
    mealCardService
      .getMealCards()
      .then((results) => {
        if (cancelled) return;
        setMealCards(results);
        setStatus('success');
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Failed to load meal cards');
        setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, [reloadToken]);

  const refresh = useCallback(() => setReloadToken((token) => token + 1), []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Meal Cards</Text>

      {status === 'loading' && <Loader />}
      {status === 'error' && <ErrorMessage message={error ?? 'Something went wrong'} onRetry={refresh} />}
      {status === 'success' && mealCards.length === 0 && (
        <EmptyState icon="fast-food-outline" title="No meal providers available" />
      )}

      {status === 'success' && mealCards.length > 0 && (
        <FlatList
          data={mealCards}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.imageWrap}>
                <ImagePlaceholder uri={item.imageUrl} icon="fast-food-outline" />
              </View>
              <View style={styles.info}>
                <Text style={styles.name}>{item.vendorName}</Text>
                <Text style={styles.location}>{item.location}</Text>
                <RatingStars rating={item.rating} size={12} />
                <Text style={styles.price}>
                  {formatCurrency(item.pricePerMonth)}/month · {item.mealsPerDay} meals/day
                </Text>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.lg,
  },
  title: {
    ...Typography.h2,
    color: Colors.text,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  list: {
    gap: Spacing.sm,
    paddingBottom: Spacing.xl,
  },
  card: {
    flexDirection: 'row',
    gap: Spacing.sm,
    padding: Spacing.sm,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  imageWrap: {
    width: 72,
    height: 72,
    borderRadius: Radius.md,
    overflow: 'hidden',
  },
  info: {
    flex: 1,
    gap: 4,
  },
  name: {
    ...Typography.bodyBold,
    color: Colors.text,
  },
  location: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  price: {
    ...Typography.captionBold,
    color: Colors.text,
  },
});
