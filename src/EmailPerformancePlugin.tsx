import React, { useState } from 'react';
import { usePluginSdk } from '@staffbase/plugin-sdk-react';
import { EmailPerformanceParams } from './types/email';
import { useEmailPerformance } from './hooks/useEmailPerformance';
import Filters from './components/Filters/Filters';
import EmailTable from './components/EmailTable/EmailTable';
import LoadingState from './components/LoadingState/LoadingState';
import ErrorState from './components/ErrorState/ErrorState';

const EmailPerformancePlugin: React.FC = () => {
  const [params, setParams] = useState<EmailPerformanceParams>({ timePeriod: 'week' });
  
  const { data, isLoading, error, refetch } = useEmailPerformance(params);
  
  const handleTimePeriodChange = (timePeriod: 'day' | 'week' | 'month' | 'quarter') => {
    setParams(prev => ({ ...prev, timePeriod }));
  };
  
  return (
    <div style={{ padding: '16px' }}>
      <h2>Email Performance Dashboard</h2>
      
      <Filters onTimePeriodChange={handleTimePeriodChange} />
      
      {isLoading && <LoadingState />}
      
      {error && !isLoading && (
        <ErrorState error={error} onRetry={refetch} />
      )}
      
      {!isLoading && !error && data && (
        <EmailTable emails={data} />
      )}
    </div>
  );
};

export default EmailPerformancePlugin;