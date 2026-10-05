import { useCallback, useEffect, useState } from 'react';

import { errorMessage } from '@/services/api';
import * as profileService from '@/services/profile.service';
import { useAuthStore } from '@/store/authStore';
import { AsyncStatus } from '@/types/common';
import { User, UserProfilePatch } from '@/types/user';

export function useProfile() {
  const [profile, setProfile] = useState<User | null>(null);
  const [status, setStatus] = useState<AsyncStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);
  const updateUser = useAuthStore((state) => state.updateUser);

  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (!cancelled) {
        setStatus('loading');
        setError(null);
      }
    });
    profileService
      .getProfile()
      .then((result) => {
        if (cancelled) return;
        setProfile(result);
        updateUser(result);
        setStatus('success');
      })
      .catch((err) => {
        if (cancelled) return;
        setError(errorMessage(err, 'Failed to load profile'));
        setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, [reloadToken, updateUser]);

  const refresh = useCallback(() => setReloadToken((token) => token + 1), []);

  const update = useCallback(
    async (patch: UserProfilePatch) => {
      if (!profile) throw new Error('Profile is not loaded');
      const result = await profileService.updateProfile(profile.profile, patch);
      setProfile(result);
      updateUser(result);
      return result;
    },
    [profile, updateUser]
  );

  return { profile, status, error, refresh, update };
}
