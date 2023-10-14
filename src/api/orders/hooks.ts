import { useEffect, useState } from 'react';
import { Order, OrderStatus } from './types';
import { getOrderDetails, getOrders } from './orders';
import { AxiosError } from 'axios';

export const useOrders = (status: OrderStatus) => {
  const [data, setData] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<AxiosError | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const orders = await getOrders(status);
      setData(orders);
    } catch (error) {
      setError(error as unknown as AxiosError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return { data, loading, error, refetch: fetchData };
};

export const useOrderDetails = (orderId: string | undefined) => {
  const [data, setData] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const orderDetails = await getOrderDetails(orderId as string);
        setData(orderDetails);
      } catch (error) {
        setError(error as unknown as AxiosError);
      } finally {
        setLoading(false);
      }
    };
    if (orderId) {
      fetchData();
    }
  }, [orderId]);

  return { data, loading, error };
};
