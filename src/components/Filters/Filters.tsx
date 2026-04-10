import React, { useState } from 'react';
import styles from './Filters.module.css';

interface FiltersProps {
  onTimePeriodChange: (timePeriod: 'day' | 'week' | 'month' | 'quarter') => void;
}

const Filters: React.FC<FiltersProps> = ({ onTimePeriodChange }) => {
  const [selectedTimePeriod, setSelectedTimePeriod] = useState<'day' | 'week' | 'month' | 'quarter'>('week');
  
  const handleTimePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as 'day' | 'week' | 'month' | 'quarter';
    setSelectedTimePeriod(value);
    onTimePeriodChange(value);
  };
  
  return (
    <div className={styles.filters}>
      <label htmlFor="time-period" className={styles.label}>
        Time Period:
      </label>
      <select
        id="time-period"
        value={selectedTimePeriod}
        onChange={handleTimePeriodChange}
        className={styles.select}
      >
        <option value="day">Day</option>
        <option value="week">Week</option>
        <option value="month">Month</option>
        <option value="quarter">Quarter</option>
      </select>
    </div>
  );
};

export default Filters;