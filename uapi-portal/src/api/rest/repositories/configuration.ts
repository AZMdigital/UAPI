import axiosInstance from "~/config/axiosInstance";

import { CONFIGURATION_ENDPOINTS } from "~/rest/endpoints";

export const getConfigurations = async () => {
  const { data: response } = await axiosInstance.get(
    CONFIGURATION_ENDPOINTS.getConfiguration
  );
  return response;
};

export const getCompanyConfigurations = async (id: number, name: string) => {
  const { data: response } = await axiosInstance.get(
    `${CONFIGURATION_ENDPOINTS.getCompanyConfiguration}/${id}?name=${name}`
  );
  return response;
};

export const getCompanyPublicKey = async (id: number) => {
  const { data: response } = await axiosInstance.get(
    `${CONFIGURATION_ENDPOINTS.getPublicKey}/${id}`
  );
  return response;
};

export const saveCompanyConfigurations = async (body: any) => {
  const { data: response } = await axiosInstance.post(
    `${CONFIGURATION_ENDPOINTS.getCompanyConfiguration}`,
    body
  );
  return response;
};

export const deleteCertificate = async (id: number) => {
  const { data: response } = await axiosInstance.delete(
    `${CONFIGURATION_ENDPOINTS.getPublicKey}/${id}`
  );
  return response;
};

export const uploadPemFile = async (formData: FormData) => {
  const { data: response } = await axiosInstance.post(
    CONFIGURATION_ENDPOINTS.getPublicKey,
    formData,
    {
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response;
};

export const getClientCertificate = async (id: number) => {
  const { data: response } = await axiosInstance.get(
    `${CONFIGURATION_ENDPOINTS.getClientCertificate}/${id}`
  );
  return response;
};

export const deleteClientCertificate = async (id: number) => {
  const { data: response } = await axiosInstance.delete(
    `${CONFIGURATION_ENDPOINTS.getClientCertificate}/${id}`
  );
  return response;
};

export const uploadClientCertificate = async (formData: FormData) => {
  const { data: response } = await axiosInstance.post(
    CONFIGURATION_ENDPOINTS.getClientCertificate,
    formData,
    {
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response;
};
