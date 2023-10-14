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

  useEffect(() => {
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
    fetchData();
  }, [status]);

  return { data, loading };
};

export const useDriverById = (id: string) => {
  console.log(id);
  const [data, setData] = useState<Driver | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<AxiosError | null>(null);

  useEffect(() => {
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
    fetchData();
  }, [id]);

  return { data, loading, error };
};

export const useUpdateDriverStatus = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<AxiosError | null>(null);

  const updateStatus = useCallback(
    async (id: string, status: UserProfileStatus) => {
      setLoading(true);
      try {
        await DriverAPI.updateDriverStatus(id, status);
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
