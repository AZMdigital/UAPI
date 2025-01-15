export interface PackageType {
  id: number;
  name: string;
  arabicName: string;
  transactionLimit: number;
  pricePerPeriod: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  packageCode: string;
  activationDate: string;
  packageType: string;
  packagePeriod: string;
}
