import React from 'react';
import { EmailPerformanceParams } from '../../types/email';
import styles from './Filters.module.css';

type TimePeriod = NonNullable<EmailPerformanceParams['timePeriod']>;

interface FiltersProps {
  params: EmailPerformanceParams;
  onChange: (params: EmailPerformanceParams) => void;
}

const TIME_PERIOD_OPTIONS: { value: TimePeriod; label: string }[] = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'quarter', label: 'Quarter' },
];

export function Filters({ params, onChange }: FiltersProps): React.ReactElement {
  function handleTimePeriodChange(e: React.ChangeEvent<HTMLSelectElement>) {
    onChange({ ...params, timePeriod: e.target.value as TimePeriod });
  }

  return (
    <div className={styles.container}>
      <div className={styles.filterGroup}>
        <label htmlFor="time-period-select" className={styles.label}>
          Time Period
        </label>
        <select
          id="time-period-select"
          className={styles.select}
          value={params.timePeriod ?? 'week'}
          onChange={handleTimePeriodChange}
        >
          {TIME_PERIOD_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
