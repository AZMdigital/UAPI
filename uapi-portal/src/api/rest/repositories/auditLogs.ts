import axiosInstance from "~/config/axiosInstance";

import { AUDITLOGS_ENDPOINTS } from "~/rest/endpoints";

export const getAllModules = async () => {
  const { data: response } = await axiosInstance.get(
    AUDITLOGS_ENDPOINTS.auditLogs + AUDITLOGS_ENDPOINTS.getModules
  );
  return response;
};

export const getAllUserNames = async () => {
  const { data: response } = await axiosInstance.get(
    AUDITLOGS_ENDPOINTS.auditLogs + AUDITLOGS_ENDPOINTS.getUserNames
  );
  return response;
};

const getModuleName = (moduleName: string) => {
  if (moduleName !== "") {
    return `&moduleName=${moduleName}`;
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

const getUserId = (userId: string) => {
  if (userId !== "All") {
    return `&updatedByUsername=${userId}`;
  } else {
    return "";
  }
};

export const getAuditLogsWithPagination = async (
  companyId: number,
  userId: string,
  moduleName: string,
  pageNumber: number,
  pageSize: number,
  fromDate: string,
  toDate: string,
  allowPagination: boolean
) => {
  let alteredPageNumber = pageNumber;
  if (pageNumber === 0) {
    alteredPageNumber = 1;
  } else {
    ++alteredPageNumber;
  }

  const finalUrl = `${AUDITLOGS_ENDPOINTS.auditLogs}?${getPageNumber(
    alteredPageNumber
  )}${getPageSize(pageSize)}${getFromToDate(fromDate, toDate)}${getModuleName(
    moduleName
  )}${getCompanyId(companyId)}${getUserId(userId)}${getAllowPagination(
    allowPagination
  )}`;
  const { data: response } = await axiosInstance.get(finalUrl);
  return response;
};
