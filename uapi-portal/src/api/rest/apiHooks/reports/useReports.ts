import { useMutation, useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";

import {
  getConsumptionDetail,
  getConsumptionDetailOwnCredentails,
  getIntegrationLogs,
} from "~/rest/repositories/reports";

import { getDayJsDate } from "~/modules/reports/utils/helper";

export const useConsumptionDetail = (
  month: string,
  year: string,
  isMainAccount: boolean,
  options?: {
    enabled: boolean;
  }
) => {
  return useQuery(
    ["getConsumptionDetail", month, year, isMainAccount, options],
    () => {
      const formattedMonth = dayjs(month).format?.("MM");
      const formattedYear = dayjs(year).format?.("YYYY");
      if (
        formattedMonth !== "Invalid Date" &&
        formattedYear === "Invalid Date"
      ) {
        // We have to avoid doing API call in case if month is valid and year in invalid.
        return false;
      } else {
        return getConsumptionDetail(
          formattedMonth,
          formattedYear,
          isMainAccount
        );
      }
    },
    { enabled: options?.enabled, retry: false }
  );
};

export const useConsumptionDetailOwnCredentails = (
  month: string,
  year: string,
  options?: {
    enabled: boolean;
  }
) => {
  return useQuery(
    ["getConsumptionDetail", month, year, options],
    () => {
      const formattedMonth = dayjs(month).format?.("MM");
      const formattedYear = dayjs(year).format?.("YYYY");
      if (
        formattedMonth !== "Invalid Date" &&
        formattedYear === "Invalid Date"
      ) {
        // We have to avoid doing API call in case if month is valid and year in invalid.
        return false;
      } else {
        return getConsumptionDetailOwnCredentails(
          formattedMonth,
          formattedYear
        );
      }
    },
    { enabled: options?.enabled, retry: false }
  );
};

export const useGetIntegrationLogs = () => {
  return useMutation<
    any,
    unknown,
    {
      fromDate: string;
      toDate: string;
      callStatus: string;
      serviceName: string;
      companyId: number;
      pageNumber: number;
      pageSize: number;
    }
  >(
    ["IntegrationLogs"],
    ({
      fromDate,
      toDate,
      callStatus,
      serviceName,
      companyId,
      pageNumber,
      pageSize,
    }) => {
      return getIntegrationLogs(
        getDayJsDate(fromDate),
        getDayJsDate(toDate),
        callStatus,
        serviceName,
        companyId,
        pageNumber,
        pageSize
      );
    }
  );
};
