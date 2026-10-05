import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PaymentStatusBadge } from '@/components/booking/PaymentStatusBadge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Divider } from '@/components/ui/Divider';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Loader } from '@/components/ui/Loader';
import { Colors } from '@/constants/colors';
import { Config } from '@/constants/config';
import { Radius, Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { errorMessage } from '@/services/api';
import * as bookingService from '@/services/booking.service';
import { useBookingStore } from '@/store/bookingStore';
import { Booking } from '@/types/booking';
import { formatDate } from '@/utils/date';
import { formatCurrency } from '@/utils/formatting';

export default function ConfirmationScreen() {
  const { bookingIds } = useLocalSearchParams<{ bookingIds: string }>();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [payError, setPayError] = useState<string | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  const resetBookingStore = useBookingStore((state) => state.reset);

  useEffect(() => {
    const ids = (bookingIds ?? '').split(',').filter(Boolean);
    if (ids.length === 0) return;
    Promise.all(ids.map((id) => bookingService.getBookingById(id)))
      .then(setBookings)
      .catch((err) => setLoadError(errorMessage(err, 'Failed to load booking')))
      .finally(() => setIsLoading(false));
  }, [bookingIds]);

  // The backend has no payment API; POST /api/bookings/{id}/confirm is its post-payment step.
  async function handlePayNow() {
    setIsPaying(true);
    setPayError(null);
    try {
      const updated = await Promise.all(
        bookings.map((item) => (item.status === 'PENDING' ? bookingService.confirmBooking(item.id) : item))
      );
      setBookings(updated);
    } catch (err) {
      setPayError(errorMessage(err, 'Could not confirm booking'));
    } finally {
      setIsPaying(false);
    }
  }

  function handleBackToHome() {
    resetBookingStore();
    router.replace('/(tabs)/home');
  }

  if (loadError) return <ErrorMessage message={loadError} />;
  if (isLoading || bookings.length === 0) return <Loader fullScreen />;

  const booking = bookings[0];
  const amount = bookings.reduce((sum, item) => sum + item.amount, 0);
  const isPaid = bookings.every((item) => item.paymentStatus === 'PAID');
  const isPending = bookings.some((item) => item.status === 'PENDING');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.successIcon}>
          <Ionicons name="checkmark" size={28} color={Colors.white} />
        </View>
        <Text style={styles.title}>{isPaid ? 'Payment Successful' : 'Booking Successful'}</Text>
        <Text style={styles.subtitle}>
          {isPaid
            ? 'Your seat has been booked and payment received successfully.'
            : 'Your seat has been reserved. Complete the payment to confirm your booking.'}
        </Text>

        <Text style={styles.bookingIdLabel}>Booking ID</Text>
        <Text style={styles.bookingId}>{bookings.map((item) => item.reference).join(', ')}</Text>

        <Card style={styles.seatCard} noPadding>
          <View style={styles.seatHeader}>
            <View style={styles.seatIcon}>
              <Ionicons name="body-outline" size={20} color={Colors.white} />
            </View>
            <View>
              <Text style={styles.seatNumber}>{bookings.flatMap((item) => item.seatNumbers).join(', ')}</Text>
              <Text style={styles.seatLabel}>Seat Number</Text>
            </View>
          </View>
          <View style={styles.seatBody}>
            <Text style={styles.centreName}>{booking.studyCentreName}</Text>
            <Text style={styles.centreLocation}>{booking.studyCentreLocation}</Text>

            <View style={styles.dateRow}>
              <View>
                <Text style={styles.dateValue}>{formatDate(booking.validFrom)}</Text>
                <Text style={styles.dateLabel}>Valid From</Text>
              </View>
              <Ionicons name="arrow-forward" size={16} color={Colors.textMuted} />
              <View>
                <Text style={styles.dateValue}>{formatDate(booking.validTo)}</Text>
                <Text style={styles.dateLabel}>Valid To</Text>
              </View>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.dateRow}>
              <View>
                <Text style={styles.dateValue}>{formatCurrency(amount)}</Text>
                <Text style={styles.dateLabel}>Amount</Text>
              </View>
              <View>
                <Text style={styles.dateValue}>{bookingService.formatBookingDuration(booking)}</Text>
                <Text style={styles.dateLabel}>Duration</Text>
              </View>
            </View>

            <View style={styles.paymentRow}>
              <Text style={styles.dateLabel}>Payment Status</Text>
              <PaymentStatusBadge status={isPaid ? 'PAID' : booking.paymentStatus} />
            </View>

            {isPending ? (
              <View style={styles.dueRow}>
                <View>
                  <Text style={styles.dueAmount}>{formatCurrency(amount)}</Text>
                  <Text style={styles.dateLabel}>Total Due</Text>
                </View>
                <Button label="Pay Now" onPress={handlePayNow} loading={isPaying} />
              </View>
            ) : null}
            {payError ? <Text style={styles.payError}>{payError}</Text> : null}
          </View>
        </Card>

        <Text style={styles.support}>For support contact {Config.supportEmail}</Text>
      </View>

      <Button label="Back to Home" onPress={handleBackToHome} variant="outline" style={styles.button} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  payError: {
    ...Typography.caption,
    color: Colors.error,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.lg,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: Spacing.xl,
    gap: Spacing.xxs,
  },
  successIcon: {
    width: 56,
    height: 56,
    borderRadius: Radius.full,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  title: {
    ...Typography.h2,
    color: Colors.text,
  },
  subtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  bookingIdLabel: {
    ...Typography.small,
    color: Colors.textMuted,
  },
  bookingId: {
    ...Typography.captionBold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  seatCard: {
    width: '100%',
  },
  seatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    padding: Spacing.md,
    borderTopLeftRadius: Radius.lg,
    borderTopRightRadius: Radius.lg,
  },
  seatIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  seatNumber: {
    ...Typography.h3,
    color: Colors.white,
  },
  seatLabel: {
    ...Typography.small,
    color: 'rgba(255,255,255,0.8)',
  },
  seatBody: {
    padding: Spacing.md,
    gap: 4,
  },
  centreName: {
    ...Typography.bodyBold,
    color: Colors.text,
  },
  centreLocation: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs,
  },
  dateValue: {
    ...Typography.bodyBold,
    color: Colors.text,
  },
  dateLabel: {
    ...Typography.small,
    color: Colors.textSecondary,
  },
  divider: {
    marginVertical: Spacing.xxs,
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs,
  },
  dueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  dueAmount: {
    ...Typography.h3,
    color: Colors.error,
  },
  support: {
    ...Typography.small,
    color: Colors.textMuted,
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  button: {
    marginBottom: Spacing.xl,
  },
});
