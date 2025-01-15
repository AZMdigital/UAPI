/* eslint-disable @typescript-eslint/naming-convention */
export interface AdminInfoFormInputs {
  controllerName: string | null | undefined;
  nationalId: string;
  name: string;
  email: string;
  mobileNumber: string;
}

export interface UserModel {
  firstName: string;
  lastName: string;
  nationalId: string;
  username: string;
  email: string;
  contactNo: string;
  userType: string;
}

export interface CompanyInputType {
  id?: number;
  companyName: string;
  companyWebsite: string;
  companyEmail: string;
  taxNumber: string;
  commercialRegistry: string;
  unifiedNationalNumber: string;
  issueDate: string;
  expiryDate: string;
  issueDateHijri: string;
  expiryDateHijri: string;
  address: any;
  companyRep: any;
  isActive: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  allowPostpaidPackages: boolean;
  servicesPostpaidSubscribed: boolean;
  servicesPostpaidSubscriptionDate: string;
  sector: any;
  attachmentDTOList?: any;
  accountKey: string;
  accountType: string;
  mainAccountId: number;
  subAccountTypeDesc: string;
  useMainAccountBundles: boolean;
  superAdmin: any;
  accountCode: string;
}
