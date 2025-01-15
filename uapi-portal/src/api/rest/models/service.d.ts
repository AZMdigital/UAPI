export interface ServiceType {
  subscribed: boolean | undefined;
  iconName: any;
  id: number;
  name: string;
  description: string;
  serviceProvider: ServiceProvider;
  originalServiceHead: OriginalServiceHead;
  sector: string;
  swaggerPath: string;
  icon: string;
  active: boolean;
  createdAt: string;
  services: Services[];
  serviceHeadCode: string;
  serviceHeadId: any;
}

export interface PriceTierType {
  id?: number;
  fromRange: number;
  toRange: number;
  price: number;
}

export interface PricingType {
  id: number;
  name: string;
  fixedSuccessPrice: number;
  failurePricePercentage: number;
  fixedFailurePrice: number;
  isTier: boolean;
  pricingTiers: PriceTierType[];
}

export interface Services {
  id: number;
  name: string;
  arabicName: string;
  handle: string;
  pricing: PricingType;
  isActive: boolean;
  serviceHeadId: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  serviceCode: string;
}

export interface AuthTypes {
  id: number;
  authType: AuthType;
}

export interface ServiceProvider {
  id: number;
  name: string;
  arabicName: string;
  serviceProviderCode: string;
  clientCredentialsAllowed: boolean;
  requiresServiceHeadCredentials: boolean;
  description: string;
  authTypes: AuthTypes[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface OriginalServiceHead {
  sortedServiceHeadId: any;
  id: number;
  name: string;
  arabicName: string;
  sector: string;
  code: string;
  logo: string;
  logoName: string;
}

export interface AuthType {
  id: number;
  name: string;
  description: string;
  createdAt: string;
}

export interface ServiceCredentials {
  id?: number;
  companyId: number;
  authTypeId: number;
  apiKey?: string | null | undefined;
  appId: string;
  username: string;
  password: string;
  serviceHeadId?: number;
  useClientCredentials?: boolean;
  token?: string | null | undefined;
}

export interface ServiceCategory {
  name: string;
  originalServiceHead: OriginalServiceHead;
  serviceProvider: ServiceProvider;
  collection: ServiceType[];
  icon?: any;
  iconName?: any;
}

export interface ServicesCategory {
  isSelected?: boolean;
  name: string;
  collection: ServiceType[];
}

export interface CompanyServices {
  subscribed: boolean | undefined;
  id: number;
  service: Services;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface CredentialsData {
  id: number;
  serviceAuthType: AuthTypes;
  useClientCredentials: boolean;
  apiKey: string;
  username: string;
  password: string;
  createdAt: string;
  appId: string;
  token: string;
}

interface ServiceIconRequest {
  serviceHeadId: number;
}
