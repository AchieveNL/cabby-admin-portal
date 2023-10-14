import { apiUrl } from '@/common/constants';
import axios from 'axios';

const FILES_API_URL = apiUrl + '/files';

export const uploadFile = async (formData: FormData) => {
  try {
    const response = await axios.post(`${FILES_API_URL}/upload`, formData);
    return response.data.payload;
  } catch (error) {
    throw error;
  }
};

export const deleteFile = async (filePath: string) => {
  try {
    const response = await axios.delete(
      `${FILES_API_URL}/delete?filePath=${filePath}`,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
