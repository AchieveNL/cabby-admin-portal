import { apiUrl } from '@/common/constants';
import { Order, OrderStatus, OrderStatusKey } from './types';
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
  status: OrderStatusKey,
) => {
  try {
    const response = await axios.post(`${BASE_URL}/change-status`, {
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

export const createOrderAdmin = async (data: any) => {
  try {
    const response = await axios.post(`${BASE_URL}/create-admin`, data);
    await invalidateOrders();
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getRangeInvoices = async (start: string, end: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/range-invoices`, {
      params: { start, end },
    });
    return response.data.payload;
  } catch (error) {
    throw error;
  }
};

export const getRangeExcel = async (start: string, end: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/range-excel`, {
      params: { start, end },
      responseType: 'blob',
    });

    // create file link in browser's memory
    const href = URL.createObjectURL(response.data);

    // create "a" HTML element with href to file & click
    const link = document.createElement('a');
    link.href = href;
    link.setAttribute('download', 'data.xlsx'); //or any other extension
    document.body.appendChild(link);
    link.click();

    // clean up "a" element & remove ObjectURL
    document.body.removeChild(link);
    URL.revokeObjectURL(href);

    return response.data;
  } catch (error) {
    throw error;
  }
};
