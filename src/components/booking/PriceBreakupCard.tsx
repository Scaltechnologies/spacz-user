import { StyleSheet, Text, View } from 'react-native';

import { Divider } from '@/components/ui/Divider';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { BookingQuote } from '@/types/booking';
import { formatCurrency } from '@/utils/formatting';

interface PriceBreakupCardProps {
  seatNumbers: string[];
  /** Server-computed quote (POST /api/bookings/quote). */
  quote: BookingQuote;
}

export function PriceBreakupCard({ seatNumbers, quote }: PriceBreakupCardProps) {
  const unitLabel =
    quote.plan === 'MONTHLY'
      ? `${quote.units} Month${quote.units === 1 ? '' : 's'}`
      : `${quote.units} Day${quote.units === 1 ? '' : 's'}`;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.seatLabel}>{seatNumbers.join(', ')}</Text>
        <Text style={styles.seatSubtitle}>
          {unitLabel} x {formatCurrency(quote.unitPrice)}
        </Text>
      </View>
      <Divider style={styles.divider} />
      <Row label="Seat price" value={formatCurrency(quote.baseAmount)} />
      <Row
        label={quote.offerTitle ? `Discount (${quote.offerTitle})` : 'Discount'}
        value={`-${formatCurrency(quote.discountAmount)}`}
        muted={quote.discountAmount === 0}
      />
      <Row label="Platform Charges" value={formatCurrency(quote.platformCharges)} />
      <Row label="Taxes" value={formatCurrency(quote.taxes)} />
      <Divider style={styles.divider} />
      <Row label="Total" value={formatCurrency(quote.totalPrice)} bold />
    </View>
  );
}

function Row({ label, value, bold, muted }: { label: string; value: string; bold?: boolean; muted?: boolean }) {
  return (
    <View style={styles.row}>
      <Text style={[styles.rowLabel, bold && styles.rowLabelBold]}>{label}</Text>
      <Text style={[styles.rowValue, bold && styles.rowValueBold, muted && styles.rowValueMuted]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.xs,
  },
  headerRow: {
    gap: 2,
  },
  seatLabel: {
    ...Typography.bodyBold,
    color: Colors.text,
  },
  seatSubtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  divider: {
    marginVertical: Spacing.xs,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    paddingVertical: 2,
  },
  rowLabel: {
    ...Typography.body,
    color: Colors.textSecondary,
    flexShrink: 1,
  },
  rowLabelBold: {
    ...Typography.bodyBold,
    color: Colors.text,
  },
  rowValue: {
    ...Typography.body,
    color: Colors.text,
  },
  rowValueBold: {
    ...Typography.h3,
    color: Colors.text,
  },
  rowValueMuted: {
    color: Colors.textMuted,
  },
});
