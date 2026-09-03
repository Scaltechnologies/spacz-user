import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

import { Colors } from '@/constants/colors';
import { Radius } from '@/constants/spacing';

interface BackButtonProps {
  onPress?: () => void;
}

export function BackButton({ onPress }: BackButtonProps) {
  return (
    <Pressable
      onPress={onPress ?? (() => router.back())}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      hitSlop={8}>
      <Ionicons name="arrow-back" size={20} color={Colors.text} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
});
