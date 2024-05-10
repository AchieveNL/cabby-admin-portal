export enum VehicleStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  REJECTED = 'REJECTED',
  BLOCKED = 'BLOCKED',
}

export interface Vehicle extends VehicleInput {
  id: string;
}

export type VehicleInput = {
  logo?: string;
  companyName: string;
  model: string;
  rentalDuration: string;
  licensePlate?: string;
  category?: string;
  manufactureYear: string;
  engineType: string;
  seatingCapacity: string;
  batteryCapacity: string;
  uniqueFeature: string;
  images: string[];
  availability?: string;
  unavailabilityReason?: string;
  currency?: string;
  pricePerDay?: number;
  status: VehicleStatus;
  vin?: string;
  timeframes: number[][];
};
