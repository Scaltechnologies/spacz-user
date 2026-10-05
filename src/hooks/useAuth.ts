import { useCallback, useState } from 'react';

import { clearSession, errorMessage, getSession, setSession } from '@/services/api';
import * as authService from '@/services/auth.service';
import * as profileService from '@/services/profile.service';
import { useAuthStore } from '@/store/authStore';
import { AuthResponse, OtpVerifyResult, RegisterPayload } from '@/types/auth';
import { User } from '@/types/user';

/** Stores the tokens, loads the student profile from user-service, then marks the session as logged in. */
async function establishSession(auth: AuthResponse): Promise<User> {
  if (auth.user.role !== 'USER') {
    throw new Error('This number is registered as a partner/admin account. Please use a student account.');
  }
  const session = { accessToken: auth.accessToken, refreshToken: auth.refreshToken };
  await setSession(session);
  try {
    return await profileService.getProfile();
  } catch (err) {
    await clearSession();
    throw err;
  }
}

export function useAuth() {
  const {
    user,
    token,
    isAuthenticated,
    isHydrated,
    pendingPhoneNumber,
    otpRequest,
    setPendingPhoneNumber,
    setPendingOtpCode,
    loginSuccess,
    updateUser,
    logout,
  } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendOtp = useCallback(
    async (phoneNumber: string) => {
      setIsSubmitting(true);
      setError(null);
      try {
        const result = await authService.requestOtp(phoneNumber);
        setPendingPhoneNumber(phoneNumber, result);
        return result;
      } catch (err) {
        setError(errorMessage(err, 'Something went wrong'));
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [setPendingPhoneNumber]
  );

  const confirmOtp = useCallback(
    async (otp: string): Promise<OtpVerifyResult> => {
      // Read the latest value from the store instead of the closed-over hook
      // variable — a caller that invokes sendOtp() then immediately confirmOtp()
      // in the same handler would otherwise see the pre-update, stale value.
      const currentPhoneNumber = useAuthStore.getState().pendingPhoneNumber;
      if (!currentPhoneNumber) throw new Error('No phone number to verify');
      setIsSubmitting(true);
      setError(null);
      try {
        const code = otp.trim();
        const auth = await authService.verifyOtp(currentPhoneNumber, code);
        if (!auth) {
          // 422 REGISTRATION_REQUIRED: new number, the same code completes registration.
          setPendingOtpCode(code);
          return { isNewUser: true };
        }
        const currentUser = await establishSession(auth);
        await loginSuccess(currentUser, { accessToken: auth.accessToken, refreshToken: auth.refreshToken });
        return { isNewUser: false };
      } catch (err) {
        setError(errorMessage(err, 'Invalid OTP'));
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [loginSuccess, setPendingOtpCode]
  );

  const completeRegistration = useCallback(
    async (payload: RegisterPayload) => {
      const { pendingPhoneNumber: currentPhoneNumber, pendingOtpCode } = useAuthStore.getState();
      if (!currentPhoneNumber || !pendingOtpCode) throw new Error('Please verify your mobile number again');
      setIsSubmitting(true);
      setError(null);
      try {
        const { firstName, lastName } = profileService.splitFullName(payload.fullName);
        const auth = await authService.registerWithOtp(currentPhoneNumber, pendingOtpCode, firstName, lastName);
        let registeredUser = await establishSession(auth);
        // The account now exists; profile extras must not block the login.
        let warning: string | null = null;
        try {
          if (payload.dateOfBirth) {
            registeredUser = await profileService.setDateOfBirth(registeredUser.profile, payload.dateOfBirth);
          }
          for (const programId of payload.programIds) {
            await profileService.addProgram(programId);
          }
        } catch (err) {
          warning = errorMessage(err, 'Some profile details could not be saved');
        }
        await loginSuccess(registeredUser, { accessToken: auth.accessToken, refreshToken: auth.refreshToken });
        return { user: registeredUser, warning };
      } catch (err) {
        setError(errorMessage(err, 'Could not complete registration'));
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [loginSuccess]
  );

  const signOut = useCallback(async () => {
    const refreshToken = getSession()?.refreshToken;
    if (refreshToken) {
      // Revoke server-side; local sign-out proceeds even if the server is unreachable.
      await authService.logout(refreshToken).catch(() => undefined);
    }
    await logout();
  }, [logout]);

  return {
    user,
    token,
    isAuthenticated,
    isHydrated,
    pendingPhoneNumber,
    otpRequest,
    isSubmitting,
    error,
    sendOtp,
    confirmOtp,
    completeRegistration,
    updateUser,
    signOut,
  };
}
