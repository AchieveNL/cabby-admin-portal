import { apiUrl } from '@/common/constants';
import axios from 'axios';
import { queryClient } from '@/pages/_app';

const BASE_URL = apiUrl + '/payment';

export const refundPayment = async (paymentId: string): Promise<any> => {
  try {
    const response = await axios.post(`${BASE_URL}/refund/${paymentId}`);
    await queryClient.invalidateQueries();
    return response.data.payload;
  } catch (error) {
    return [];
  }
};
