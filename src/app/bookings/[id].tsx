import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '@/components/common/ScreenContainer';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Divider } from '@/components/ui/Divider';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { Loader } from '@/components/ui/Loader';
import { Colors } from '@/constants/colors';
import { Config } from '@/constants/config';
import { Radius, Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import * as bookingService from '@/services/booking.service';
import { Booking } from '@/types/booking';
import { formatDate } from '@/utils/date';
import { formatCurrency } from '@/utils/formatting';

export default function BookingDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [booking, setBooking] = useState<Booking | null | undefined>(undefined);

  useEffect(() => {
    if (!id) return;
    bookingService.getBookingById(id).then(setBooking);
  }, [id]);

  async function handlePayNow() {
    if (!booking) return;
    const updated = await bookingService.payBooking(booking.id);
    if (updated) setBooking(updated);
  }

  if (booking === undefined) return <Loader fullScreen />;
  if (booking === null) return <ErrorMessage message="Booking not found" />;

  const isPaid = booking.paymentStatus === 'PAID';

  return (
    <ScreenContainer title="Booking Details" showBackButton>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.imageWrap}>
          <ImagePlaceholder uri={booking.studyCentreImageUrl} icon="business-outline" />
        </View>

        <Text style={styles.centreName}>{booking.studyCentreName}</Text>
        <Text style={styles.centreLocation}>{booking.studyCentreLocation}</Text>

        <Text style={styles.bookingIdLabel}>Booking ID</Text>
        <Text style={styles.bookingId}>{booking.id}</Text>

        <View style={styles.seatRow}>
          <Ionicons name="body-outline" size={18} color={Colors.primary} />
          <Text style={styles.seatText}>Seat {booking.seatNumbers.join(', ')}</Text>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.row}>
          <View>
            <Text style={styles.value}>{formatDate(booking.validFrom)}</Text>
            <Text style={styles.label}>Valid From</Text>
          </View>
          <Ionicons name="arrow-forward" size={16} color={Colors.textMuted} />
          <View>
            <Text style={styles.value}>{formatDate(booking.validTo)}</Text>
            <Text style={styles.label}>Valid To</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View>
            <Text style={styles.value}>{formatCurrency(booking.amount)}</Text>
            <Text style={styles.label}>Amount</Text>
          </View>
          <View>
            <Text style={styles.value}>{booking.durationDays} Days</Text>
            <Text style={styles.label}>Duration</Text>
          </View>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Payment Status</Text>
          <Badge label={isPaid ? 'Paid' : 'Not Paid'} tone={isPaid ? 'success' : 'error'} />
        </View>

        {!isPaid ? <Button label="Pay Now" onPress={handlePayNow} style={styles.payButton} /> : null}

        <Text style={styles.support}>For support contact {Config.supportEmail}</Text>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 4,
    paddingBottom: Spacing.xl,
  },
  imageWrap: {
    width: '100%',
    height: 140,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  centreName: {
    ...Typography.h3,
    color: Colors.text,
  },
  centreLocation: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  bookingIdLabel: {
    ...Typography.small,
    color: Colors.textMuted,
  },
  bookingId: {
    ...Typography.captionBold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  seatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xxs,
    marginBottom: Spacing.sm,
  },
  seatText: {
    ...Typography.bodyBold,
    color: Colors.text,
  },
  divider: {
    marginBottom: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs,
  },
  value: {
    ...Typography.bodyBold,
    color: Colors.text,
  },
  label: {
    ...Typography.small,
    color: Colors.textSecondary,
  },
  payButton: {
    marginTop: Spacing.sm,
  },
  support: {
    ...Typography.small,
    color: Colors.textMuted,
    marginTop: Spacing.lg,
    textAlign: 'center',
  },
});
