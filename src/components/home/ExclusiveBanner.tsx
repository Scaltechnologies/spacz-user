import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';

interface ExclusiveBannerProps {
  title: string;
  description: string;
  onPress?: () => void;
}

export function ExclusiveBanner({ title, description, onPress }: ExclusiveBannerProps) {
  return (
    <Pressable onPress={onPress} disabled={!onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.text}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      {onPress ? <Ionicons name="chevron-forward" size={20} color={Colors.white} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.primaryDark,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  pressed: {
    opacity: 0.9,
  },
  text: {
    flex: 1,
    gap: Spacing.xxs,
  },
  title: {
    ...Typography.h3,
    color: Colors.white,
  },
  description: {
    ...Typography.caption,
    color: 'rgba(255,255,255,0.8)',
  },
});
