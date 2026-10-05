import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';

interface FilterChipsProps {
  options: string[];
  selected: string | null;
  onSelect: (value: string | null) => void;
  leadingIcon?: keyof typeof Ionicons.glyphMap;
}

export function FilterChips({ options, selected, onSelect, leadingIcon }: FilterChipsProps) {
  return (
    // flexGrow 0: a horizontal ScrollView in a column would otherwise grow to fill the height and stretch the chips
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll} contentContainerStyle={styles.row}>
      {options.map((option, index) => {
        const isSelected = selected === option;
        return (
          <Pressable
            key={option}
            onPress={() => onSelect(isSelected ? null : option)}
            style={[styles.chip, isSelected && styles.chipSelected]}>
            {index === 0 && leadingIcon ? (
              <Ionicons name={leadingIcon} size={14} color={isSelected ? Colors.white : Colors.textSecondary} />
            ) : null}
            <Text style={[styles.chipLabel, isSelected && styles.chipLabelSelected]}>{option}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 0,
  },
  row: {
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.xxs,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xxs,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xxs,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
  },
  chipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  chipLabelSelected: {
    color: Colors.white,
    fontWeight: '600',
  },
});
