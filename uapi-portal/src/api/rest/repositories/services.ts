import axiosInstance from "~/config/axiosInstance";

import { SERVICES_ENDPOINTS } from "~/rest/endpoints";

export const getAllServices = async () => {
  const { data: response } = await axiosInstance.get(
    SERVICES_ENDPOINTS.getServices
  );
  return response;
};

export const getServiceIcon = async (serviceHeadId: number) => {
  const { data: response } = await axiosInstance.get(
    `${SERVICES_ENDPOINTS.getServiceIcon}/${serviceHeadId}`
  );
  return response;
};

export const getAllLandingPageServices = async () => {
  const { data: response } = await axiosInstance.get(
    SERVICES_ENDPOINTS.landingPageServices
  );
  return response;
};

export const saveServiceCredentials = async (body: any, id: number) => {
  const { data: response } = await axiosInstance.post(
    `${SERVICES_ENDPOINTS.getServiceProvider}/${id}/${SERVICES_ENDPOINTS.getCredentials}`,
    body
  );
  return response;
};

export const updateUseMyCredentials = async (id: number, value: boolean) => {
  const { data: response } = await axiosInstance.put(
    `${SERVICES_ENDPOINTS.getServiceProvider}/${id}${SERVICES_ENDPOINTS.useMyCredentials}${value}`
  );
  return response;
};

export const getServiceProviderCredentials = async (
  id: number,
  companyId: number
) => {
  const { data: response } = await axiosInstance.get(
    `${SERVICES_ENDPOINTS.getServiceProvider}/${id}/${SERVICES_ENDPOINTS.getCredentials}`,
    {
      params: {
        companyId,
      },
    }
  );
  return response;
};

export const getServiceHeadCredentials = async (
  providerId: number,
  headId: number,
  companyId: number
) => {
  const { data: response } = await axiosInstance.get(
    `${SERVICES_ENDPOINTS.getServiceProvider}/${providerId}${SERVICES_ENDPOINTS.serviceHeads}/${headId}/${SERVICES_ENDPOINTS.getCredentials}`,
    {
      params: {
        companyId,
      },
    }
  );
  return response;
};
