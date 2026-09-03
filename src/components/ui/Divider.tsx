import { StyleSheet, View, ViewStyle } from 'react-native';

import { Colors } from '@/constants/colors';

export function Divider({ style }: { style?: ViewStyle }) {
  return <View style={[styles.divider, style]} />;
}

const styles = StyleSheet.create({
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.divider,
    width: '100%',
  },
});
