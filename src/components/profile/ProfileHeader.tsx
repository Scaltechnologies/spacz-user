import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';

interface ProfileHeaderProps {
  name: string;
  verified?: boolean;
}

export function ProfileHeader({ name, verified }: ProfileHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Ionicons name="person" size={28} color={Colors.textMuted} />
      </View>
      <View style={styles.nameRow}>
        <Text style={styles.name}>{name}</Text>
        {verified ? <Ionicons name="checkmark-circle" size={16} color={Colors.primary} /> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.lg,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xxs,
  },
  name: {
    ...Typography.h3,
    color: Colors.text,
  },
});
