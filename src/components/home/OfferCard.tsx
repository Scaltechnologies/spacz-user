import { StyleSheet, Text, View } from 'react-native';

import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { Offer } from '@/types/offer';
import { formatDisplayDate } from '@/utils/date';
import { formatCurrency } from '@/utils/formatting';

export function formatOfferDiscount(offer: Offer): string {
  return offer.discountType === 'PERCENTAGE'
    ? `${offer.discountValue}% off${offer.maxDiscount != null ? ` (up to ${formatCurrency(offer.maxDiscount)})` : ''}`
    : `${formatCurrency(offer.discountValue)} off`;
}

/** An admin-managed offer, in the same card style as the Home "Exclusive Offers" banner. */
export function OfferCard({ offer }: { offer: Offer }) {
  const conditions = [
    offer.firstBookingOnly ? 'First booking only' : null,
    offer.applicablePlan !== 'ANY' ? `${offer.applicablePlan === 'MONTHLY' ? 'Monthly' : 'Daily'} plans` : null,
    offer.minBookingAmount != null ? `Min. booking ${formatCurrency(offer.minBookingAmount)}` : null,
  ].filter(Boolean);

  return (
    <View style={styles.card}>
      {offer.imageUrl ? (
        <View style={styles.imageWrap}>
          <ImagePlaceholder uri={offer.imageUrl} icon="pricetag-outline" />
        </View>
      ) : null}
      <View style={styles.body}>
        <Text style={styles.discount}>{formatOfferDiscount(offer)}</Text>
        <Text style={styles.title}>{offer.title}</Text>
        {offer.description ? <Text style={styles.description}>{offer.description}</Text> : null}
        {conditions.length ? <Text style={styles.meta}>{conditions.join(' · ')}</Text> : null}
        {offer.terms ? <Text style={styles.meta}>{offer.terms}</Text> : null}
        <Text style={styles.validity}>Valid till {formatDisplayDate(offer.endAt)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.primaryDark,
    borderRadius: Radius.lg,
    overflow: 'hidden',
  },
  imageWrap: {
    width: '100%',
    height: 120,
  },
  body: {
    padding: Spacing.lg,
    gap: Spacing.xxs,
  },
  discount: {
    ...Typography.captionBold,
    color: 'rgba(255,255,255,0.8)',
  },
  title: {
    ...Typography.h3,
    color: Colors.white,
  },
  description: {
    ...Typography.caption,
    color: 'rgba(255,255,255,0.8)',
  },
  meta: {
    ...Typography.small,
    color: 'rgba(255,255,255,0.7)',
  },
  validity: {
    ...Typography.small,
    color: Colors.white,
    marginTop: Spacing.xxs,
  },
});
