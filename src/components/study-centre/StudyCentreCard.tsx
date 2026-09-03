import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Badge } from '@/components/ui/Badge';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { RatingStars } from '@/components/ui/RatingStars';
import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { StudyCentre } from '@/types/studyCentre';
import { formatCurrency } from '@/utils/formatting';

interface StudyCentreCardProps {
  studyCentre: StudyCentre;
  onPress: () => void;
  variant?: 'grid' | 'row';
}

export function StudyCentreCard({ studyCentre, onPress, variant = 'grid' }: StudyCentreCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.card, variant === 'row' && styles.cardRow, { opacity: 1 }]}>
      <View style={[styles.imageWrap, variant === 'row' && styles.imageWrapRow]}>
        <ImagePlaceholder uri={studyCentre.imageUrl} icon="business-outline" />
        {studyCentre.isOpen24x7 ? (
          <View style={styles.timeBadge}>
            <Text style={styles.timeBadgeText}>24/7</Text>
          </View>
        ) : null}
        <View style={styles.slotsBadge}>
          <Text style={styles.slotsBadgeText}>{studyCentre.slotsLeft} Slots left</Text>
        </View>
      </View>
      <View style={styles.info}>
        <View style={styles.ratingRow}>
          <RatingStars rating={studyCentre.rating} size={12} />
          <Text style={styles.ratingText}>
            {studyCentre.rating} ({studyCentre.ratingCount.toLocaleString('en-IN')})
          </Text>
        </View>
        <Text style={styles.name} numberOfLines={1}>
          {studyCentre.name}
        </Text>
        <Text style={styles.location} numberOfLines={1}>
          {studyCentre.location}
        </Text>
        <View style={styles.priceRow}>
          {studyCentre.originalPricePerMonth ? (
            <Text style={styles.originalPrice}>{formatCurrency(studyCentre.originalPricePerMonth)}</Text>
          ) : null}
          <Text style={styles.price}>{formatCurrency(studyCentre.pricePerMonth)}/month</Text>
        </View>
        {studyCentre.discountLabel ? <Badge label={studyCentre.discountLabel} tone="primary" /> : null}
      </View>
    </Pressable>
  );
}

const CARD_WIDTH = 180;

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: Colors.background,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  cardRow: {
    width: '100%',
    flexDirection: 'row',
  },
  imageWrap: {
    width: '100%',
    height: 100,
    position: 'relative',
  },
  imageWrapRow: {
    width: 110,
    height: 'auto',
  },
  timeBadge: {
    position: 'absolute',
    top: Spacing.xxs,
    left: Spacing.xxs,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: Radius.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  timeBadgeText: {
    ...Typography.small,
    color: Colors.white,
    fontWeight: '700',
  },
  slotsBadge: {
    position: 'absolute',
    top: Spacing.xxs,
    right: Spacing.xxs,
    backgroundColor: Colors.error,
    borderRadius: Radius.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  slotsBadgeText: {
    ...Typography.small,
    color: Colors.white,
    fontWeight: '700',
  },
  info: {
    padding: Spacing.sm,
    gap: 4,
    flex: 1,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    ...Typography.small,
    color: Colors.textSecondary,
  },
  name: {
    ...Typography.bodyBold,
    color: Colors.text,
  },
  location: {
    ...Typography.small,
    color: Colors.textSecondary,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginTop: 2,
  },
  originalPrice: {
    ...Typography.small,
    color: Colors.textMuted,
    textDecorationLine: 'line-through',
  },
  price: {
    ...Typography.captionBold,
    color: Colors.text,
  },
});
