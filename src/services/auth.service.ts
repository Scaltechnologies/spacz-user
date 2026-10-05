import { ApiError, request } from '@/services/api';
import { AuthResponse, OtpRequestResult } from '@/types/auth';

/** auth-service phone OTP flow (via gateway). See spacz-platform docs/FRONTEND_INTEGRATION.md §2. */
export async function requestOtp(phone: string): Promise<OtpRequestResult> {
  return request<OtpRequestResult>('/api/auth/otp/request', { method: 'POST', body: { phone }, auth: false });
}

/**
 * Verifies the code. Resolves with tokens for an existing account, or `null` when the
 * backend answers 422 REGISTRATION_REQUIRED (new number — the code stays valid).
 */
export async function verifyOtp(phone: string, code: string): Promise<AuthResponse | null> {
  try {
    return await request<AuthResponse>('/api/auth/otp/verify', { method: 'POST', body: { phone, code }, auth: false });
  } catch (err) {
    if (err instanceof ApiError && err.code === 'REGISTRATION_REQUIRED') return null;
    throw err;
  }
}

/** Registers a new student: the same verify call repeated with the same code plus role and name. */
export async function registerWithOtp(
  phone: string,
  code: string,
  firstName: string,
  lastName: string | null
): Promise<AuthResponse> {
  return request<AuthResponse>('/api/auth/otp/verify', {
    method: 'POST',
    body: { phone, code, role: 'USER', firstName, lastName: lastName || undefined },
    auth: false,
  });
}

export async function logout(refreshToken: string): Promise<void> {
  await request<void>('/api/auth/logout', { method: 'POST', body: { refreshToken }, auth: false });
}
