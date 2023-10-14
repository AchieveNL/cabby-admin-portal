import axios from 'axios';
import { Overview, PendingDetailsResponse } from './types';
import { apiUrl } from '@/common/constants';

const BASE_URL = apiUrl + '/overview';

axios.defaults.withCredentials = true;

export const getOverview = async (): Promise<Overview> => {
  try {
    const response = await axios.get(`${BASE_URL}/`);
    return response.data.payload;
  } catch (error) {
    throw error;
  }
};

export const getPendingOverview = async (): Promise<PendingDetailsResponse> => {
  try {
    const response = await axios.get(`${BASE_URL}/pending-details`);
    return response.data.payload;
  } catch (error) {
    throw error;
  }
};
