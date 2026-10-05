import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';

interface SegmentedTabsProps<T extends string> {
  options: readonly T[];
  selected: T;
  onSelect: (value: T) => void;
}

/**
 * Compact horizontal tabs (segmented control): equal-width segments in one bordered row, the selected
 * one in SPACZ blue. A plain View (not a horizontal ScrollView), so it never stretches vertically.
 */
export function SegmentedTabs<T extends string>({ options, selected, onSelect }: SegmentedTabsProps<T>) {
  return (
    <View style={styles.container} accessibilityRole="tablist">
      {options.map((option) => {
        const isSelected = option === selected;
        return (
          <Pressable
            key={option}
            onPress={() => onSelect(option)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isSelected }}
            style={({ pressed }) => [styles.tab, isSelected && styles.tabSelected, pressed && !isSelected && styles.tabPressed]}>
            <Text numberOfLines={1} style={[styles.label, isSelected && styles.labelSelected]}>
              {option}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    padding: 3,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    marginBottom: Spacing.sm,
  },
  tab: {
    flex: 1,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xs,
    borderRadius: Radius.sm,
  },
  tabSelected: {
    backgroundColor: Colors.primary,
  },
  tabPressed: {
    backgroundColor: Colors.surfaceAlt,
  },
  label: {
    ...Typography.captionBold,
    color: Colors.textSecondary,
  },
  labelSelected: {
    color: Colors.white,
  },
});
