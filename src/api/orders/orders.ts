import { apiUrl } from '@/common/constants';
import { Order, OrderStatus } from './types';
import axios from 'axios';
import { queryClient } from '@/pages/_app';
import { queryKey } from './hooks';

const BASE_URL = apiUrl + '/orders';

axios.defaults.withCredentials = true;

export const invalidateOrders = () =>
  queryClient.invalidateQueries({ queryKey: queryKey });

export const getOrders = async (status: OrderStatus): Promise<Order[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/status/${status}`);
    return response.data.payload;
  } catch (error) {
    return [];
  }
};

export const getOrderDetails = async (orderId: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/details/${orderId}`);
    return response.data.payload;
  } catch (error) {
    throw error;
  }
};

export const createOrderRejectionReason = async (
  orderId: string,
  reason: string,
) => {
  try {
    const response = await axios.post(`${BASE_URL}/rejection/${orderId}`, {
      reason,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const confirmOrder = async (orderId: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/confirm`, {
      orderId,
    });
    await invalidateOrders();
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const rejectOrder = async (orderId: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/reject`, {
      orderId,
    });
    // await invalidateOrders();
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const cancelOrder = async (orderId: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/cancel`, {
      orderId,
    });
    await invalidateOrders();
    return response.data;
  } catch (error) {
    throw error;
  }
};
