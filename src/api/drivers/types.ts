export interface User {
  email: string;
  status: UserProfileStatus;
}

export enum RegistrationOrderStatus {
  PAID = 'PAID',
  REFUNDED = 'REFUNDED',
  PENDING = 'PENDING',
  FAILED = 'FAILED',
}

export interface RegistrationOrder {
  id: string;
  userId: string;
  status: RegistrationOrderStatus;
  totalAmount: number; // Decimal(6, 2) can be represented by number in TypeScript
  paymentId?: string;
  createdAt: Date;
  updatedAt: Date;
  note?: string;
  invoiceUrl?: string;
}

export interface Driver {
  id: string;
  userId: string;
  user: User;
  city: string;
  fullAddress: string;
  fullName: string;
  lastName: string;
  firstName: string;
  phoneNumber: string;
  profilePhoto?: string;
  signature?: string;
  zip?: string;
  dateOfBirth: string;
  status: UserProfileStatus;
  driverLicense: DriverLicense;
  permitDetails: PermitDetails;
  userVerification?: UserVerification;
}

export interface UserVerification {
  id: string;
  userProfileId: string;
  extractedFirstName: string | null;
  extractedLastName: string | null;
  extractedBsnNumber: string | null;
  extractedDateOfBirth: string | null;
  extractedExpiryDate: string | null;
  existingFirstName: string | null;
  existingLastName: string | null;
  existingBsnNumber: string | null;
  existingDateOfBirth: string | null;
  existingExpiryDate: string | null;
  isNameMatch: boolean;
  isBsnNumberMatch: boolean;
  isDateOfBirthMatch: boolean;
  isExpiryDateMatch: boolean;
}

export interface DriverLicense {
  id: string;
  driverLicenseBack?: string;
  driverLicenseExpiry?: string;
  driverLicenseFront?: string;
  dateOfBirth: string;
  bsnNumber?: string;
  driverLicense?: string;
}

export interface PermitDetails {
  id: string;
  kiwaDocument?: string;
  kvkNumber?: string;
  kvkDocument?: string;
  taxiPermitId?: string;
  taxiPermitExpiry?: string;
  taxiPermitPicture?: string;
}

export enum UserProfileStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  REJECTED = 'REJECTED',
  BLOCKED = 'BLOCKED',
}

export type DriverStatus = keyof typeof UserProfileStatus;
