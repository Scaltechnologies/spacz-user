import { useCallback, useEffect, useState } from 'react';

import * as notificationService from '@/services/notification.service';
import { AsyncStatus } from '@/types/common';
import { AppNotification, NotificationCategory } from '@/types/notification';

export function useNotifications(category?: NotificationCategory) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [status, setStatus] = useState<AsyncStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (!cancelled) {
        setStatus('loading');
        setError(null);
      }
    });
    notificationService
      .getNotifications(category)
      .then((results) => {
        if (cancelled) return;
        setNotifications(results);
        setStatus('success');
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Failed to load notifications');
        setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, [category, reloadToken]);

  const refresh = useCallback(() => setReloadToken((token) => token + 1), []);

  return { notifications, status, error, refresh };
}
