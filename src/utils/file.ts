import { apiUrl } from '@/common/constants';
import axios from 'axios';

export const downloadFile = async (url: string) => {
  try {
    const response = await axios.get(apiUrl + '/files/download', {
      responseType: 'blob', // important for binary data
      params: { url },
    });
    const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = urlBlob;
    link.setAttribute('download', url.split('/').pop() || 'file');
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error('Error downloading file:', error);
  }
};

export const downloadAllFiles = (urls: string[]) => {
  urls.forEach((url) => {
    downloadFile(url);
  });
};
