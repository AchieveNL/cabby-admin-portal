import { Vehicle } from '../vehicles/types';

export enum ReportStatus {
  UNDERPAID = 'UNDERPAID',
  REPAIRED = 'REPAIRED',
}

export interface DamageReportResponse {
  id: number;
  reportedAt: Date;
  description: string;
  status: ReportStatus;
  amount?: number;
  repairedAt?: string;
  vehicleId: string;
  userId: string;
  user: {
    profile: {
      fullName: string;
    };
  };
  vehicle: {
    model: string;
    companyName: string;
  };
}

export interface DamageReportDetailsResponse {
  id: number;
  reportedAt: string;
  description: string;
  status: ReportStatus;
  amount?: number;
  repairedAt?: string;
  vehicleId: string;
  userId: string;
  images: string[];
  user: {
    role: string;
    profile: {
      fullName: string;
      lastName: string;
      firstName: string;
    };
  };
  vehicle: Vehicle;
}

export interface CreateDamageReportDto {
  description: string;
  amount?: number;
  reportedAt: Date;
  repairedAt?: Date;
  vehicleId: string;
}
