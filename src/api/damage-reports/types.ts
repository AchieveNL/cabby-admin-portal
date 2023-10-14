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
  repairedAt?: Date;
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

export interface CreateDamageReportDto {
  description: string;
  amount?: number;
  reportedAt: Date;
  repairedAt?: Date;
  vehicleId: string;
}
