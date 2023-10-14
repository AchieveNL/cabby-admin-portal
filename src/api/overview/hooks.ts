import { useState, useEffect } from 'react';
import { AxiosError } from 'axios';
import { Overview, PendingDetailsResponse } from './types';
import { getOverview, getPendingOverview } from './overview';

export const useOverview = () => {
  const [data, setData] = useState<Overview | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<AxiosError | null>(null);

  const fetchData = async () => {
    try {
      const overviewData = await getOverview();
      setData(overviewData);
    } catch (error) {
      setError(error as AxiosError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refetch: fetchData };
};

export const usePendingDetails = () => {
  const [data, setData] = useState<PendingDetailsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getPendingOverview();
      setData(response);
    } catch (error) {
      setError(error as AxiosError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refetch: fetchData };
};
