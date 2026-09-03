import { useCallback, useEffect, useState } from 'react';

import * as studyCentreService from '@/services/studyCentre.service';
import { AsyncStatus } from '@/types/common';
import { StudyCentre, StudyCentreFilters } from '@/types/studyCentre';

export function useStudyCentres(initialFilters?: StudyCentreFilters) {
  const [studyCentres, setStudyCentres] = useState<StudyCentre[]>([]);
  const [status, setStatus] = useState<AsyncStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<StudyCentreFilters>(initialFilters ?? {});
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (!cancelled) {
        setStatus('loading');
        setError(null);
      }
    });
    studyCentreService
      .getStudyCentres(filters)
      .then((results) => {
        if (cancelled) return;
        setStudyCentres(results);
        setStatus('success');
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Failed to load study centres');
        setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, [filters, reloadToken]);

  const refresh = useCallback(() => setReloadToken((token) => token + 1), []);

  return {
    studyCentres,
    status,
    error,
    filters,
    setFilters,
    refresh,
  };
}
