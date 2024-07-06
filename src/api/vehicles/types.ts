export enum VehicleStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  REJECTED = 'REJECTED',
  BLOCKED = 'BLOCKED',
}

export interface Vehicle extends VehicleInput {
  id: string;
}

export enum VehicleEngineType {
  BENZINE = 'BENZINE',
  HYBRIDE_BENZINE = 'HYBRIDE_BENZINE',
  DIESEL = 'DIESEL',
  HYBRIDE_DIESEL = 'HYBRIDE_DIESEL',
  ELEKTRISCH = 'ELEKTRISCH',
}

export type VehicleInput = {
  logo?: string;
  companyName: string;
  model: string;
  rentalDuration: string;
  licensePlate?: string;
  category?: string;
  manufactureYear: string;
  engineType?: VehicleEngineType;
  seatingCapacity: string;
  batteryCapacity?: number;
  uniqueFeature: string;
  images: string[];
  papers: string[];
  availability?: string;
  unavailabilityReason?: string;
  currency?: string;
  pricePerDay?: number;
  status: VehicleStatus;
  vin?: string;
  timeframes: number[][];
  streetName?: string;
  streetNumber?: string;
  zipcode?: string;
  state?: string;
  title?: string;
  description?: string;
};
