import { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BackButton } from '@/components/common/BackButton';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';

interface ScreenContainerProps {
  children: ReactNode;
  title?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  scroll?: boolean;
  headerRight?: ReactNode;
  contentStyle?: ViewStyle;
}

export function ScreenContainer({
  children,
  title,
  showBackButton,
  onBackPress,
  scroll = false,
  headerRight,
  contentStyle,
}: ScreenContainerProps) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {(title || showBackButton) && (
        <View style={styles.header}>
          {showBackButton ? <BackButton onPress={onBackPress} /> : <View style={styles.headerSpacer} />}
          {title ? <Text style={styles.title}>{title}</Text> : <View style={{ flex: 1 }} />}
          {headerRight ?? <View style={styles.headerSpacer} />}
        </View>
      )}
      {scroll ? (
        <ScrollView
          contentContainerStyle={[styles.content, contentStyle]}
          showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.content, contentStyle]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  headerSpacer: {
    width: 36,
  },
  title: {
    ...Typography.h3,
    color: Colors.text,
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: Spacing.md,
  },
});
