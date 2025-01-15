import { useMutation } from "@tanstack/react-query";

import { getCallbackLogsWithPagination } from "~/rest/repositories/callbackLogs";

import { getDayJsDate } from "~/modules/callbackLogs/utils/helper";

export const useGetCallbackLogs = () => {
  return useMutation<
    any,
    unknown,
    {
      companyId: number;
      serviceId: number;
      pageNumber: number;
      pageSize: number;
      fromDate: string;
      toDate: string;
      allowPagination: boolean;
      fetchAll?: boolean;
    }
  >(
    ["CallbackLogs"],
    ({
      companyId,
      serviceId,
      pageNumber,
      pageSize,
      fromDate,
      toDate,
      allowPagination,
      fetchAll = false,
    }) => {
      return getCallbackLogsWithPagination(
        companyId,
        pageNumber,
        serviceId,
        pageSize,
        getDayJsDate(fromDate),
        getDayJsDate(toDate),
        allowPagination,
        fetchAll
      );
    }
  );
};
