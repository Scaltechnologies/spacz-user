import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';

interface RatingStarsProps {
  rating: number;
  size?: number;
  maxStars?: number;
  onChange?: (rating: number) => void;
}

export function RatingStars({ rating, size = 16, maxStars = 5, onChange }: RatingStarsProps) {
  const stars = Array.from({ length: maxStars }, (_, index) => index + 1);
  const interactive = Boolean(onChange);

  return (
    <View style={styles.row}>
      {stars.map((value) => {
        const filled = value <= Math.round(rating);
        const star = (
          <Ionicons
            key={value}
            name={filled ? 'star' : 'star-outline'}
            size={size}
            color={filled ? '#FFB800' : Colors.textMuted}
          />
        );
        if (!interactive) return star;
        return (
          <Pressable key={value} onPress={() => onChange?.(value)} hitSlop={6}>
            {star}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.xxs,
  },
});
