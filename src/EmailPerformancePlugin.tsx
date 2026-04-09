import React, { useState } from 'react';
import { Filters } from './components/Filters/Filters';
import { EmailTable } from './components/EmailTable/EmailTable';
import { LoadingState } from './components/LoadingState/LoadingState';
import { ErrorState } from './components/ErrorState/ErrorState';
import { useEmailPerformance } from './hooks/useEmailPerformance';
import { EmailPerformanceParams } from './types/email';
import styles from './EmailPerformancePlugin.module.css';

const DEFAULT_PARAMS: EmailPerformanceParams = { timePeriod: 'week' };

function EmailPerformancePluginInner(): React.ReactElement {
  const [params, setParams] = useState<EmailPerformanceParams>(DEFAULT_PARAMS);
  const { data, isLoading, error, refetch } = useEmailPerformance(params);

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <h1 className={styles.title}>Email Performance</h1>
      </header>
      <Filters params={params} onChange={setParams} />
      {isLoading && <LoadingState />}
      {!isLoading && error && <ErrorState error={error} onRetry={refetch} />}
      {!isLoading && !error && data && <EmailTable data={data} />}
    </div>
  );
}

export function EmailPerformancePlugin(): React.ReactElement {
  return <EmailPerformancePluginInner />;
}
