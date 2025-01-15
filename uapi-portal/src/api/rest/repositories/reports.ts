import axiosInstance from "~/config/axiosInstance";

import { REPORTS_ENDPOINTS } from "~/rest/endpoints";

import { INVALID_DATE } from "~/modules/_core/utils/helper";

const getConsumptionDetailUrl = (isMainAccount: boolean) => {
  if (isMainAccount) {
    return REPORTS_ENDPOINTS.consumptionDetail;
  } else {
    return REPORTS_ENDPOINTS.subAccountConsumptionDetail;
  }
};

export const getConsumptionDetail = async (
  month: string,
  year: string,
  isMainAccount: boolean
) => {
  let finalUrl = "";
  if (month === INVALID_DATE && year === INVALID_DATE) {
    finalUrl = getConsumptionDetailUrl(isMainAccount);
  } else if (month === INVALID_DATE && year !== INVALID_DATE) {
    finalUrl = `${getConsumptionDetailUrl(isMainAccount)}?&year=${year}`;
  } else if (month !== INVALID_DATE && year === INVALID_DATE) {
    finalUrl = `${getConsumptionDetailUrl(isMainAccount)}?month=${month}`;
  } else {
    finalUrl = `${getConsumptionDetailUrl(
      isMainAccount
    )}?month=${month}&year=${year}`;
  }
  const { data: response } = await axiosInstance.get(finalUrl);
  return response;
};

export const getConsumptionDetailOwnCredentails = async (
  month: string,
  year: string
) => {
  let finalUrl = "";
  if (month === INVALID_DATE && year === INVALID_DATE) {
    finalUrl = REPORTS_ENDPOINTS.consumption + REPORTS_ENDPOINTS.ownCredentails;
  } else if (month === INVALID_DATE && year !== INVALID_DATE) {
    finalUrl = `${
      REPORTS_ENDPOINTS.consumption + REPORTS_ENDPOINTS.ownCredentails
    }?&year=${year}`;
  } else if (month !== INVALID_DATE && year === INVALID_DATE) {
    finalUrl = `${
      REPORTS_ENDPOINTS.consumption + REPORTS_ENDPOINTS.ownCredentails
    }?month=${month}`;
  } else {
    finalUrl = `${
      REPORTS_ENDPOINTS.consumption + REPORTS_ENDPOINTS.ownCredentails
    }?month=${month}&year=${year}`;
  }
  const { data: response } = await axiosInstance.get(finalUrl);
  return response;
};

const getPageNumber = (pageNumber: number) => {
  return `pageNumber=${pageNumber}`;
};

const getPageSize = (pageSize: number) => {
  return `&pageSize=${pageSize}`;
};

const getServiceName = (serviceName: string) => {
  if (serviceName !== "" && serviceName !== "None") {
    return `&serviceName=${serviceName}`;
  } else {
    return "";
  }
};

const getStatus = (status: string) => {
  if (status !== "") {
    return `&status=${status.toUpperCase()}`;
  } else {
    return "";
  }
};

const getFromToDate = (fromDate: string, toDate: string) => {
  if (fromDate !== "" && toDate !== "") {
    return `&fromDate=${fromDate}&toDate=${toDate}`;
  } else {
    return "";
  }
};

export const getIntegrationLogs = async (
  fromDate: string,
  toDate: string,
  status: string,
  serviceName: string,
  companyId: number,
  pageNumber: number,
  pageSize: number
) => {
  let alteredPageNumber = pageNumber;
  if (pageNumber === 0) {
    alteredPageNumber = 1;
  } else {
    ++alteredPageNumber;
  }

  const finalUrl = `${
    REPORTS_ENDPOINTS.integrationLogs + companyId
  }?${getPageNumber(alteredPageNumber)}${getPageSize(pageSize)}${getServiceName(
    serviceName
  )}${getStatus(status)}${getFromToDate(fromDate, toDate)}`;

  const { data: response } = await axiosInstance.get(finalUrl);
  return response;
};
