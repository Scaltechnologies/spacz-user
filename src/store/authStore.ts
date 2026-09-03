import { create } from 'zustand';

import * as authService from '@/services/auth.service';
import { User } from '@/types/user';
import { getToken, removeToken, saveToken } from '@/utils/storage';

interface AuthState {
  isHydrated: boolean;
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  pendingPhoneNumber: string | null;
  hydrate: () => Promise<void>;
  setPendingPhoneNumber: (phoneNumber: string) => void;
  loginSuccess: (user: User, token: string) => Promise<void>;
  updateUser: (user: User) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isHydrated: false,
  isAuthenticated: false,
  token: null,
  user: null,
  pendingPhoneNumber: null,

  hydrate: async () => {
    const token = await getToken();
    if (!token) {
      set({ isHydrated: true, isAuthenticated: false, token: null });
      return;
    }
    try {
      const user = await authService.getCurrentUser();
      set({ isHydrated: true, isAuthenticated: true, token, user });
    } catch {
      set({ isHydrated: true, isAuthenticated: true, token });
    }
  },

  setPendingPhoneNumber: (phoneNumber) => set({ pendingPhoneNumber: phoneNumber }),

  loginSuccess: async (user, token) => {
    await saveToken(token);
    set({ user, token, isAuthenticated: true, pendingPhoneNumber: null });
  },

  updateUser: (user) => set({ user }),

  logout: async () => {
    await removeToken();
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
