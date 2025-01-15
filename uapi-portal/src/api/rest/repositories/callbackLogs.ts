import axiosInstance from "~/config/axiosInstance";

import { CALLBACKLOGS_ENDPOINTS } from "~/rest/endpoints";

const getServiceId = (serviceId: number) => {
  if (serviceId !== 0) {
    return `&serviceId=${serviceId}`;
  } else {
    return "";
  }
};

const getCompanyId = (companyId: number) => {
  if (companyId !== 0) {
    return `&companyId=${companyId}`;
  } else {
    return "";
  }
};

const getPageNumber = (pageNumber: number) => {
  return `pageNumber=${pageNumber}`;
};

const getPageSize = (pageSize: number) => {
  return `&pageSize=${pageSize}`;
};

const getFromToDate = (fromDate: string, toDate: string) => {
  if (fromDate !== "" && toDate !== "") {
    return `&fromDate=${fromDate}&toDate=${toDate}`;
  } else {
    return "";
  }
};

const getAllowPagination = (pagination: boolean) => {
  return `&applyPagination=${pagination}`;
};

export const getCallbackLogsWithPagination = async (
  companyId: number,
  pageNumber: number,
  serviceId: number,
  pageSize: number,
  fromDate: string,
  toDate: string,
  allowPagination: boolean,
  fetchAll = false
) => {
  if (fetchAll) {
    const { data: response } = await axiosInstance.get(
      CALLBACKLOGS_ENDPOINTS.callbackLogs
    );
    return response;
  }
  const alteredPageNumber = pageNumber === 0 ? 1 : pageNumber + 1;

  const finalUrl = `${CALLBACKLOGS_ENDPOINTS.callbackLogs}?${getPageNumber(
    alteredPageNumber
  )}${getPageSize(pageSize)}${getFromToDate(fromDate, toDate)}${getCompanyId(
    companyId
  )}${getServiceId(serviceId)}${getAllowPagination(allowPagination)}`;

  const { data: response } = await axiosInstance.get(finalUrl);
  return response;
};
