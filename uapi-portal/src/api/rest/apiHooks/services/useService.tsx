import { useMutation, useQuery } from "@tanstack/react-query";

import { ServiceCredentials, ServiceIconRequest } from "~/rest/models/service";
import {
  getAllLandingPageServices,
  getAllServices,
  getServiceHeadCredentials,
  getServiceIcon,
  getServiceProviderCredentials,
  saveServiceCredentials,
  updateUseMyCredentials,
} from "~/rest/repositories/services";

export const useGetServices = () =>
  useQuery(["services"], () => getAllServices(), {
    refetchOnWindowFocus: false,
    retry: false,
    cacheTime: 0,
  });

export const useGetServiceIcon = () => {
  return useMutation(async ({ serviceHeadId }: ServiceIconRequest) => {
    return getServiceIcon(serviceHeadId);
  });
};

export const useGetLandingPageServices = () =>
  useQuery(["landingPageServices"], () => getAllLandingPageServices(), {
    refetchOnWindowFocus: false,
    retry: false,
  });

export const useSaveServiceCredentials = () => {
  return useMutation<any, unknown, { credentials: ServiceCredentials }>(
    ["saveServiceCredentails"],
    ({ credentials }) => {
      const { id, ...remainingData } = credentials;
      return saveServiceCredentials(remainingData, id!);
    }
  );
};

export const useUpdateUseMyCredentials = () => {
  return useMutation<any, unknown, { id: number; value: boolean }>(
    ["updateUseMyCredentails"],
    ({ id, value }) => {
      return updateUseMyCredentials(id, value);
    }
  );
};

export const useGetServiceProviderCredentials = () => {
  return useMutation<any, unknown, { id: number; companyId: number }>(
    ["GetServiceProviderCredentials"],
    ({ id, companyId }) => {
      return getServiceProviderCredentials(id, companyId);
    }
  );
};

export const useGetServiceHeadCredentials = () => {
  return useMutation<
    any,
    unknown,
    { providerId: number; headId: number; companyId: number }
  >(["GetServiceHeadCredentials"], ({ providerId, headId, companyId }) => {
    return getServiceHeadCredentials(providerId, headId, companyId);
  });
};
