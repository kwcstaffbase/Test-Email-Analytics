import React, { useState } from 'react';
import styles from './EmailTable.module.css';
import { EmailRecord } from '../../types/email';
import StatusBadge from '../StatusBadge/StatusBadge';
import { formatDate, formatPercent, formatCount } from '../../utils/formatters';

interface EmailTableProps {
  emails: EmailRecord[];
}

const EmailTable: React.FC<EmailTableProps> = ({ emails }) => {
  const [sortConfig, setSortConfig] = useState<{ key: keyof EmailRecord; direction: 'asc' | 'desc' } | null>(null);
  
  const handleSort = (key: keyof EmailRecord) => {
    let direction: 'asc' | 'desc' = 'asc';
    
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    setSortConfig({ key, direction });
  };
  
  const sortedEmails = React.useMemo(() => {
    if (!sortConfig) return emails;
    
    return [...emails].sort((a, b) => {
      if (a[sortConfig.key] === undefined || b[sortConfig.key] === undefined) {
        return 0;
      }
      
      // Handle numeric fields
      if (typeof a[sortConfig.key] === 'number') {
        const aValue = a[sortConfig.key] as number;
        const bValue = b[sortConfig.key] as number;
        
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      }
      
      // Handle date fields
      if (sortConfig.key === 'send_datetime_utc') {
        const aValue = new Date(a[sortConfig.key] as string);
        const bValue = new Date(b[sortConfig.key] as string);
        
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      }
      
      // Handle other string fields
      const aValue = String(a[sortConfig.key]);
      const bValue = String(b[sortConfig.key]);
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [emails, sortConfig]);
  
  const getSortIndicator = (key: keyof EmailRecord) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };
  
  const renderCell = (value: any) => {
    if (value === undefined || value === null) return '—';
    return String(value);
  };
  
  // If no emails, show empty state
  if (emails.length === 0) {
    return (
      <div className={styles.emptyState}>
        No email performance data available.
      </div>
    );
  }
  
  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col" onClick={() => handleSort('subject_line')} className={styles.sortableHeader}>
              Subject Line {getSortIndicator('subject_line')}
            </th>
            <th scope="col">Sender</th>
            <th scope="col" onClick={() => handleSort('send_datetime_utc')} className={styles.sortableHeader}>
              Sent At {getSortIndicator('send_datetime_utc')}
            </th>
            <th scope="col">Unique Opens</th>
            <th scope="col">Unique Clicks</th>
            <th scope="col">Total Clicks</th>
            <th scope="col" onClick={() => handleSort('open_rate')} className={styles.sortableHeader}>
              Open Rate {getSortIndicator('open_rate')}
            </th>
            <th scope="col" onClick={() => handleSort('click_through_rate')} className={styles.sortableHeader}>
              CTR {getSortIndicator('click_through_rate')}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedEmails.map((email) => (
            <tr key={email.message_id}>
              <td>{renderCell(email.subject_line)}</td>
              <td>{renderCell(email.sender_name)}</td>
              <td>{formatDate(email.send_datetime_utc)}</td>
              <td>{formatCount(email.unique_opens)}</td>
              <td>{formatCount(email.unique_clicks)}</td>
              <td>{formatCount(email.total_clicks)}</td>
              <td><StatusBadge value={email.open_rate} /></td>
              <td><StatusBadge value={email.click_through_rate} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmailTable;