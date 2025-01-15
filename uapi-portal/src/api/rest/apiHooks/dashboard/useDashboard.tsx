import { useQuery } from "@tanstack/react-query";

import {
  getInvoicesByStatus,
  getServicesCountByUser,
  getTopConsumedServices,
} from "~/rest/repositories/dashboard";

export const useGetServicesCountByUser = () =>
  useQuery(["getServicesCountByUser"], () => getServicesCountByUser(), {
    cacheTime: 0,
  });

export const useGetTopConsumedServices = () =>
  useQuery(["getTopConsumedServices"], () => getTopConsumedServices(), {
    cacheTime: 0,
  });

export const useGetInvoicesByStatus = () =>
  useQuery(["getInvoicesByStatus"], () => getInvoicesByStatus(), {
    cacheTime: 0,
  });
