import React, { useState } from 'react';
import { EmailRecord, SortField, SortState } from '../../types/email';
import { StatusBadge } from '../StatusBadge/StatusBadge';
import { formatDate, formatPercent, formatCount } from '../../utils/formatters';
import styles from './EmailTable.module.css';

const EM_DASH = '—';

interface EmailTableProps {
  data: EmailRecord[];
}

function sortRecords(records: EmailRecord[], sort: SortState): EmailRecord[] {
  if (!sort.field) return records;
  return [...records].sort((a, b) => {
    const aVal = a[sort.field as SortField];
    const bVal = b[sort.field as SortField];
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sort.direction === 'asc' ? aVal - bVal : bVal - aVal;
    }
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sort.direction === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }
    return 0;
  });
}

interface SortableHeaderProps {
  field: SortField;
  sort: SortState;
  onSort: (field: SortField) => void;
  children: React.ReactNode;
}

function SortableHeader({ field, sort, onSort, children }: SortableHeaderProps): React.ReactElement {
  const isActive = sort.field === field;
  const ariaSortValue: 'ascending' | 'descending' | 'none' = isActive
    ? sort.direction === 'asc'
      ? 'ascending'
      : 'descending'
    : 'none';

  return (
    <th
      scope="col"
      aria-sort={ariaSortValue}
      className={`${styles.th} ${styles.sortable} ${isActive ? styles.activeSort : ''}`}
      onClick={() => onSort(field)}
    >
      <span className={styles.headerContent}>
        {children}
        <span className={styles.sortIcon} aria-hidden="true">
          {isActive ? (sort.direction === 'asc' ? ' ▲' : ' ▼') : ' ↕'}
        </span>
      </span>
    </th>
  );
}

export function EmailTable({ data }: EmailTableProps): React.ReactElement {
  const [sort, setSort] = useState<SortState>({ field: null, direction: 'asc' });

  function handleSort(field: SortField) {
    setSort((prev) => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  }

  const sorted = sortRecords(data, sort);

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col" className={styles.th}>Subject Line</th>
            <th scope="col" className={styles.th}>Sender</th>
            <SortableHeader field="send_datetime_utc" sort={sort} onSort={handleSort}>
              Sent At
            </SortableHeader>
            <th scope="col" className={styles.th}>Unique Opens</th>
            <th scope="col" className={styles.th}>Unique Clicks</th>
            <th scope="col" className={styles.th}>Total Clicks</th>
            <SortableHeader field="open_rate" sort={sort} onSort={handleSort}>
              Open Rate
            </SortableHeader>
            <SortableHeader field="click_through_rate" sort={sort} onSort={handleSort}>
              CTR
            </SortableHeader>
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => (
            <tr key={row.message_id} className={styles.row}>
              <td className={styles.td}>{row.subject_line ?? EM_DASH}</td>
              <td className={styles.td}>{row.sender_name ?? EM_DASH}</td>
              <td className={styles.td}>{formatDate(row.send_datetime_utc)}</td>
              <td className={styles.td}>{formatCount(row.unique_opens)}</td>
              <td className={styles.td}>{formatCount(row.unique_clicks)}</td>
              <td className={styles.td}>{formatCount(row.total_clicks)}</td>
              <td className={styles.td}>
                <span className={styles.rateCell}>
                  {formatPercent(row.open_rate)}
                  <StatusBadge value={row.open_rate} />
                </span>
              </td>
              <td className={styles.td}>{formatPercent(row.click_through_rate)}</td>
            </tr>
          ))}
          {sorted.length === 0 && (
            <tr>
              <td colSpan={8} className={styles.emptyCell}>
                No email data available for the selected period.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
