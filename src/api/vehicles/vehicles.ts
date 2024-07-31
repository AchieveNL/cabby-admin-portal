// vehicles/vehicles.ts
import axios from 'axios';
import { Vehicle, VehicleInput, VehicleStatus } from './types';
import { apiUrl } from '@/common/constants';
import { VehicleStatusType } from '@/components/tables/vehicles/VehiclesTab';
import { invalidateVehicles } from './hooks';
import { queryClient } from '@/pages/_app';

const VEHICLES_URL = apiUrl + '/vehicles';

axios.defaults.withCredentials = true;

export const createVehicle = async (data: VehicleInput): Promise<Vehicle> => {
  const response = await axios.post(`${VEHICLES_URL}/create`, data);
  return response.data.payload;
};

export const updateVehicle = async (
  id: string,
  data: VehicleInput,
): Promise<Vehicle> => {
  const response = await axios.put(`${VEHICLES_URL}/update/${id}`, data);
  return response.data.payload;
};

export const getAllVehicles = async (): Promise<Vehicle[]> => {
  const response = await axios.get(VEHICLES_URL);
  return response.data.payload;
};

export const getVehiclesByStatus = async (
  status: VehicleStatusType,
): Promise<Vehicle[]> => {
  const response = await axios.get(`${VEHICLES_URL}/status/${status}`);
  return response.data.payload;
};

export const getVehicleByModel = async (model: string): Promise<Vehicle> => {
  const response = await axios.get<Vehicle>(`${VEHICLES_URL}/model/${model}`);
  return response.data;
};

export const getVehiclesByCategory = async (
  category: string,
): Promise<Vehicle[]> => {
  const response = await axios.get<Vehicle[]>(
    `${VEHICLES_URL}/category/${category}`,
  );
  return response.data;
};

export const getVehicleByLicensePlate = async (
  licensePlate: string,
): Promise<Vehicle> => {
  const response = await axios.get<Vehicle>(
    `${VEHICLES_URL}/licensePlate/${licensePlate}`,
  );
  return response.data;
};

export const getVehicleByRDWLicencePlate = async (
  licensePlate: string,
): Promise<any> => {
  const response = await axios.get(
    `${VEHICLES_URL}/licensePlate/opendata/${licensePlate}`,
  );
  return response.data.payload;
};

export const getVehicleById = async (id: string): Promise<Vehicle> => {
  const response = await axios.get(`${VEHICLES_URL}/${id}`);
  return response.data.payload;
};

export const updateVehicleStatus = async (
  id: string,
  status: VehicleStatus,
): Promise<Vehicle> => {
  const response = await axios.patch<Vehicle>(`${VEHICLES_URL}/status`, {
    id,
    status,
  });
  await invalidateVehicles();
  return response.data;
};

export const deleteVehicle = async (id: string): Promise<Vehicle> => {
  const response = await axios.delete<Vehicle>(`${VEHICLES_URL}/${id}`);
  await invalidateVehicles();
  return response.data;
};

export const getFilteredVehicles = async (filters: any): Promise<Vehicle[]> => {
  // Define a filter type if specific filter fields are known
  const response = await axios.get<Vehicle[]>(`${VEHICLES_URL}/filter`, {
    params: filters,
  });
  return response.data;
};

export const vehicleFormData = (
  vehicleData: any,
  images: FileList | null,
): FormData => {
  const formData = new FormData();

  Object.keys(vehicleData).forEach((key) => {
    formData.append(key, vehicleData[key]);
  });

  if (images) {
    for (let i = 0; i < images.length; i++) {
      formData.append('images', images[i], images[i].name);
    }
  }

  return formData;
};

export const saveVehicleRejection = async (
  vehicleId: string,
  reason: string,
): Promise<any> => {
  const response = await axios.post(`${VEHICLES_URL}/rejection`, {
    vehicleId,
    reason,
  });
  return response.data;
};

export const getDeposit = async (): Promise<string> => {
  const response = await axios.get(`${VEHICLES_URL}/deposit`);
  return response.data.payload;
};

export const upsertDeposit = async ({
  value,
}: {
  value: number;
}): Promise<any> => {
  const response = await axios.post(`${VEHICLES_URL}/deposit`, { value });
  await queryClient.invalidateQueries({ queryKey: ['deposit'] });
  return response.data;
};

export const getLastVehicleDetails = async (): Promise<Vehicle> => {
  const response = await axios.get(`${VEHICLES_URL}/last-details`);

  return response.data.payload;
};
