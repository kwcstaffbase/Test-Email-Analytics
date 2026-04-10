import React from 'react';
import styles from './StatusBadge.module.css';

interface StatusBadgeProps {
  value: number | undefined;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ value }) => {
  if (value === undefined) return null;
  
  let statusClass = '';
  if (value < 20) {
    statusClass = styles.low;
  } else if (value >= 20 && value <= 40) {
    statusClass = styles.medium;
  } else {
    statusClass = styles.high;
  }
  
  return (
    <span className={`${styles.badge} ${statusClass}`}>
      {value.toFixed(1)}%
    </span>
  );
};

export default StatusBadge;