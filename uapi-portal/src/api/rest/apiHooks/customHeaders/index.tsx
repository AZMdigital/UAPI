import { useMutation } from "@tanstack/react-query";

import {
  addUpdateHeaders,
  getAllCustomHeaders,
} from "~/rest/repositories/customHeaders";

export const useGetCustomHeader = () => {
  return useMutation<any, unknown, { companyId: number }>(
    ["getAllCustomHeaders"],
    ({ companyId }) => {
      return getAllCustomHeaders(companyId);
    }
  );
};

export const useAddUpdateHeaders = () => {
  return useMutation<any, unknown, { list: any[] }>(
    ["useAddUpdateHeaders"],
    ({ list }) => {
      return addUpdateHeaders(list);
    }
  );
};
