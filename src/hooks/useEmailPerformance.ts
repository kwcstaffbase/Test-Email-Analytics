import { useState, useEffect, useCallback } from 'react';
import { usePluginSdk } from './usePluginSdk';
import { getEmailPerformance } from '../services/emailApi';
import { ApiError, EmailRecord, EmailPerformanceParams } from '../types/email';

export type AuthErrorKind = 'unauthenticated' | 'forbidden';
export type ApiErrorKind = 'api_error';

export interface AuthError {
  kind: AuthErrorKind;
  message: string;
}

export interface GeneralApiError {
  kind: ApiErrorKind;
  message: string;
  status?: number;
}

export type FetchError = AuthError | GeneralApiError;

export interface EmailPerformanceState {
  data: EmailRecord[] | null;
  isLoading: boolean;
  error: FetchError | null;
  refetch: () => void;
}

export function useEmailPerformance(params: EmailPerformanceParams): EmailPerformanceState {
  const { token, isLoading: sdkLoading } = usePluginSdk();
  const [data, setData] = useState<EmailRecord[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<FetchError | null>(null);
  const [fetchTick, setFetchTick] = useState(0);

  const refetch = useCallback(() => {
    setFetchTick((t) => t + 1);
  }, []);

  // Use the primitive value so object identity changes don't cause extra effects
  const timePeriod = params.timePeriod;

  useEffect(() => {
    if (sdkLoading) return;

    if (!token) {
      setError({ kind: 'unauthenticated', message: 'No authentication token available. Ensure the plugin is loaded inside the Staffbase platform.' });
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    getEmailPerformance(token, { timePeriod })
      .then((records) => {
        if (!cancelled) {
          setData(records);
          setIsLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setIsLoading(false);

        if (err instanceof ApiError) {
          if (err.status === 401) {
            setError({ kind: 'unauthenticated', message: err.message });
          } else if (err.status === 403) {
            setError({ kind: 'forbidden', message: err.message });
          } else {
            setError({ kind: 'api_error', message: err.message, status: err.status });
          }
        } else {
          setError({ kind: 'api_error', message: String(err) });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [token, sdkLoading, timePeriod, fetchTick]);

  return { data, isLoading: isLoading || sdkLoading, error, refetch };
}
