import React from 'react';
import styles from './ErrorState.module.css';

interface ErrorStateProps {
  error: any;
  onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
  const isAuthError = error?.status === 401 || error?.status === 403;
  
  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorMessage}>
        {isAuthError ? (
          <p>Authentication required. Please ensure you're logged in with proper permissions.</p>
        ) : (
          <p>Failed to load email performance data: {error?.message || 'Unknown error'}</p>
        )}
      </div>
      <button 
        onClick={onRetry}
        className={styles.retryButton}
      >
        Retry
      </button>
    </div>
  );
};

export default ErrorState;