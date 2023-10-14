export interface Driver {
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
  status: UserProfileStatus;
  driverLicense: DriverLicense;
  permitDetails: PermitDetails;
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
  kiwaTaxiVergunningId?: string;
  kvkDocumentId?: string;
  taxiPermitId?: string;
  taxiPermitExpiry?: string;
  taxiPermitPicture?: string;
}

export enum UserProfileStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BLOCKED = 'BLOCKED',
  REJECTED = 'REJECTED',
  PENDING = 'PENDING',
}
