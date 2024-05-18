export interface User {
  email: string;
  status: UserProfileStatus;
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
  kvkDocument?: string;
  taxiPermitId?: string;
  taxiPermitExpiry?: string;
  taxiPermitPicture?: string;
}

export enum UserProfileStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  REJECTED = 'REJECTED',
  BLOCKED = 'BLOCKED',
  PENDING = 'PENDING',
}

export type DriverStatus = keyof typeof UserProfileStatus;
