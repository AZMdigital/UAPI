import axiosInstance from "~/config/axiosInstance";

import { COMPANIES_ENDPOINTS } from "~/rest/endpoints";

export const getSubAccountUrl = (
  mainAccountId: number | null,
  subAccountId: number | null
) => {
  if (subAccountId !== null && mainAccountId !== null) {
    return `/${mainAccountId}/sub-account/${subAccountId}`;
  } else {
    return "";
  }
};

export const getSubAccountPackageUrl = (subAccountId: number | null) => {
  if (subAccountId !== null) {
    return `/sub-account/${subAccountId}`;
  } else {
    return "";
  }
};

export const getCompanyApiKey = async () => {
  const { data: response } = await axiosInstance.get(
    COMPANIES_ENDPOINTS.getApiKey
  );
  return response;
};

export const getCompanyServices = async (companyId: number) => {
  const { data: response } = await axiosInstance.get(
    `${COMPANIES_ENDPOINTS.getCompanyServices}/${companyId}`
  );
  return response;
};

export const saveCompanyApiKey = async () => {
  const { data: response } = await axiosInstance.post(
    COMPANIES_ENDPOINTS.getApiKey
  );
  return response;
};

export const getCompanySubAccounts = async (companyId: number) => {
  const { data: response } = await axiosInstance.get(
    `${COMPANIES_ENDPOINTS.getCompany}/${companyId}/${COMPANIES_ENDPOINTS.getSubAccount}`
  );
  return response;
};

export const getSearchCompanySubAccounts = async (
  companyId: number,
  query: string
) => {
  const { data: response } = await axiosInstance.get(
    `${COMPANIES_ENDPOINTS.getCompany}/${companyId}/${COMPANIES_ENDPOINTS.getSubAccount}?query=${query}`
  );
  return response;
};

export const deleteCompanySubAccount = async (
  companyId: number,
  subAccountId: number
) => {
  const { data: response } = await axiosInstance.delete(
    `${COMPANIES_ENDPOINTS.getCompany}/${companyId}/${COMPANIES_ENDPOINTS.getSubAccount}/${subAccountId}`
  );
  return response;
};

export const createSubAccount = async (body: any, companyId: number) => {
  const { data: response } = await axiosInstance.post(
    `${COMPANIES_ENDPOINTS.getCompany}/${companyId}/${COMPANIES_ENDPOINTS.getSubAccount}`,
    body
  );
  return response;
};

export const getSubAccountToken = async (body: any) => {
  const { data: response } = await axiosInstance.post(
    `${COMPANIES_ENDPOINTS.getUser}/${COMPANIES_ENDPOINTS.getPortalToken}`,
    body
  );
  return response;
};

export const updateSubAccount = async (
  body: any,
  companyId: number,
  subAccountId: number
) => {
  const { data: response } = await axiosInstance.put(
    `${COMPANIES_ENDPOINTS.getCompany}/${companyId}/${COMPANIES_ENDPOINTS.getSubAccount}/${subAccountId}`,
    body
  );
  return response;
};

export const getCompanyAnnualPackages = async (
  companyId: number,
  subAccountId: number | null
) => {
  const { data: response } = await axiosInstance.get(
    `${COMPANIES_ENDPOINTS.getCompany}/${companyId}${getSubAccountPackageUrl(
      subAccountId
    )}/${COMPANIES_ENDPOINTS.getPackages}?packageType=ANNUAL`
  );
  return response;
};

export const getCompanyServicesPackages = async (
  companyId: number,
  subAccountId: number | null
) => {
  const { data: response } = await axiosInstance.get(
    `${COMPANIES_ENDPOINTS.getCompany}/${companyId}${getSubAccountPackageUrl(
      subAccountId
    )}/${COMPANIES_ENDPOINTS.getPackages}?packageType=SERVICES`
  );
  return response;
};

export const getCompanySelectedPackages = async (
  mainAccountId: number | null,
  subAccountId: number | null
) => {
  const { data: response } = await axiosInstance.get(
    `${COMPANIES_ENDPOINTS.getCompany}${getSubAccountUrl(
      mainAccountId,
      subAccountId
    )}/selected-packages?pageNumber=1&pageSize=9999`
  );
  return response;
};

const getPackageStatus = (packageStatus: string) => {
  if (packageStatus === "" || packageStatus === "All") {
    return "";
  } else if (packageStatus === "Pending Payment") {
    return `&packageStatus=PENDING_PAYMENT`;
  } else {
    return `&packageStatus=${packageStatus.toUpperCase()}`;
  }
};

const getPackageName = (packageName: string) => {
  if (packageName !== "") {
    return `&packageName=${packageName}`;
  } else {
    return "";
  }
};

export const activateCompanyPackage = async (
  body: any,
  companyId: number,
  subAccountId: number | null
) => {
  const { data: response } = await axiosInstance.post(
    `${COMPANIES_ENDPOINTS.getCompany}/${companyId}${getSubAccountPackageUrl(
      subAccountId
    )}/${COMPANIES_ENDPOINTS.getPackages}`,
    body
  );
  return response;
};

export const getCompanySelectedPackagesWithPagination = async (
  packageName: string,
  packageStatus: string,
  pageNumber: number,
  pageSize: number,
  packageType: string,
  mainAccountId: number | null,
  subAccountId: number | null
) => {
  let alteredPageNumber = pageNumber;
  if (pageNumber === 0) {
    alteredPageNumber = 1;
  } else {
    ++alteredPageNumber;
  }

  const baseUrl = `${COMPANIES_ENDPOINTS.getCompany}${getSubAccountUrl(
    mainAccountId,
    subAccountId
  )}/selected-packages?pageNumber=${alteredPageNumber}&pageSize=${pageSize}&packageType=${packageType}`;

  const completeUrl =
    baseUrl + getPackageStatus(packageStatus) + getPackageName(packageName);

  const { data: response } = await axiosInstance.get(completeUrl);
  return response;
};

export const getCompanySelectedServicesPackagesWithPagination = async (
  packageName: string,
  packageStatus: string,
  pageNumber: number,
  pageSize: number,
  packageType: string,
  mainAccountId: number | null,
  subAccountId: number | null
) => {
  let alteredPageNumber = pageNumber;
  if (pageNumber === 0) {
    alteredPageNumber = 1;
  } else {
    ++alteredPageNumber;
  }

  const baseUrl = `${COMPANIES_ENDPOINTS.getCompany}${getSubAccountUrl(
    mainAccountId,
    subAccountId
  )}/selected-packages?pageNumber=${alteredPageNumber}&pageSize=${pageSize}&packageType=${packageType}`;

  const completeUrl =
    baseUrl + getPackageStatus(packageStatus) + getPackageName(packageName);

  const { data: response } = await axiosInstance.get(completeUrl);
  return response;
};

export const subscribeServicePostpaidPackage = async (companyId: number) => {
  const { data: response } = await axiosInstance.post(
    `${COMPANIES_ENDPOINTS.getCompany}/${companyId}/${COMPANIES_ENDPOINTS.getPostPaidPackage}`
  );
  return response;
};

export const subscribeCompanyService = async (
  companyId: number,
  serviceHeadId: number
) => {
  const { data: response } = await axiosInstance.post(
    `${COMPANIES_ENDPOINTS.getCompany}/${companyId}/service-heads/${serviceHeadId}/subscribe`
  );
  return response;
};
