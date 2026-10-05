import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Input } from '@/components/ui/Input';
import { Loader } from '@/components/ui/Loader';
import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { useAuth } from '@/hooks/useAuth';
import { usePrograms } from '@/hooks/useStudyCentres';
import { errorMessage } from '@/services/api';
import { parseDisplayDate, validateFullName } from '@/utils/validation';

export default function RegisterScreen() {
  const { pendingPhoneNumber, completeRegistration, isSubmitting } = useAuth();
  const { programs, status: programsStatus, error: programsError, refresh: reloadPrograms } = usePrograms();
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [aspiringFor, setAspiringFor] = useState<number[]>([]);
  const [errors, setErrors] = useState<{ fullName?: string; dateOfBirth?: string; submit?: string }>({});
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

  function toggleAspiring(programId: number) {
    setAspiringFor((current) => {
      if (current.includes(programId)) return current.filter((item) => item !== programId);
      if (current.length >= 5) return current;
      return [...current, programId];
    });
  }

  async function handleRegister() {
    const fullNameError = validateFullName(fullName);
    const dob = dateOfBirth.trim() ? parseDisplayDate(dateOfBirth) : '';
    const dateOfBirthError = dob === null ? 'Use format DD-MM-YYYY' : undefined;
    if (fullNameError || dateOfBirthError) {
      setErrors({ fullName: fullNameError ?? undefined, dateOfBirth: dateOfBirthError });
      return;
    }
    setErrors({});
    try {
      const { warning } = await completeRegistration({
        fullName: fullName.trim(),
        dateOfBirth: dob ?? '',
        programIds: aspiringFor,
      });
      if (warning) Alert.alert('Registered', `Your account was created, but some details were not saved:\n${warning}`);
      router.replace('/(tabs)/home');
    } catch (err) {
      setErrors({ submit: errorMessage(err, 'Could not complete registration') });
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Register</Text>
        <Text style={styles.subtitle}>Tell us a bit about yourself to get started.</Text>

        <Input label="Full Name" value={fullName} onChangeText={setFullName} placeholder="Full Name" error={errors.fullName} />
        <Input label="Date of Birth" value={dateOfBirth} onChangeText={setDateOfBirth} placeholder="DD-MM-YYYY" error={errors.dateOfBirth} />

        <View style={styles.aspiringBlock}>
          <Text style={styles.aspiringLabel}>Aspiring for (select up to 5)</Text>
          <View style={styles.chipRow}>
            {programs.map((program) => {
              const isSelected = aspiringFor.includes(program.id);
              return (
                <Pressable
                  key={program.id}
                  onPress={() => toggleAspiring(program.id)}
                  style={[styles.chip, isSelected && styles.chipSelected]}>
                  <Text style={[styles.chipLabel, isSelected && styles.chipLabelSelected]}>{program.name}</Text>
                </Pressable>
              );
            })}
          </View>
          {programsStatus === 'loading' && <Loader />}
          {programsStatus === 'error' && (
            <ErrorMessage message={programsError ?? 'Failed to load exams'} onRetry={reloadPrograms} />
          )}
        </View>
        {errors.submit ? <Text style={styles.submitError}>{errors.submit}</Text> : null}
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
  submitError: {
    ...Typography.caption,
    color: Colors.error,
  },
  button: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
});
