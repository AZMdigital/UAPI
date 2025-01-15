import axiosInstance from "~/config/axiosInstance";

import { DASHBOARD_ENDPOINTS } from "~/rest/endpoints";

export const getServicesCountByUser = async () => {
  const { data: response } = await axiosInstance.get(
    DASHBOARD_ENDPOINTS.dashboard +
      DASHBOARD_ENDPOINTS.devPortal +
      DASHBOARD_ENDPOINTS.serviceCountByUser
  );
  return response;
};

export const getTopConsumedServices = async () => {
  const { data: response } = await axiosInstance.get(
    DASHBOARD_ENDPOINTS.dashboard +
      DASHBOARD_ENDPOINTS.devPortal +
      DASHBOARD_ENDPOINTS.topConsumedServices
  );
  return response;
};

export const getInvoicesByStatus = async () => {
  const { data: response } = await axiosInstance.get(
    DASHBOARD_ENDPOINTS.dashboard +
      DASHBOARD_ENDPOINTS.devPortal +
      DASHBOARD_ENDPOINTS.invoiceByStatus
  );
  return response;
};
