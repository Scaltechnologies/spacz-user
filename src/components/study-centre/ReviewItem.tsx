import { StyleSheet, Text, View } from 'react-native';

import { RatingStars } from '@/components/ui/RatingStars';
import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { StudyCentreReview } from '@/types/studyCentre';
import { formatDate } from '@/utils/date';

interface ReviewItemProps {
  review: StudyCentreReview;
}

export function ReviewItem({ review }: ReviewItemProps) {
  return (
    <View style={styles.container}>
      <RatingStars rating={review.rating} size={14} />
      <Text style={styles.title}>{review.title}</Text>
      <Text style={styles.comment}>{review.comment}</Text>
      <View style={styles.author}>
        <View style={styles.avatar} />
        <View>
          <Text style={styles.authorName}>{review.authorName}</Text>
          <Text style={styles.postedOn}>Posted on {formatDate(review.postedOn)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.sm,
    gap: Spacing.xxs,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.divider,
  },
  title: {
    ...Typography.bodyBold,
    color: Colors.text,
  },
  comment: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  author: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.xxs,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceAlt,
  },
  authorName: {
    ...Typography.captionBold,
    color: Colors.text,
  },
  postedOn: {
    ...Typography.small,
    color: Colors.textMuted,
  },
});
