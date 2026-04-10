import { useState, useEffect } from 'react';
import { getEmailPerformance, EmailRecord, EmailPerformanceParams } from '../types/email';
import { usePluginSdk } from '@staffbase/plugin-sdk-react';

export function useEmailPerformance(params: EmailPerformanceParams) {
  const [data, setData] = useState<EmailRecord[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);
  
  const { token } = usePluginSdk();
  
  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      setError(new Error('No authentication token available'));
      return;
    }
    
    let isCancelled = false;
    
    const fetchData = async () => {
      try {
        const result = await getEmailPerformance(token, params);
        
        if (!isCancelled) {
          setData(result);
          setError(null);
        }
      } catch (err: any) {
        if (!isCancelled) {
          setError(err);
          setData(null);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };
    
    fetchData();
    
    return () => {
      isCancelled = true;
    };
  }, [token, params]);
  
  const refetch = () => {
    if (token) {
      setIsLoading(true);
      getEmailPerformance(token, params)
        .then(result => {
          setData(result);
          setError(null);
          setIsLoading(false);
        })
        .catch(err => {
          setError(err);
          setIsLoading(false);
        });
    }
  };
  
  return { data, isLoading, error, refetch };
}