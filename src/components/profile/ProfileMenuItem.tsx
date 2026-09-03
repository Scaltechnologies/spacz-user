import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text } from 'react-native';

import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';

interface ProfileMenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  destructive?: boolean;
}

export function ProfileMenuItem({ icon, label, onPress, destructive }: ProfileMenuItemProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <Ionicons name={icon} size={20} color={destructive ? Colors.error : Colors.textSecondary} />
      <Text style={[styles.label, destructive && styles.labelDestructive]}>{label}</Text>
      {!destructive && <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  pressed: {
    opacity: 0.7,
  },
  label: {
    ...Typography.body,
    color: Colors.text,
    flex: 1,
  },
  labelDestructive: {
    color: Colors.error,
  },
});
