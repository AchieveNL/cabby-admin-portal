import { apiUrl } from '@/common/constants';
import { Order, OrderStatus } from './types';
import axios from 'axios';
import { queryClient } from '@/pages/_app';
import { queryKey } from './hooks';
import { useQuery } from '@tanstack/react-query';

const BASE_URL = apiUrl + '/orders';

axios.defaults.withCredentials = true;
type Keys = keyof typeof OrderStatus;
export const invalidateOrders = () =>
  queryClient.invalidateQueries({ queryKey: queryKey });

export const getOrders = async (status?: Keys): Promise<Order[]> => {
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

export const deleteOrder = async (orderId: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/delete`, {
      orderId,
    });
    await invalidateOrders();
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const changeOrderStatus = async (
  orderId: string,
  status: OrderStatus,
) => {
  try {
    const response = await axios.post(`${BASE_URL}/delete`, {
      orderId,
      status,
    });
    await invalidateOrders();
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const stopOrder = async (orderId: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/stop`, {
      orderId,
    });
    await invalidateOrders();
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const completeOrderAdmin = async (orderId: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/complete-admin`, {
      orderId,
    });
    await invalidateOrders();
    return response.data;
  } catch (error) {
    throw error;
  }
};
