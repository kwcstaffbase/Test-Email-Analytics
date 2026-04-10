import React from 'react';
import styles from './LoadingState.module.css';

const LoadingState: React.FC = () => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.spinner}></div>
      <p>Loading email performance data...</p>
    </div>
  );
};

export default LoadingState;