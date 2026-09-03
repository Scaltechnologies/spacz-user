import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PaymentStatusBadge } from '@/components/booking/PaymentStatusBadge';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { Booking } from '@/types/booking';
import { formatDateRange } from '@/utils/date';

interface BookingCardProps {
  booking: Booking;
  onPress: () => void;
}

export function BookingCard({ booking, onPress }: BookingCardProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.imageWrap}>
        <ImagePlaceholder uri={booking.studyCentreImageUrl} icon="business-outline" />
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {booking.studyCentreName}
        </Text>
        <Text style={styles.dates}>{formatDateRange(booking.validFrom, booking.validTo)}</Text>
        <Text style={styles.seat}>Seat no: {booking.seatNumbers.join(', ')}</Text>
        <Text style={styles.bookingId}>#{booking.id.slice(-6)}</Text>
      </View>
      <PaymentStatusBadge status={booking.paymentStatus} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: Spacing.sm,
    padding: Spacing.sm,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
  },
  pressed: {
    opacity: 0.85,
  },
  imageWrap: {
    width: 64,
    height: 64,
    borderRadius: Radius.md,
    overflow: 'hidden',
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    ...Typography.bodyBold,
    color: Colors.text,
  },
  dates: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  seat: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  bookingId: {
    ...Typography.small,
    color: Colors.textMuted,
  },
});
