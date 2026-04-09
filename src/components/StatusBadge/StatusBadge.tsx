import React from 'react';
import styles from './StatusBadge.module.css';

interface StatusBadgeProps {
  value: number | undefined;
}

function getLevel(value: number): 'low' | 'medium' | 'high' {
  if (value < 20) return 'low';
  if (value <= 40) return 'medium';
  return 'high';
}

const LEVEL_LABELS: Record<'low' | 'medium' | 'high', string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

export function StatusBadge({ value }: StatusBadgeProps): React.ReactElement | null {
  if (value === undefined || value === null) return null;

  const level = getLevel(value);

  return (
    <span className={`${styles.badge} ${styles[level]}`} aria-label={`Open rate: ${LEVEL_LABELS[level]}`}>
      {LEVEL_LABELS[level]}
    </span>
  );
}
