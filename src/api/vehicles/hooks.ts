/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from 'react';
import {
  useQuery,
  useMutation,
  UndefinedInitialDataOptions,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import * as VehicleAPI from './vehicles';
import { Vehicle, VehicleInput, VehicleStatus } from './types';
import { message } from 'antd';
import { queryClient } from '@/pages/_app';
import { VehicleStatusType } from '@/components/tables/vehicles/VehiclesTab';

export const invalidateVehicles = () =>
  queryClient.invalidateQueries({
    queryKey: ['vehicles'],
  });

export const useAllVehicles = () => {
  return useQuery({
    queryKey: ['vehicles'],
    queryFn: VehicleAPI.getAllVehicles,
  });
};

export const useVehiclesByStatus = (status: VehicleStatusType) => {
  return useQuery({
    queryKey: ['vehicles', status],
    queryFn: () => VehicleAPI.getVehiclesByStatus(status),
  });
};

export const useGetDeposit = () => {
  return useQuery({
    queryKey: ['deposit'],
    queryFn: () => VehicleAPI.getDeposit(),
  });
};

export const useUpdateVehicleStatus = () => {
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: VehicleStatus }) =>
      VehicleAPI.updateVehicleStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vehicles'] }),
  });
};

// ... More hooks can be added for each API, following the structure shown above.

// A hook for creating a vehicle
export const useCreateVehicle = () => {
  return useMutation({
    mutationFn: (data: VehicleInput) => VehicleAPI.createVehicle(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vehicles'] }),
  });
};

export const useUpdateVehicle = () => {
  return useMutation({
    mutationFn: ({ data, id }: { id: string; data: VehicleInput }) =>
      VehicleAPI.updateVehicle(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vehicles'] }),
  });
};

export const useVehicleByModel = (model: string) => {
  const [data, setData] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<AxiosError | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const vehicle = await VehicleAPI.getVehicleByModel(model);
        setData(vehicle);
      } catch (error) {
        setError(error as AxiosError);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [model]);

  return { data, loading, error };
};

export const useVehiclesByCategory = (category: string) => {
  const [data, setData] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<AxiosError | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const vehicles = await VehicleAPI.getVehiclesByCategory(category);
        setData(vehicles);
      } catch (error) {
        setError(error as AxiosError);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [category]);

  return { data, loading, error };
};

export const useVehicleByLicensePlate = (licensePlate: string) => {
  const [data, setData] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<AxiosError | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const vehicle = await VehicleAPI.getVehicleByLicensePlate(licensePlate);
        setData(vehicle);
      } catch (error) {
        setError(error as AxiosError);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [licensePlate]);

  return { data, loading, error };
};

export const useVehicleById = (id: string) => {
  return useQuery({
    queryKey: ['vehicles', id],
    queryFn: () => VehicleAPI.getVehicleById(id),
    enabled: !!id,
  });
};

export const useDeleteVehicle = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<AxiosError | null>(null);

  const deleteVehicle = useCallback(async (id: string) => {
    setLoading(true);
    try {
      await VehicleAPI.deleteVehicle(id);
    } catch (error) {
      setError(error as AxiosError);
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteVehicle, loading, error };
};

export const useFilteredVehicles = (filter: any) => {
  const [data, setData] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<AxiosError | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const vehicles = await VehicleAPI.getFilteredVehicles(filter);
        setData(vehicles);
      } catch (error) {
        setError(error as AxiosError);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filter]);

  return { data, loading, error };
};
