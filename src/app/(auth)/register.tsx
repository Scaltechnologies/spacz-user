import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { useAuth } from '@/hooks/useAuth';
import { ASPIRING_CATEGORIES, AspiringCategory } from '@/types/common';
import { validateEmail, validateFullName } from '@/utils/validation';

export default function RegisterScreen() {
  const { pendingPhoneNumber, completeRegistration, isSubmitting } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [aspiringFor, setAspiringFor] = useState<AspiringCategory[]>([]);
  const [errors, setErrors] = useState<{ fullName?: string; email?: string }>({});
  // Snapshot taken once at mount — a successful registration legitimately clears
  // pendingPhoneNumber via loginSuccess, and re-checking the live value would
  // fire this guard while navigating away to Home, redirecting back instead.
  const [hadPendingPhoneNumberOnMount] = useState(() => Boolean(pendingPhoneNumber));

  // Guard: registration only makes sense right after OTP verification identifies
  // a new user (which keeps pendingPhoneNumber set). If reached directly — a
  // stale deep link or leftover navigation state — send the user back to
  // Mobile Number to restart the flow properly instead of registering blind.
  if (!hadPendingPhoneNumberOnMount) {
    return <Redirect href="/(auth)/mobile-number" />;
  }

  function toggleAspiring(category: AspiringCategory) {
    setAspiringFor((current) => {
      if (current.includes(category)) return current.filter((item) => item !== category);
      if (current.length >= 5) return current;
      return [...current, category];
    });
  }

  async function handleRegister() {
    const fullNameError = validateFullName(fullName);
    const emailError = validateEmail(email);
    if (fullNameError || emailError) {
      setErrors({ fullName: fullNameError ?? undefined, email: emailError ?? undefined });
      return;
    }
    setErrors({});
    await completeRegistration({ fullName, email, dateOfBirth, aspiringFor });
    router.replace('/(tabs)/home');
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Register</Text>
        <Text style={styles.subtitle}>Tell us a bit about yourself to get started.</Text>

        <Input label="Full Name" value={fullName} onChangeText={setFullName} placeholder="Full Name" error={errors.fullName} />
        <Input label="Email ID" value={email} onChangeText={setEmail} placeholder="Email ID" keyboardType="email-address" autoCapitalize="none" error={errors.email} />
        <Input label="Date of Birth" value={dateOfBirth} onChangeText={setDateOfBirth} placeholder="DD-MM-YYYY" />

        <View style={styles.aspiringBlock}>
          <Text style={styles.aspiringLabel}>Aspiring for (select up to 5)</Text>
          <View style={styles.chipRow}>
            {ASPIRING_CATEGORIES.map((category) => {
              const isSelected = aspiringFor.includes(category);
              return (
                <Pressable
                  key={category}
                  onPress={() => toggleAspiring(category)}
                  style={[styles.chip, isSelected && styles.chipSelected]}>
                  <Text style={[styles.chipLabel, isSelected && styles.chipLabelSelected]}>{category}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>
      <Button label="Register" onPress={handleRegister} loading={isSubmitting} style={styles.button} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    gap: Spacing.md,
  },
  title: {
    ...Typography.h1,
    color: Colors.text,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  aspiringBlock: {
    gap: Spacing.xs,
  },
  aspiringLabel: {
    ...Typography.captionBold,
    color: Colors.textSecondary,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  chip: {
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
  button: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
});
