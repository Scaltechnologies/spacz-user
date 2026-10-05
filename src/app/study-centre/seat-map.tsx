import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenContainer } from '@/components/common/ScreenContainer';
import { SeatLegend } from '@/components/booking/SeatLegend';
import { SeatMap as SeatMapView } from '@/components/booking/SeatMap';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Loader } from '@/components/ui/Loader';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { useSeatMap } from '@/hooks/useBooking';
import { errorMessage } from '@/services/api';
import * as bookingService from '@/services/booking.service';
import * as studyCentreService from '@/services/studyCentre.service';
import { useBookingStore } from '@/store/bookingStore';
import { StudyCentre } from '@/types/studyCentre';
import { formatDate } from '@/utils/date';

export default function SeatMapScreen() {
  const studyCentreId = useBookingStore((state) => state.studyCentreId);
  const seatCount = useBookingStore((state) => state.seatCount);
  const validFrom = useBookingStore((state) => state.validFrom);
  const durationDays = useBookingStore((state) => state.durationDays);
  const selectedSeats = useBookingStore((state) => state.selectedSeats);
  const toggleSeat = useBookingStore((state) => state.toggleSeat);
  const period = useMemo(
    () => (validFrom ? bookingService.getBookingPeriod(validFrom, durationDays) : null),
    [validFrom, durationDays]
  );
  const { blocks, isLoading, error, refresh } = useSeatMap(
    studyCentreId,
    period?.startDate ?? null,
    period?.endDate ?? null
  );
  const [studyCentre, setStudyCentre] = useState<StudyCentre | null>(null);
  const [centreError, setCentreError] = useState<string | null>(null);

  useEffect(() => {
    if (!studyCentreId) return;
    studyCentreService
      .getStudyCentreById(studyCentreId)
      .then(setStudyCentre)
      .catch((err) => setCentreError(errorMessage(err, 'Unable to load the study center. Please try again.')));
  }, [studyCentreId]);

  const insets = useSafeAreaInsets();
  const canProceed = selectedSeats.length === seatCount;
  const chosen = selectedSeats[0];

  if (centreError) return <ErrorMessage message={centreError} />;
  if (error) return <ErrorMessage message={error} onRetry={refresh} />;
  if (isLoading || !studyCentre || !period) return <Loader fullScreen />;

  return (
    // contentStyle bounds the body to the screen so the map can scroll inside it and the footer keeps its own space
    <ScreenContainer title={studyCentre.name} showBackButton contentStyle={styles.screen}>
      {/* The map gets the space that is left above the footer, and scrolls inside it, so the footer is never pushed off-screen */}
      <ScrollView style={styles.map} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <SeatLegend />
        <Text style={styles.hint}>
          {formatDate(period.startDate)} to {formatDate(period.endDate)}
        </Text>
        {blocks.length === 0 ? (
          <EmptyState icon="grid-outline" title="No seats available" message="This study center has no seating layout yet" />
        ) : (
          blocks.map((block) => (
            <View key={block.id} style={styles.mapWrap}>
              {blocks.length > 1 ? (
                <Text style={styles.blockName}>
                  {block.floorName ? `${block.floorName} · ` : ''}
                  {block.name}
                </Text>
              ) : null}
              <SeatMapView
                block={block}
                onSeatPress={(seat) =>
                  toggleSeat({
                    id: seat.id,
                    label: seat.label,
                    blockId: seat.blockId,
                    blockName: seat.blockName,
                    pricePerDay: seat.pricePerDay,
                    pricePerMonth: seat.pricePerMonth,
                  })
                }
              />
            </View>
          ))
        )}
      </ScrollView>

      {/* Shown only once a valid seat is selected; it sits above the device's bottom inset so it stays tappable */}
      {chosen ? (
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, Spacing.sm) + Spacing.xs }]}>
          <View style={styles.footerText}>
            <Text style={styles.selection} numberOfLines={1}>
              Seat {chosen.label} selected
            </Text>
            <Text style={styles.priceSub} numberOfLines={1}>
              {chosen.blockName} · {selectedSeats.length} of {seatCount}
            </Text>
          </View>
          <Button
            label="Continue"
            onPress={() => router.push('/study-centre/price-breakup')}
            disabled={!canProceed}
            icon={null}
          />
        </View>
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 0,
  },
  map: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  scrollContent: {
    gap: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  mapWrap: {
    paddingVertical: Spacing.sm,
    gap: Spacing.xs,
  },
  hint: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  blockName: {
    ...Typography.captionBold,
    color: Colors.text,
    textAlign: 'center',
  },
  footer: {
    flexShrink: 0,
    paddingHorizontal: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
  },
  footerText: {
    flex: 1,
  },
  selection: {
    ...Typography.h3,
    color: Colors.text,
  },
  priceSub: {
    ...Typography.small,
    color: Colors.textSecondary,
  },
});
