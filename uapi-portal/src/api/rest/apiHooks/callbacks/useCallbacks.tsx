import { useMutation, useQuery } from "@tanstack/react-query";

import {
  deleteCallback,
  getAllCallbacks,
  saveCallback,
  updateCallback,
} from "~/rest/repositories/callbacks";

export const useGetCallbacks = () =>
  useQuery(["getAllCallbacks"], () => getAllCallbacks(), {
    refetchOnWindowFocus: false,
  });

export const useDeleteCallback = () => {
  return useMutation<any, unknown, { id: number }>(
    ["deleteCallback"],
    ({ id }) => {
      return deleteCallback(id);
    }
  );
};

export const useSaveCallback = () => {
  return useMutation<any, unknown, { data: any }>(
    ["saveCallback"],
    ({ data }) => {
      return saveCallback(data);
    }
  );
};

export const useUpdateCallback = () => {
  return useMutation<any, unknown, { data: any; id: any }>(
    ["updateCallback"],
    ({ data, id }) => {
      const { ...remainingData } = data;
      return updateCallback(remainingData, id!);
    }
  );
};
