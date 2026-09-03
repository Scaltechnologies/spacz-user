import { useCallback, useEffect, useState } from 'react';

import * as profileService from '@/services/profile.service';
import { useAuthStore } from '@/store/authStore';
import { AsyncStatus } from '@/types/common';
import { User } from '@/types/user';

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
        setStatus('success');
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Failed to load profile');
        setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, [reloadToken]);

  const refresh = useCallback(() => setReloadToken((token) => token + 1), []);

  const update = useCallback(
    async (patch: Partial<User>) => {
      const result = await profileService.updateProfile(patch);
      setProfile(result);
      updateUser(result);
      return result;
    },
    [updateUser]
  );

  return { profile, status, error, refresh, update };
}
