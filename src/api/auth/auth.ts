import { apiUrl } from '@/common/constants';
import axios from 'axios';

const BASE_URL = apiUrl + '/users';

axios.defaults.withCredentials = true;

export const requestPasswordReset = async (email: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/request-password-reset`, {
      email,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const verifyOtp = async (email: string, otp: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/verify-otp`, { email, otp });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, { email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};
