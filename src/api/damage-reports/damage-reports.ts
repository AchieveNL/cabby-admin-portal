import axios from 'axios';
import {
  CreateDamageReportDto,
  DamageReportDetailsResponse,
  DamageReportResponse,
  ReportStatus,
} from './types';
import { apiUrl } from '@/common/constants';

const BASE_URL = apiUrl + '/damage-reports';
axios.defaults.withCredentials = true;

export const getDamageReportsByStatus = async (
  status: ReportStatus,
): Promise<DamageReportResponse[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/${status}`);
    return response.data.payload;
  } catch (error) {
    throw error;
  }
};

export const getDamageReportsById = async (
  id: string,
): Promise<DamageReportDetailsResponse> => {
  try {
    const response = await axios.get(`${BASE_URL}/details/${id}`);
    return response.data.payload;
  } catch (error) {
    throw error;
  }
};

export const createDamageReports = async (values: CreateDamageReportDto) => {
  try {
    const response = await axios.post(`${BASE_URL}/`, { ...values });
    return response.data.payload;
  } catch (error) {
    throw error;
  }
};

export const closeDamageReports = async (id: string) => {
  try {
    const response = await axios.patch(`${BASE_URL}/${id}/close`);
    return response.data.payload;
  } catch (error) {
    throw error;
  }
};
