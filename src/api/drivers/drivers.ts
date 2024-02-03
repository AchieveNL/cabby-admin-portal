import axios from 'axios';
import { Driver, UserProfileStatus } from './types';
import { apiUrl } from '@/common/constants';

const DRIVERS_URL = apiUrl + '/profile';

axios.defaults.withCredentials = true;

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
  return response.data;
};

export const getDriverByStatus = async (
  status: UserProfileStatus,
): Promise<Driver[]> => {
  const response = await axios.get(`${DRIVERS_URL}/status/${status}`);
  return response.data.payload;
};
