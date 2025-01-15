import axiosInstance from "~/config/axiosInstance";

import { CALLBACKS_ENDPOINTS } from "~/rest/endpoints";

export const getAllServices = async () => {
  const { data: response } = await axiosInstance.get(
    CALLBACKS_ENDPOINTS.service
  );
  return response;
};

export const getAllCallbacks = async () => {
  const { data: response } = await axiosInstance.get(
    CALLBACKS_ENDPOINTS.callback + CALLBACKS_ENDPOINTS.account
  );
  return response;
};

export const deleteCallback = async (id: number) => {
  const { data: response } = await axiosInstance.delete(
    `${CALLBACKS_ENDPOINTS.callback + CALLBACKS_ENDPOINTS.account}/${id}`
  );
  return response;
};

export const saveCallback = async (body: any) => {
  const { data: response } = await axiosInstance.post(
    CALLBACKS_ENDPOINTS.callback + CALLBACKS_ENDPOINTS.account,
    body
  );
  return response;
};

export const updateCallback = async (body: any, id: number) => {
  const { data: response } = await axiosInstance.put(
    `${CALLBACKS_ENDPOINTS.callback + CALLBACKS_ENDPOINTS.account}/${id}`,
    body
  );
  return response;
};
