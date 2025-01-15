import axiosInstance from "~/config/axiosInstance";

import { CUSTOM_HEADER_ENDPOINTS } from "~/rest/endpoints";

export const getAllCustomHeaders = async (companyId: number) => {
  const { data: response } = await axiosInstance.get(
    CUSTOM_HEADER_ENDPOINTS.customHeader +
      CUSTOM_HEADER_ENDPOINTS.company +
      companyId
  );
  return response;
};

export const addUpdateHeaders = async (list: any[]) => {
  const { data: response } = await axiosInstance.post(
    CUSTOM_HEADER_ENDPOINTS.customHeader,
    list
  );
  return response;
};
