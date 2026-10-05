import { create } from 'zustand';

import { ApiError, clearSession, loadSession, Session, setSession, setSessionExpiredHandler } from '@/services/api';
import * as profileService from '@/services/profile.service';
import { OtpRequestResult } from '@/types/auth';
import { User } from '@/types/user';

interface AuthState {
  isHydrated: boolean;
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  pendingPhoneNumber: string | null;
  /** Last OTP request result for the pending number (resend timer, dev code). */
  otpRequest: OtpRequestResult | null;
  /** Verified code kept for the registration call (backend: "repeat verify with the same code"). */
  pendingOtpCode: string | null;
  hydrate: () => Promise<void>;
  setPendingPhoneNumber: (phoneNumber: string, otpRequest: OtpRequestResult) => void;
  setPendingOtpCode: (code: string | null) => void;
  loginSuccess: (user: User, session: Session) => Promise<void>;
  updateUser: (user: User) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isHydrated: false,
  isAuthenticated: false,
  token: null,
  user: null,
  pendingPhoneNumber: null,
  otpRequest: null,
  pendingOtpCode: null,

  hydrate: async () => {
    const session = await loadSession();
    if (!session) {
      set({ isHydrated: true, isAuthenticated: false, token: null });
      return;
    }
    try {
      const user = await profileService.getProfile();
      set({ isHydrated: true, isAuthenticated: true, token: session.accessToken, user });
    } catch (err) {
      if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
        await clearSession();
        set({ isHydrated: true, isAuthenticated: false, token: null, user: null });
        return;
      }
      // Server unreachable: keep the session; screens surface their own errors.
      set({ isHydrated: true, isAuthenticated: true, token: session.accessToken });
    }
  },

  setPendingPhoneNumber: (phoneNumber, otpRequest) =>
    set({ pendingPhoneNumber: phoneNumber, otpRequest, pendingOtpCode: null }),

  setPendingOtpCode: (code) => set({ pendingOtpCode: code }),

  loginSuccess: async (user, session) => {
    await setSession(session);
    set({
      user,
      token: session.accessToken,
      isAuthenticated: true,
      pendingPhoneNumber: null,
      otpRequest: null,
      pendingOtpCode: null,
    });
  },

  updateUser: (user) => set({ user }),

  logout: async () => {
    await clearSession();
    set({ user: null, token: null, isAuthenticated: false });
  },
}));

// Refresh token rejected by auth-service → drop local auth state.
setSessionExpiredHandler(() => {
  useAuthStore.setState({ user: null, token: null, isAuthenticated: false });
});
