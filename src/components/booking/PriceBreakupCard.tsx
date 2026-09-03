import { StyleSheet, Text, View } from 'react-native';

import { Divider } from '@/components/ui/Divider';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { PriceBreakup } from '@/types/booking';
import { formatCurrency } from '@/utils/formatting';

interface PriceBreakupCardProps {
  seatNumbers: string[];
  seatCount: number;
  pricePerSeat: number;
  breakup: PriceBreakup;
}

export function PriceBreakupCard({ seatNumbers, seatCount, pricePerSeat, breakup }: PriceBreakupCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.seatLabel}>{seatNumbers.join(', ')}</Text>
        <Text style={styles.seatSubtitle}>
          {seatCount} Seat{seatCount > 1 ? 's' : ''} x {formatCurrency(pricePerSeat)}
        </Text>
      </View>
      <Divider style={styles.divider} />
      <Row label="Discount" value={`-${formatCurrency(breakup.discount)}`} muted={breakup.discount === 0} />
      <Row label="Platform Charges" value={formatCurrency(breakup.platformCharges)} />
      <Row label="Taxes" value={formatCurrency(breakup.taxes)} />
      <Divider style={styles.divider} />
      <Row label="Total" value={formatCurrency(breakup.total)} bold />
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
    paddingVertical: 2,
  },
  rowLabel: {
    ...Typography.body,
    color: Colors.textSecondary,
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
