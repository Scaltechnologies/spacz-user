import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BackButton } from '@/components/common/BackButton';
import { ReviewItem } from '@/components/study-centre/ReviewItem';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { Loader } from '@/components/ui/Loader';
import { RatingStars } from '@/components/ui/RatingStars';
import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import * as studyCentreService from '@/services/studyCentre.service';
import { useBookingStore } from '@/store/bookingStore';
import { AsyncStatus } from '@/types/common';
import { StudyCentre } from '@/types/studyCentre';
import { formatCurrency } from '@/utils/formatting';

export default function StudyCentreDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [studyCentre, setStudyCentre] = useState<StudyCentre | null>(null);
  const [status, setStatus] = useState<AsyncStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const reset = useBookingStore((state) => state.reset);
  const setStudyCentreId = useBookingStore((state) => state.setStudyCentreId);

  useEffect(() => {
    if (!id) return;
    Promise.resolve().then(() => setStatus('loading'));
    studyCentreService
      .getStudyCentreById(id)
      .then((result) => {
        setStudyCentre(result);
        setStatus('success');
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load study centre');
        setStatus('error');
      });
  }, [id]);

  function handleBookNow() {
    if (!studyCentre) return;
    reset();
    setStudyCentreId(studyCentre.id);
    router.push('/study-centre/select-seats');
  }

  if (status === 'loading' || status === 'idle') return <Loader fullScreen />;
  if (status === 'error' || !studyCentre) {
    return <ErrorMessage message={error ?? 'Study centre not found'} />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageWrap}>
          <ImagePlaceholder uri={studyCentre.imageUrl} icon="business-outline" borderRadius={0} />
          <View style={styles.imageHeader}>
            <BackButton />
          </View>
          {studyCentre.isOpen24x7 ? (
            <View style={styles.timeBadge}>
              <Text style={styles.timeBadgeText}>24/7</Text>
            </View>
          ) : null}
          <View style={styles.slotsBadge}>
            <Text style={styles.slotsBadgeText}>{studyCentre.slotsLeft} Slots left</Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.name}>{studyCentre.name}</Text>
          <View style={styles.ratingRow}>
            <RatingStars rating={studyCentre.rating} size={14} />
            <Text style={styles.ratingText}>
              {studyCentre.rating} ({studyCentre.ratingCount.toLocaleString('en-IN')})
            </Text>
          </View>

          <View style={styles.addressRow}>
            <Ionicons name="location-outline" size={16} color={Colors.textSecondary} />
            <Text style={styles.address}>{studyCentre.fullAddress}</Text>
          </View>

          {studyCentre.discountLabel ? (
            <View style={styles.discountBanner}>
              <Ionicons name="pricetag-outline" size={18} color={Colors.primary} />
              <View style={{ flex: 1 }}>
                <Text style={styles.discountTitle}>{studyCentre.discountLabel}</Text>
                <Text style={styles.discountSubtitle}>Book now and save on your first booking.</Text>
              </View>
            </View>
          ) : null}

          <View style={styles.priceRow}>
            <View>
              {studyCentre.originalPricePerMonth ? (
                <Text style={styles.originalPrice}>{formatCurrency(studyCentre.originalPricePerMonth)}</Text>
              ) : null}
              <Text style={styles.price}>{formatCurrency(studyCentre.pricePerMonth)}/month</Text>
            </View>
            <Button label="Book Now" onPress={handleBookNow} icon={<Ionicons name="arrow-forward" size={16} color={Colors.white} />} />
          </View>

          <View style={styles.amenities}>
            {studyCentre.amenities.map((amenity) => (
              <Badge key={amenity} label={amenity} tone="neutral" />
            ))}
          </View>

          <View style={styles.reviewsSection}>
            <Text style={styles.reviewsTitle}>Reviews</Text>
            {studyCentre.reviews.length === 0 ? (
              <Text style={styles.noReviews}>No reviews yet.</Text>
            ) : (
              studyCentre.reviews.map((review) => <ReviewItem key={review.id} review={review} />)
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  imageWrap: {
    width: '100%',
    height: 220,
  },
  imageHeader: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.md,
  },
  timeBadge: {
    position: 'absolute',
    bottom: Spacing.sm,
    left: Spacing.md,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.xs,
    paddingVertical: 4,
  },
  timeBadgeText: {
    ...Typography.captionBold,
    color: Colors.white,
  },
  slotsBadge: {
    position: 'absolute',
    bottom: Spacing.sm,
    right: Spacing.md,
    backgroundColor: Colors.error,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.xs,
    paddingVertical: 4,
  },
  slotsBadgeText: {
    ...Typography.captionBold,
    color: Colors.white,
  },
  content: {
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  name: {
    ...Typography.h2,
    color: Colors.text,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xxs,
  },
  ratingText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  addressRow: {
    flexDirection: 'row',
    gap: Spacing.xxs,
  },
  address: {
    ...Typography.caption,
    color: Colors.textSecondary,
    flex: 1,
  },
  discountBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.md,
    padding: Spacing.sm,
  },
  discountTitle: {
    ...Typography.bodyBold,
    color: Colors.primaryDark,
  },
  discountSubtitle: {
    ...Typography.small,
    color: Colors.primaryDark,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  originalPrice: {
    ...Typography.caption,
    color: Colors.textMuted,
    textDecorationLine: 'line-through',
  },
  price: {
    ...Typography.h3,
    color: Colors.text,
  },
  amenities: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xxs,
    marginTop: Spacing.xs,
  },
  reviewsSection: {
    marginTop: Spacing.md,
  },
  reviewsTitle: {
    ...Typography.h3,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  noReviews: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
});
