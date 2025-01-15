import { RoleType } from "~/rest/models/role";
import { ServiceProvider } from "~/rest/models/service";

import {
  CredentailsMode,
  ServiceGroupType,
} from "~/modules/profile/utils/helper";

export interface CustomeHeaderModalProps {
  headersList: any[];
  selectedHeader: any;
  isOpen: boolean;
  isEditMode: boolean;
  handleCancel: (state: boolean) => void;
  handleUpdate: () => void;
}

export interface CallbackModalProps {
  servicesList: any[];
  selectedCallback: any;
  isOpen: boolean;
  isEditMode: boolean;
  isSaveBtnEnabled: boolean;
  handleCancel: (state: boolean) => void;
}

export interface CallbackFormProps {
  servicesList: any[];
  selectedCallback: any;
  isEditMode: boolean;
  isSaveBtnEnabled: boolean;
  handleCancel: (state: boolean) => void;
}

export interface CustomeHeaderFormProps {
  headersList: any[];
  selectedHeader: any;
  isEditMode: boolean;
  handleCancel: (state: boolean) => void;
  handleUpdate: () => void;
}

export interface CompanyType {
  id: number;
  companyName: string;
  companyWebsite: string;
  companyEmail: string;
  address: CompanyAddress;
  accountKey: string;
  allowPostpaidPackages: boolean;
  servicesPostpaidSubscribed: boolean;
  servicesPostpaidSubscriptionDate: string;
  accountType: string;
  mainAccountId: number;
  subAccountTypeDesc: string;
  useMainAccountBundles: boolean;
  superAdmin: boolean;
  accountCode: string;
}

export interface City {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyAddress {
  id?: number;
  city: City;
  country: string;
  district: string;
  buildingNumber: string;
  postalCode: string;
  secondaryNumber: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserType {
  id?: number;
  firstName: string;
  nationalId: string;
  lastName: string;
  arabicName: string;
  username: string;
  email: string;
  contactNo: string;
  isSuperAdmin: boolean;
  company: CompanyType;
  role: RoleType;
  userType: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  userCode: string;
}

export interface ServiceAuthProps {
  serviceProvider: ServiceProvider;
  credentailsMode: CredentailsMode;
  serviceHeadId?: number;
}

export interface SidebarListProps {
  list: any[];
  selectedItem: string | null;
  setSelectedItem: any;
  showSearchbar?: boolean;
  enableSelection?: boolean;
}
export interface ConfigurationInterface {
  id: number;
  name: string;
  type: boolean;
  handle: string;
  createdAt: string;
}

export interface DigitalSignatureProps {
  DigitalSignature: ConfigurationInterface;
}

export interface EnableStoplightElementsProps {
  EnableStoplightElements: ConfigurationInterface;
}

export interface CompanyConfiguration {
  configurationId: number;
  configurationValue: boolean;
}

export interface UploadPemProps {
  pemFile: File;
}

export interface PublicKeyData {
  id: number;
  fileName: string;
  publicKey: string;
  createdAt: string;
}

export interface ClientCertificateData {
  id: number;
  certificate: string;
  createdAt: string;
}

export interface TabListInterface {
  name: string;
  view: JSX.Element;
}

export interface ServiceProviderNestedListProps {
  ServiceProviderGroupList: ServiceProviderGroup[];
  selectedItem: any;
  setSelectedItem: any;
}

export interface ServiceProviderItemProps {
  serviceProvider: ServiceProviderGroup;
  selectedItem: any;
  setSelectedItem: any;
}

export interface ServiceProviderGroup {
  id: string;
  title: string;
  type: ServiceGroupType;
  parent: string;
  children?: any;
  showIcon?: boolean;
}
