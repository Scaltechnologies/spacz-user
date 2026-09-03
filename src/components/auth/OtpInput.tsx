import { useRef } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
}

export function OtpInput({ value, onChange, length = 6 }: OtpInputProps) {
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const digits = Array.from({ length }, (_, index) => value[index] ?? '');

  function handleChangeDigit(text: string, index: number) {
    const sanitized = text.replace(/\D/g, '');
    const nextDigits = [...digits];

    if (sanitized.length <= 1) {
      // Normal single-key entry: replace this box's digit.
      nextDigits[index] = sanitized;
      onChange(nextDigits.join(''));
      if (sanitized && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
      return;
    }

    // Multi-character input (paste or OS autofill of the full code): distribute
    // the digits across this box and the ones after it instead of discarding them.
    let cursor = index;
    for (const digit of sanitized) {
      if (cursor >= length) break;
      nextDigits[cursor] = digit;
      cursor += 1;
    }
    onChange(nextDigits.join(''));
    inputRefs.current[Math.min(cursor, length - 1)]?.focus();
  }

  function handleKeyPress(key: string, index: number) {
    if (key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  return (
    <View style={styles.row}>
      {digits.map((digit, index) => (
        <TextInput
          key={index}
          ref={(ref) => {
            inputRefs.current[index] = ref;
          }}
          value={digit}
          onChangeText={(text) => handleChangeDigit(text, index)}
          onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
          keyboardType="number-pad"
          maxLength={length}
          style={[styles.box, digit ? styles.boxFilled : null]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  box: {
    width: 44,
    height: 52,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    textAlign: 'center',
    fontSize: Typography.h3.fontSize,
    color: Colors.text,
    backgroundColor: Colors.background,
  },
  boxFilled: {
    borderColor: Colors.primary,
  },
});
