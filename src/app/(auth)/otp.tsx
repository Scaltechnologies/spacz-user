import { Redirect, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthHeader } from '@/components/auth/AuthHeader';
import { OtpInput } from '@/components/auth/OtpInput';
import { Button } from '@/components/ui/Button';
import { Colors } from '@/constants/colors';
import { Config } from '@/constants/config';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { useAuth } from '@/hooks/useAuth';
import { maskPhoneNumber } from '@/utils/formatting';
import { validateOtp } from '@/utils/validation';

export default function OtpScreen() {
  const { pendingPhoneNumber, confirmOtp, sendOtp, isSubmitting } = useAuth();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number>(Config.otpResendSeconds);
  // Snapshot taken once at mount, NOT re-evaluated on every render: a successful
  // verification legitimately clears pendingPhoneNumber as part of loginSuccess,
  // and re-checking the live value here would fire this guard right when we're
  // navigating away to Home/Register, redirecting back to Mobile Number instead.
  const [hadPendingPhoneNumberOnMount] = useState(() => Boolean(pendingPhoneNumber));

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  // Guard: this screen only makes sense right after Mobile Number successfully
  // requests a code (which sets pendingPhoneNumber). If it's reached directly —
  // a stale deep link, a resumed browser tab, leftover native navigation state —
  // there's no phone number to verify against, so bounce back to Mobile Number
  // instead of rendering a broken OTP screen or showing a misleading error.
  if (!hadPendingPhoneNumberOnMount) {
    return <Redirect href="/(auth)/mobile-number" />;
  }

  async function handleLogin() {
    const validationError = validateOtp(otp);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    try {
      const result = await confirmOtp(otp);
      if (result.isNewUser) {
        router.push('/(auth)/register');
      } else {
        router.replace('/(tabs)/home');
      }
    } catch (err) {
      // Surface the actual failure reason (e.g. a genuinely wrong code vs. a
      // missing pending phone number) instead of always showing the same
      // generic text regardless of cause.
      setError(err instanceof Error ? err.message : 'Invalid OTP. Please try again.');
    }
  }

  async function handleResend() {
    if (!pendingPhoneNumber || secondsLeft > 0) return;
    await sendOtp(pendingPhoneNumber);
    setSecondsLeft(Config.otpResendSeconds);
  }

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const seconds = String(secondsLeft % 60).padStart(2, '0');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <AuthHeader
          heading="Enter OTP"
          subheading={`Sent to ${pendingPhoneNumber ? maskPhoneNumber(pendingPhoneNumber) : ''}`}
        />
        <OtpInput value={otp} onChange={setOtp} />
        {error ? <Text style={styles.error}>{error}</Text> : null}

        {secondsLeft > 0 ? (
          <Text style={styles.hint}>
            You will receive OTP in {minutes}:{seconds} sec
          </Text>
        ) : (
          <Text style={styles.resend} onPress={handleResend}>
            Resend OTP
          </Text>
        )}

        <Text style={styles.devHint}>Dev OTP: {Config.devOtp}</Text>
      </View>
      <Button label="Login" onPress={handleLogin} loading={isSubmitting} style={styles.button} />
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
  error: {
    ...Typography.caption,
    color: Colors.error,
  },
  hint: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  resend: {
    ...Typography.captionBold,
    color: Colors.primary,
  },
  devHint: {
    ...Typography.small,
    color: Colors.textMuted,
  },
  button: {
    marginBottom: Spacing.xl,
  },
});
