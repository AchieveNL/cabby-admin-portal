import { useState, useEffect, useCallback } from 'react';
import { AxiosError } from 'axios';
import * as DriverAPI from './drivers';
import { Driver, UserProfileStatus } from './types';
import { message } from 'antd';

export const useAllDrivers = () => {
  const [data, setData] = useState<Driver[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<AxiosError | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const drivers = await DriverAPI.getAllDrivers();
        setData(drivers);
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

export const useDriversByStatus = (status: UserProfileStatus) => {
  const [data, setData] = useState<Driver[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const drivers = await DriverAPI.getDriverByStatus(status);
      setData(drivers);
    } catch (error) {
      message.error((error as AxiosError).message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [status]);

  return { data, loading, refresh: fetchData };
};

export const useDriverById = (id: string) => {
  const [data, setData] = useState<Driver | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<AxiosError | null>(null);
  const fetchData = async () => {
    setLoading(true);
    try {
      const driver = await DriverAPI.getDriverById(id);
      setData(driver);
    } catch (error) {
      setError(error as AxiosError);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [id]);

  return { data, loading, error, refetch: fetchData };
};

export const useUpdateDriverStatus = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<AxiosError | null>(null);

  const updateStatus = useCallback(
    async (id: string, status: UserProfileStatus, reason?: string) => {
      setLoading(true);
      try {
        await DriverAPI.updateDriverStatus(id, status, reason);
      } catch (error) {
        setError(error as AxiosError);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { updateStatus, loading, error };
};
