import { Vehicle } from '../vehicles/types';

export type UserProfile = {
  id: string;
  userId: string;
  city: string;
  fullAddress: string;
  fullName: string;
  lastName: string;
  firstName: string;
  phoneNumber: string;
  profilePhoto?: string;
  signature?: string;
  zip?: string;
};

export type DriverLicense = {
  id: string;
  driverLicenseBack?: string;
  driverLicenseExpiry?: Date;
  driverLicenseFront?: string;
  dateOfBirth: string;
  bsnNumber?: string;
  driverLicense?: string;
  userProfileId: string;
};

export type PermitDetails = {
  id: string;
  kiwaTaxiVergunningId?: string;
  kvkDocumentId?: string;
  taxiPermitId?: string;
  taxiPermitExpiry?: string;
  taxiPermitPicture?: string;
  userProfileId: string;
};

export enum PaymentProduct {
  RENT = 'RENT',
  REGISTRATION = 'REGISTRATION',
}

export enum PaymentStatus {
  PAID = 'PAID',
  REFUNDED = 'REFUNDED',
  PENDING = 'PENDING',
  FAILED = 'FAILED',
}

export type Payment = {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  paymentDate: Date;
  orderId: string;
  product: PaymentProduct;
  status: PaymentStatus;
};

export enum OrderStatus {
  PENDING = 'PENDING',
  UNPAID = 'UNPAID',
  CONFIRMED = 'CONFIRMED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
}

export type Order = {
  id: string;
  vehicleId: string;
  userId: string;
  status: OrderStatus;
  totalAmount: number;
  rentalStartDate: string;
  rentalEndDate: string;
  paymentId?: string | null;
  createdAt: string;
  updatedAt: string;
  note?: string;
  user: {
    profile: UserProfile;
  };
  vehicle: Vehicle;
  stopRentDate?: Date;
  overdueEmailSentDate?: Date;
};

export type OrderRejection = {
  id: string;
  orderId: string;
  reason: string;
  date: Date;
};
