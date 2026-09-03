import { mockDelay } from '@/services/api';
import { mockUser } from '@/services/mock/user.mock';
import { OtpRequestResult, OtpVerifyResult, RegisterPayload } from '@/types/auth';
import { User } from '@/types/user';
import { Config } from '@/constants/config';

/**
 * Mock auth service. Replace the bodies of these functions with real API calls
 * once the backend is available — hooks/screens depend only on this module's
 * exported signatures, not on how they're implemented.
 */
export async function requestOtp(phoneNumber: string): Promise<OtpRequestResult> {
  return mockDelay({ phoneNumber, expiresInSeconds: Config.otpResendSeconds });
}

export async function verifyOtp(phoneNumber: string, otp: string): Promise<OtpVerifyResult> {
  await mockDelay(undefined);
  const normalizedOtp = otp.trim();
  if (normalizedOtp !== Config.devOtp) {
    throw new Error('Invalid OTP. Please try again.');
  }
  const isNewUser = phoneNumber !== mockUser.phoneNumber;
  return { isNewUser, token: `mock-token-${phoneNumber}` };
}

export async function register(payload: RegisterPayload): Promise<User> {
  return mockDelay({
    ...mockUser,
    fullName: payload.fullName,
    email: payload.email,
    dateOfBirth: payload.dateOfBirth,
    aspiringFor: payload.aspiringFor as User['aspiringFor'],
    isRegistered: true,
  });
}

export async function getCurrentUser(): Promise<User> {
  return mockDelay(mockUser);
}

export async function logout(): Promise<void> {
  return mockDelay(undefined);
}
