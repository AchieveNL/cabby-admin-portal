// vehicles/vehicles.ts
import axios from 'axios';
import { Refund, RefundInput } from './types';
import { apiUrl } from '@/common/constants';

const REFUND_URL = apiUrl + '/refunds';

axios.defaults.withCredentials = true;

export const createRefund = async (data: RefundInput): Promise<Refund> => {
  const response = await axios.post(`${REFUND_URL}/`, data);
  return response.data.payload;
};

export const getAllRefunds = async (): Promise<Refund[]> => {
  const response = await axios.get(REFUND_URL);
  return response.data.payload;
};
