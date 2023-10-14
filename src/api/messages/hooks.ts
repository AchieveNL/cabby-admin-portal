// useDamageReport.ts (if you're using TypeScript, otherwise use .js)
import { useState, useEffect } from 'react';
import { AxiosError } from 'axios';
import { MinimalUser } from './types';
import { getCurrentUser, getUserById } from './messages';

export const useCurrentUser = () => {
  const [data, setData] = useState<MinimalUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AxiosError | null>(null);

  const fetchData = async () => {
    try {
      const user = await getCurrentUser();
      setData(user);
    } catch (error) {
      setError(error as AxiosError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, loading, error, refetch: fetchData };
};

export const useUserById = (id: string) => {
  const [data, setData] = useState<MinimalUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AxiosError | null>(null);

  const fetchData = async (id: string) => {
    try {
      const user = await getUserById(id);
      setData(user);
    } catch (error) {
      setError(error as AxiosError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return { data, loading, error, refetch: fetchData };
};
