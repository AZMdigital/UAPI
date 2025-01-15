import { useMutation, useQuery } from "@tanstack/react-query";

import {
  activateCompanyPackage,
  createSubAccount,
  deleteCompanySubAccount,
  getCompanyAnnualPackages,
  getCompanyApiKey,
  getCompanySelectedPackages,
  getCompanySelectedPackagesWithPagination,
  getCompanySelectedServicesPackagesWithPagination,
  getCompanyServices,
  getCompanyServicesPackages,
  getSearchCompanySubAccounts,
  getSubAccountToken,
  saveCompanyApiKey,
  subscribeCompanyService,
  subscribeServicePostpaidPackage,
  updateSubAccount,
} from "~/rest/repositories/companies";

import { ActivePackage } from "~/modules/packageManagement/interfaces/packages.interface";

export const useGetCompanyApiKey = () =>
  useQuery(["CompanyApiKey"], () => getCompanyApiKey(), {
    retry: false,
    cacheTime: 0,
  });

export const useGetCompanyServices = () => {
  return useMutation<any, unknown, { companyId: number }>(
    ["CompanyServices"],
    ({ companyId }) => {
      return getCompanyServices(companyId);
    }
  );
};

export const useGetCompanySubAccounts = () => {
  return useMutation<any, unknown, { companyId: number; query: string }>(
    ["CompanySubAccounts"],
    ({ companyId, query }) => {
      return getSearchCompanySubAccounts(companyId, query);
    }
  );
};

export const useDeleteCompanySubAccount = () => {
  return useMutation<any, unknown, { companyId: number; subAccountId: number }>(
    ["deleteSubAccount"],
    ({ companyId, subAccountId }) => {
      return deleteCompanySubAccount(companyId, subAccountId);
    }
  );
};

export const useSaveCompanyApiKey = (options?: { enabled: boolean }) =>
  useQuery(["SaveCompanyApiKey"], () => saveCompanyApiKey(), {
    enabled: options?.enabled,
  });

export const useGetCompanyAnnualPackages = () => {
  return useMutation<
    any,
    unknown,
    { companyId: number; subAccountId: number | null }
  >(["CompanyAnnualPackages"], ({ companyId, subAccountId }) => {
    return getCompanyAnnualPackages(companyId, subAccountId);
  });
};

export const useGetCompanyServicesPackages = () => {
  return useMutation<
    any,
    unknown,
    { companyId: number; subAccountId: number | null }
  >(["CompanyServicesPackages"], ({ companyId, subAccountId }) => {
    return getCompanyServicesPackages(companyId, subAccountId);
  });
};

export const useGetCompanySelectedPackages = () => {
  return useMutation<
    any,
    unknown,
    { mainAccountId: number | null; subAccountId: number | null }
  >(["CompanySelectedPackages"], ({ mainAccountId, subAccountId }) => {
    return getCompanySelectedPackages(mainAccountId, subAccountId);
  });
};

export const useActivateCompanyPackage = () => {
  return useMutation<
    any,
    unknown,
    {
      packageData: ActivePackage;
      companyId: number;
      subAccountId: number | null;
    }
  >(["activateCompanyPackage"], ({ packageData, companyId, subAccountId }) => {
    return activateCompanyPackage(packageData, companyId, subAccountId);
  });
};

export const useCreateSubAccount = () => {
  return useMutation<any, unknown, { accountData: any; companyId: number }>(
    ["createSubAccount"],
    ({ accountData, companyId }) => {
      return createSubAccount(accountData, companyId);
    }
  );
};

export const useGetSubAccountToken = () => {
  return useMutation<any, unknown, { data: any }>(
    ["getSubAccountToken"],
    ({ data }) => {
      return getSubAccountToken(data);
    }
  );
};

export const useUpdateSubAccount = () => {
  return useMutation<
    any,
    unknown,
    { accountData: any; companyId: number; subAccountId: number }
  >(["updateSubAccount"], ({ accountData, companyId, subAccountId }) => {
    return updateSubAccount(accountData, companyId, subAccountId);
  });
};

export const useGetCompanySelectedPackagesWithPagination = () => {
  return useMutation<
    any,
    unknown,
    {
      packageName: string;
      packageStatus: string;
      pageNumber: number;
      pageSize: number;
      packageType: string;
      mainAccountId: number | null;
      subAccountId: number | null;
    }
  >(
    ["CompanySelectedPackagesWithPagination"],
    ({
      packageName,
      packageStatus,
      pageNumber,
      pageSize,
      packageType,
      mainAccountId,
      subAccountId,
    }) => {
      return getCompanySelectedPackagesWithPagination(
        packageName,
        packageStatus,
        pageNumber,
        pageSize,
        packageType,
        mainAccountId,
        subAccountId
      );
    }
  );
};

export const useGetServicesCompanySelectedPackagesWithPagination = () => {
  return useMutation<
    any,
    unknown,
    {
      packageName: string;
      packageStatus: string;
      pageNumber: number;
      pageSize: number;
      packageType: string;
      mainAccountId: number | null;
      subAccountId: number | null;
    }
  >(
    ["CompanySelectedPackagesWithPagination"],
    ({
      packageName,
      packageStatus,
      pageNumber,
      pageSize,
      packageType,
      mainAccountId,
      subAccountId,
    }) => {
      return getCompanySelectedServicesPackagesWithPagination(
        packageName,
        packageStatus,
        pageNumber,
        pageSize,
        packageType,
        mainAccountId,
        subAccountId
      );
    }
  );
};

export const useSubscribeServicePostpaidPackage = () => {
  return useMutation<any, unknown, { companyId: number }>(
    ["subscribeServicePostpaidPackage"],
    ({ companyId }) => {
      return subscribeServicePostpaidPackage(companyId);
    }
  );
};

export const useSubscribeCompanyService = () => {
  return useMutation<
    any,
    unknown,
    { companyId: number; serviceHeadId: number }
  >(["CompanyServiceSubscribe"], ({ companyId, serviceHeadId }) => {
    return subscribeCompanyService(companyId, serviceHeadId);
  });
};
