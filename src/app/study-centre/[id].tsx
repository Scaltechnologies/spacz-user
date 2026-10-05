import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BackButton } from '@/components/common/BackButton';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { Loader } from '@/components/ui/Loader';
import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { errorMessage } from '@/services/api';
import * as studyCentreService from '@/services/studyCentre.service';
import { useBookingStore } from '@/store/bookingStore';
import { AsyncStatus } from '@/types/common';
import { StudyCentre } from '@/types/studyCentre';
import { formatStudyCentrePrice } from '@/utils/formatting';

export default function StudyCentreDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [studyCentre, setStudyCentre] = useState<StudyCentre | null>(null);
  const [status, setStatus] = useState<AsyncStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const reset = useBookingStore((state) => state.reset);
  const setStudyCentreId = useBookingStore((state) => state.setStudyCentreId);

  const load = useCallback(() => {
    if (!id) return;
    setStatus('loading');
    setError(null);
    studyCentreService
      .getStudyCentreById(id)
      .then((result) => {
        setStudyCentre(result);
        setStatus('success');
      })
      .catch((err) => {
        setError(errorMessage(err, 'Failed to load study centre'));
        setStatus('error');
      });
  }, [id]);

  useEffect(() => {
    Promise.resolve().then(load);
  }, [load]);

  function handleBookNow() {
    if (!studyCentre) return;
    reset();
    setStudyCentreId(studyCentre.id);
    // The backend allows one booking per student per hall for overlapping dates, so exactly one seat is booked.
    router.push('/study-centre/select-date');
  }

  if (status === 'loading' || status === 'idle') return <Loader fullScreen />;
  if (status === 'error' || !studyCentre) {
    return <ErrorMessage message={error ?? 'Study centre not found'} onRetry={load} />;
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
          {studyCentre.slotsLeft != null ? (
            <View style={styles.slotsBadge}>
              <Text style={styles.slotsBadgeText}>{studyCentre.slotsLeft} Slots left</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.content}>
          <Text style={styles.name}>{studyCentre.name}</Text>

          <View style={styles.addressRow}>
            <Ionicons name="location-outline" size={16} color={Colors.textSecondary} />
            <Text style={styles.address}>{studyCentre.fullAddress}</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.price}>{formatStudyCentrePrice(studyCentre)}</Text>
            <Button
              label="Book Now"
              onPress={handleBookNow}
              disabled={studyCentre.slotsLeft === 0}
              icon={<Ionicons name="arrow-forward" size={16} color={Colors.white} />}
            />
          </View>

          <View style={styles.amenities}>
            {studyCentre.amenities.map((amenity) => (
              <Badge key={amenity} label={amenity} tone="neutral" />
            ))}
          </View>

          {studyCentre.description ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.sectionBody}>{studyCentre.description}</Text>
            </View>
          ) : null}
          {studyCentre.rules ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Rules</Text>
              <Text style={styles.sectionBody}>{studyCentre.rules}</Text>
            </View>
          ) : null}
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
  addressRow: {
    flexDirection: 'row',
    gap: Spacing.xxs,
  },
  address: {
    ...Typography.caption,
    color: Colors.textSecondary,
    flex: 1,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
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
  section: {
    marginTop: Spacing.md,
    gap: Spacing.xxs,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.text,
  },
  sectionBody: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
});
