import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { Colors } from '@/constants/colors';
import { Radius } from '@/constants/spacing';

interface ImagePlaceholderProps {
  uri?: string | null;
  icon?: keyof typeof Ionicons.glyphMap;
  style?: StyleProp<ViewStyle>;
  borderRadius?: number;
}

export function ImagePlaceholder({ uri, icon = 'image-outline', style, borderRadius = Radius.md }: ImagePlaceholderProps) {
  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={[styles.image, { borderRadius }, style as StyleProp<Record<string, unknown>>]}
        contentFit="cover"
      />
    );
  }
  return (
    <View style={[styles.placeholder, { borderRadius }, style]}>
      <Ionicons name={icon} size={28} color={Colors.textMuted} />
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.surfaceAlt,
  },
  placeholder: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
