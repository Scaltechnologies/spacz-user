import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthHeader } from '@/components/auth/AuthHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { useAuth } from '@/hooks/useAuth';
import { validateMobileNumber } from '@/utils/validation';

export default function MobileNumberScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { sendOtp, isSubmitting } = useAuth();

  async function handleGetOtp() {
    const validationError = validateMobileNumber(phoneNumber);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    try {
      await sendOtp(phoneNumber.trim());
      router.push('/(auth)/otp');
    } catch {
      setError('Could not send OTP. Please try again.');
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <AuthHeader heading="Hey! Welcome to Spacz" subheading="Enter your registered mobile number to login" />
        <Input
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="0000000000"
          keyboardType="number-pad"
          maxLength={10}
          error={error}
        />
      </View>
      <Button label="Get OTP" onPress={handleGetOtp} loading={isSubmitting} style={styles.button} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.lg,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    paddingTop: Spacing.xxl,
    gap: Spacing.md,
  },
  button: {
    marginBottom: Spacing.xl,
  },
});
