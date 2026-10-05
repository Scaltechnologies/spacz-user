import { useCallback, useEffect, useState } from 'react';

import { errorMessage } from '@/services/api';
import * as offerService from '@/services/offer.service';
import { AsyncStatus } from '@/types/common';
import { Offer } from '@/types/offer';

/** Live admin-managed offers (GET /api/offers). */
export function useOffers() {
  const [offers, setOffers] = useState<Offer[]>([]);
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
    offerService
      .getActiveOffers()
      .then((results) => {
        if (cancelled) return;
        setOffers(results);
        setStatus('success');
      })
      .catch((err) => {
        if (cancelled) return;
        setError(errorMessage(err, 'Unable to load offers.'));
        setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, [reloadToken]);

  const refresh = useCallback(() => setReloadToken((token) => token + 1), []);

  return { offers, status, error, refresh };
}
