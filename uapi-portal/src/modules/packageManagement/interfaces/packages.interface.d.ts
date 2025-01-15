import { PackageType } from "~/rest/models/package";

export interface PackageCardProps {
  packageData: PackageType;
  otherData?: any;
  packageDescriptionList: string[];
  selectedPackage: PackageType;
  handleSelection: (id: PackageType) => void;
}

export interface AnnualPackageModalProps {
  selectedPackage: PackageType;
  modalHeading: string;
  packageDescriptionList: string[];
  isOpen: boolean;
  handleAction: (state: boolean) => void;
}

export interface AllPackageProps {
  packages: PackageType[];
  companySelectedPackages: any[];
}

export interface ActivePackage {
  packageId: number;
  activationDate: string;
}
export interface PackageDetailProps {
  isOpen: boolean;
  selectedPackage: any;
  handleAction: (state: boolean) => void;
}
