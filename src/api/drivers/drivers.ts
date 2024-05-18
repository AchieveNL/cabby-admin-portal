import axios from 'axios';
import { Driver, DriverStatus, UserProfileStatus } from './types';
import { apiUrl } from '@/common/constants';
import { queryClient } from '@/pages/_app';

const DRIVERS_URL = apiUrl + '/profile';

axios.defaults.withCredentials = true;

const invalidateDrivers = () =>
  queryClient.invalidateQueries({ queryKey: ['drivers'] });

export const getAllDrivers = async (): Promise<Driver[]> => {
  const response = await axios.get(`${DRIVERS_URL}/drivers/list`);
  return response.data.payload as Driver[];
};

export const getDriverById = async (id: string): Promise<Driver> => {
  const response = await axios.get(`${DRIVERS_URL}/${id}`);
  return response.data.payload;
};

export const updateDriverStatus = async (
  id: string,
  status: UserProfileStatus,
  reason?: string,
): Promise<Driver> => {
  const response = await axios.patch<Driver>(`${DRIVERS_URL}/status/${id}`, {
    status,
    reason,
  });
  await invalidateDrivers();
  return response.data;
};

export const getDriverByStatus = async (
  status: DriverStatus,
): Promise<Driver[]> => {
  const response = await axios.get(`${DRIVERS_URL}/status/${status}`);
  return response.data.payload;
};

export const deleteDriver = async (userId: string): Promise<any> => {
  const response = await axios.delete(`${apiUrl}/users/delete-account`, {
    data: { userId },
  });
  await invalidateDrivers();
  return response.data;
};
