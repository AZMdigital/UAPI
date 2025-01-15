import { useMutation, useQuery } from "@tanstack/react-query";

import {
  getAllModules,
  getAllUserNames,
  getAuditLogsWithPagination,
} from "~/rest/repositories/auditLogs";

import { getDayJsDate } from "~/modules/auditLogs/utils/helper";

export const useGetAllModules = () =>
  useQuery(["auditModules"], () => getAllModules());

export const useGetAllUserNames = () =>
  useQuery(["auditLogsUsernames"], () => getAllUserNames());

export const useGetAuditLogs = () => {
  return useMutation<
    any,
    unknown,
    {
      companyId: number;
      userId: string;
      moduleName: string;
      pageNumber: number;
      pageSize: number;
      fromDate: string;
      toDate: string;
      allowPagination: boolean;
    }
  >(
    ["AuditLogs"],
    ({
      companyId,
      userId,
      moduleName,
      pageNumber,
      pageSize,
      fromDate,
      toDate,
      allowPagination,
    }) => {
      return getAuditLogsWithPagination(
        companyId,
        userId,
        moduleName,
        pageNumber,
        pageSize,
        getDayJsDate(fromDate),
        getDayJsDate(toDate),
        allowPagination
      );
    }
  );
};
