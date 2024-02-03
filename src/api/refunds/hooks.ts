import { useState, useEffect, useCallback } from 'react';
import { AxiosError } from 'axios';
import * as RefundsAPI from './refunds';
import { Refund, RefundInput } from './types';

export const useAllRefunds = () => {
  const [data, setData] = useState<Refund[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<AxiosError | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const refunds = await RefundsAPI.getAllRefunds();
        setData(refunds);
      } catch (error) {
        setError(error as AxiosError);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { data, loading, error };
};

export const useCreateRefund = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<AxiosError | null>(null);

  const create = useCallback(async (data: RefundInput) => {
    setLoading(true);
    try {
      return await RefundsAPI.createRefund(data);
    } catch (error) {
      setError(error as AxiosError);
    } finally {
      setLoading(false);
    }
  }, []);

  return { create, loading, error };
};
