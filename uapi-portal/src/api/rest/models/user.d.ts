import { RoleType } from "~/rest/models/role";

export interface CompanyType {
  id: number;
  companyName: string;
  companyWebsite: string;
  companyEmail: string;
}

export interface UserInputType {
  id?: number;
  firstName: string;
  nationalId: string;
  lastName: string;
  username: string;
  email: string;
  contactNo: string;
  isSuperAdmin: boolean;
  company: CompanyType;
  role: RoleType;
  userType: string;
  password: string;
  confirmPassword?: string;
  isActive: string;
  isDeleted?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  userCode: any;
}

export interface UserProfileType {
  id: string;
  firstName: string;
  nationalId: string;
  lastName: string;
  username: string;
  email: string;
  contactNo: string;
  company: string;
  userType: string;
  isActive: string;
  isDeleted: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}
