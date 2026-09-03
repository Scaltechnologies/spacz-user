import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { DurationOption } from '@/types/booking';
import { formatDate, todayIso } from '@/utils/date';

interface DateDurationPickerProps {
  validFrom: string;
  duration: DurationOption;
  onChangeValidFrom: (isoDate: string) => void;
  onChangeDuration: (duration: DurationOption) => void;
}

export function DateDurationPicker({
  validFrom,
  duration,
  onChangeValidFrom,
  onChangeDuration,
}: DateDurationPickerProps) {
  const [text, setText] = useState(formatDate(validFrom));
  const [error, setError] = useState<string | null>(null);

  function handleSubmit() {
    const match = text.match(/^(\d{2})-(\d{2})-(\d{4})$/);
    if (!match) {
      setError('Use format DD-MM-YYYY');
      return;
    }
    const [, day, month, year] = match;
    const iso = `${year}-${month}-${day}`;
    if (Number.isNaN(new Date(iso).getTime())) {
      setError('Enter a valid date');
      return;
    }
    setError(null);
    onChangeValidFrom(iso);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select from Date</Text>
      <View style={styles.dateRow}>
        <TextInput
          value={text}
          onChangeText={setText}
          onBlur={handleSubmit}
          onSubmitEditing={handleSubmit}
          placeholder="DD-MM-YYYY"
          placeholderTextColor={Colors.textMuted}
          style={styles.dateInput}
        />
        <Pressable
          onPress={() => {
            setText(formatDate(todayIso()));
            onChangeValidFrom(todayIso());
            setError(null);
          }}
          style={styles.todayButton}>
          <Text style={styles.todayButtonLabel}>Today</Text>
        </Pressable>
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Text style={[styles.label, { marginTop: Spacing.md }]}>Select Duration</Text>
      <View style={styles.durationRow}>
        {([15, 30] as DurationOption[]).map((option) => {
          const isSelected = duration === option;
          return (
            <Pressable
              key={option}
              onPress={() => onChangeDuration(option)}
              style={[styles.durationChip, isSelected && styles.durationChipSelected]}>
              <Text style={[styles.durationLabel, isSelected && styles.durationLabelSelected]}>
                {option} days
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.xxs,
  },
  label: {
    ...Typography.captionBold,
    color: Colors.textSecondary,
  },
  dateRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  dateInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    fontSize: Typography.body.fontSize,
    color: Colors.text,
  },
  todayButton: {
    paddingHorizontal: Spacing.sm,
    justifyContent: 'center',
    borderRadius: Radius.sm,
    backgroundColor: Colors.primaryLight,
  },
  todayButtonLabel: {
    ...Typography.captionBold,
    color: Colors.primary,
  },
  error: {
    ...Typography.caption,
    color: Colors.error,
  },
  durationRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  durationChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  durationChipSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  durationLabel: {
    ...Typography.bodyBold,
    color: Colors.textSecondary,
  },
  durationLabelSelected: {
    color: Colors.primary,
  },
});
