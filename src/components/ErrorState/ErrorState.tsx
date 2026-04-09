import React from 'react';
import { FetchError } from '../../hooks/useEmailPerformance';
import styles from './ErrorState.module.css';

interface ErrorStateProps {
  error: FetchError;
  onRetry: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps): React.ReactElement {
  const isAuthError = error.kind === 'unauthenticated' || error.kind === 'forbidden';

  return (
    <div
      className={isAuthError ? styles.authError : styles.generalError}
      role="alert"
      aria-live="assertive"
    >
      <div className={styles.iconRow}>
        <span className={styles.icon} aria-hidden="true">
          {isAuthError ? '🔒' : '⚠'}
        </span>
        <strong className={styles.title}>
          {isAuthError ? 'Access Denied' : 'Something Went Wrong'}
        </strong>
      </div>
      <p className={styles.message}>{error.message}</p>
      {!isAuthError && (
        <button type="button" className={styles.retryButton} onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
}
