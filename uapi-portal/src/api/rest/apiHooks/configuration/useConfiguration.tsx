import { useMutation, useQuery } from "@tanstack/react-query";

import {
  deleteCertificate,
  deleteClientCertificate,
  getClientCertificate,
  getCompanyConfigurations,
  getCompanyPublicKey,
  getConfigurations,
  saveCompanyConfigurations,
  uploadClientCertificate,
  uploadPemFile,
} from "~/rest/repositories/configuration";

import {
  CompanyConfiguration,
  UploadPemProps,
} from "~/modules/profile/interface/profile";

export const useGetConfiguration = () =>
  useQuery(["Configurations"], () => getConfigurations(), {
    retry: false,
    refetchOnWindowFocus: false,
    cacheTime: 0,
  });

export const useGetCompanyConfiguration = (
  id: number,
  name: string,
  options?: {
    enabled: boolean;
  }
) =>
  useQuery(
    ["getCompanyConfigurations", id, name],
    () => getCompanyConfigurations(id, name),
    {
      enabled: options?.enabled,
      refetchOnWindowFocus: false,
      retry: false,
      cacheTime: 0,
    }
  );

export const useGetPublicKey = (
  id: number,
  options?: {
    enabled: boolean;
  }
) =>
  useQuery(["getCompanyPublicKey", id], () => getCompanyPublicKey(id), {
    enabled: options?.enabled,
    refetchOnWindowFocus: false,
    retry: false,
  });

export const useDeleteCertificate = () => {
  return useMutation<any, unknown, { id: number }>(
    ["deleteCertificate"],
    ({ id }) => {
      return deleteCertificate(id);
    }
  );
};

export const useSaveCompanyConfiguration = () => {
  return useMutation<any, unknown, { configuration: CompanyConfiguration }>(
    ["saveCompanyConfiguration"],
    ({ configuration }) => {
      return saveCompanyConfigurations(configuration);
    }
  );
};

export const useUploadPemFile = () => {
  return useMutation<any, unknown, { pemData: UploadPemProps }>(
    ["uploadPemFile"],
    ({ pemData }) => {
      const formData = new FormData();
      formData.append("file", pemData.pemFile);
      return uploadPemFile(formData);
    }
  );
};

export const useGetClientCertificate = (
  id: number,
  options?: {
    enabled: boolean;
  }
) =>
  useQuery(["getClientCertificate", id], () => getClientCertificate(id), {
    enabled: options?.enabled,
    refetchOnWindowFocus: false,
    retry: false,
  });

export const useDeleteClientCertificate = () => {
  return useMutation<any, unknown, { id: number }>(
    ["deleteClientCertificate"],
    ({ id }) => {
      return deleteClientCertificate(id);
    }
  );
};

export const useUploadCertificateFile = () => {
  return useMutation<any, unknown, { certificateData: UploadPemProps }>(
    ["uploadClientCertificate"],
    ({ certificateData }) => {
      const formData = new FormData();
      formData.append("file", certificateData.pemFile);
      return uploadClientCertificate(formData);
    }
  );
};
