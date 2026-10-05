/** POST /api/auth/otp/request response. `devCode` only when OTP_EXPOSE_CODE=true. */
export interface OtpRequestResult {
  phone: string;
  expiresInSeconds: number;
  resendAfterSeconds: number;
  devCode?: string;
}

export interface OtpVerifyResult {
  isNewUser: boolean;
}

export type AccountRole = 'USER' | 'VENDOR' | 'ADMIN';

/** auth-service AccountResponse (subset used by the app). */
export interface Account {
  id: number;
  email: string | null;
  phone: string | null;
  role: AccountRole;
  status: string;
  passwordSet: boolean;
}

/** auth-service AuthResponse. */
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: Account;
}

export interface RegisterPayload {
  fullName: string;
  /** ISO date (YYYY-MM-DD) or empty. */
  dateOfBirth: string;
  /** Program IDs from GET /api/programs. */
  programIds: number[];
}
