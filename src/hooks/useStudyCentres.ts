import { useCallback, useEffect, useState } from 'react';

import { errorMessage } from '@/services/api';
import * as studyCentreService from '@/services/studyCentre.service';
import { AsyncStatus } from '@/types/common';
import { Program, StudyCentre, StudyCentreFilters, StudyCentreLocation } from '@/types/studyCentre';

const SEARCH_DEBOUNCE_MS = 300;

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
    // Debounced so typing in the search bar doesn't fire a request per keystroke.
    const timer = setTimeout(() => {
      studyCentreService
        .getStudyCentres(filters)
        .then((results) => {
          if (cancelled) return;
          setStudyCentres(results);
          setStatus('success');
        })
        .catch((err) => {
          if (cancelled) return;
          setError(errorMessage(err, 'Failed to load study centres'));
          setStatus('error');
        });
    }, SEARCH_DEBOUNCE_MS);
    return () => {
      cancelled = true;
      clearTimeout(timer);
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

/** Cities that currently have live study halls (GET /api/studyhalls/locations). */
export function useStudyCentreLocations() {
  const [locations, setLocations] = useState<StudyCentreLocation[]>([]);

  useEffect(() => {
    let cancelled = false;
    studyCentreService
      .getLocations()
      .then((results) => !cancelled && setLocations(results))
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  return locations;
}

/** Exams/courses from GET /api/programs, used for the "Aspiring for" choices. */
export function usePrograms() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [status, setStatus] = useState<AsyncStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (!cancelled) setStatus('loading');
    });
    studyCentreService
      .getPrograms()
      .then((results) => {
        if (cancelled) return;
        setPrograms(results);
        setStatus('success');
      })
      .catch((err) => {
        if (cancelled) return;
        setError(errorMessage(err, 'Failed to load exams'));
        setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, [reloadToken]);

  const refresh = useCallback(() => setReloadToken((token) => token + 1), []);

  return { programs, status, error, refresh };
}
