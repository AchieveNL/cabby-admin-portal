/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from 'react';
import { AxiosError } from 'axios';
import * as VehicleAPI from './vehicles';
import { Vehicle, VehicleInput, VehicleStatus } from './types';
import { message } from 'antd';

export const useAllVehicles = () => {
  const [data, setData] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<AxiosError | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const vehicles = await VehicleAPI.getAllVehicles();
        setData(vehicles);
      } catch (error) {
        setError(error as AxiosError);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { data, loading, error };
};

export const useVehiclesByStatus = (status: VehicleStatus) => {
  const [data, setData] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const vehicles = await VehicleAPI.getVehiclesByStatus(status);
      setData(vehicles);
    } catch (error) {
      message.error((error as AxiosError).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [status]);

  return { data, loading, refresh: fetchData };
};

// ... More hooks can be added for each API, following the structure shown above.

// A hook for creating a vehicle
export const useCreateVehicle = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<AxiosError | null>(null);

  const create = useCallback(async (data: VehicleInput) => {
    setLoading(true);
    try {
      return await VehicleAPI.createVehicle(data);
    } catch (error) {
      setError(error as AxiosError);
    } finally {
      setLoading(false);
    }
  }, []);

  return { create, loading, error };
};

export const useUpdateVehicle = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<AxiosError | null>(null);

  const update = useCallback(async (id: string, data: Vehicle) => {
    setLoading(true);
    try {
      await VehicleAPI.updateVehicle(id, data);
    } catch (error) {
      setError(error as AxiosError);
    } finally {
      setLoading(false);
    }
  }, []);

  return { update, loading, error };
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
  const [data, setData] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<AxiosError | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const vehicle = await VehicleAPI.getVehicleById(id);
        setData(vehicle);
      } catch (error) {
        setError(error as AxiosError);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  return { data, loading, error };
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
