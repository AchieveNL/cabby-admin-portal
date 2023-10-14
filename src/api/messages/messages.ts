import axios from 'axios';
import { MinimalUser, UserConversationResponse } from './types';
import { apiUrl, baseUrl } from '@/common/constants';

const BASE_URL = apiUrl + '/users';
axios.defaults.withCredentials = true;

export const getCurrentUser = async (): Promise<MinimalUser> => {
  try {
    const response = await axios.get(`${BASE_URL}/current`);
    return response.data.payload;
  } catch (error) {
    throw error;
  }
};

export const getUserById = async (id: string): Promise<MinimalUser> => {
  try {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data.payload;
  } catch (error) {
    throw error;
  }
};

export const getConversations = async (): Promise<
  UserConversationResponse[]
> => {
  try {
    const response = await axios.get(`${baseUrl}/messages/conversations`);
    return response.data.payload;
  } catch (error) {
    console.error('Error fetching conversations:', error);
    throw error;
  }
};
