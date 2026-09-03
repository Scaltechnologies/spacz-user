import { useCallback, useState } from 'react';

import * as authService from '@/services/auth.service';
import { useAuthStore } from '@/store/authStore';
import { RegisterPayload } from '@/types/auth';

export function useAuth() {
  const { user, token, isAuthenticated, isHydrated, pendingPhoneNumber, setPendingPhoneNumber, loginSuccess, updateUser, logout } =
    useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendOtp = useCallback(
    async (phoneNumber: string) => {
      setIsSubmitting(true);
      setError(null);
      try {
        const result = await authService.requestOtp(phoneNumber);
        setPendingPhoneNumber(phoneNumber);
        return result;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [setPendingPhoneNumber]
  );

  const confirmOtp = useCallback(
    async (otp: string) => {
      // Read the latest value from the store instead of the closed-over hook
      // variable — a caller that invokes sendOtp() then immediately confirmOtp()
      // in the same handler would otherwise see the pre-update, stale value.
      const currentPhoneNumber = useAuthStore.getState().pendingPhoneNumber;
      if (!currentPhoneNumber) throw new Error('No phone number to verify');
      setIsSubmitting(true);
      setError(null);
      try {
        const result = await authService.verifyOtp(currentPhoneNumber, otp);
        if (!result.isNewUser) {
          const currentUser = await authService.getCurrentUser();
          await loginSuccess(currentUser, result.token);
        }
        return result;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Invalid OTP');
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [loginSuccess]
  );

  const completeRegistration = useCallback(
    async (payload: RegisterPayload) => {
      const currentPhoneNumber = useAuthStore.getState().pendingPhoneNumber;
      if (!currentPhoneNumber) throw new Error('No phone number to register');
      setIsSubmitting(true);
      setError(null);
      try {
        const registeredUser = await authService.register(payload);
        await loginSuccess(registeredUser, `mock-token-${currentPhoneNumber}`);
        return registeredUser;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not complete registration');
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [loginSuccess]
  );

  const signOut = useCallback(async () => {
    await authService.logout();
    await logout();
  }, [logout]);

  return {
    user,
    token,
    isAuthenticated,
    isHydrated,
    pendingPhoneNumber,
    isSubmitting,
    error,
    sendOtp,
    confirmOtp,
    completeRegistration,
    updateUser,
    signOut,
  };
}
