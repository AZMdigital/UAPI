import { useMutation } from "@tanstack/react-query";

import {
  downloadInvoiceSlip,
  downloadTaxInvoice,
  generateInvoice,
  getInvoicesWithPagination,
  uploadSlip,
} from "~/rest/repositories/invoices";

export const useGetInvoices = () => {
  return useMutation<
    any,
    unknown,
    {
      packageName: string;
      invoiceStatus: string;
      invoiceType: string;
      pageNumber: number;
      pageSize: number;
      allowPagination: boolean;
    }
  >(
    ["InvoiceWithPagination"],
    ({
      packageName,
      invoiceStatus,
      invoiceType,
      pageNumber,
      pageSize,
      allowPagination,
    }) => {
      return getInvoicesWithPagination(
        packageName,
        invoiceStatus,
        invoiceType,
        pageNumber,
        pageSize,
        allowPagination
      );
    }
  );
};

export const useUploadSlip = () => {
  return useMutation<
    any,
    unknown,
    { invoiceId: number; accountId: number; attachmentData: any }
  >(["uploadInvoiceSlip"], ({ invoiceId, accountId, attachmentData }) => {
    const formData = new FormData();
    formData.append("invoiceSlip", attachmentData.attachmentFile);
    return uploadSlip(invoiceId, accountId, formData);
  });
};

export const useDownloadInvoiceSlip = () => {
  return useMutation<
    any,
    unknown,
    {
      accountId: number;
      invoiceId: number;
      slipId: string;
    }
  >(["downlaodInvoiceSlip"], ({ accountId, invoiceId, slipId }) => {
    return downloadInvoiceSlip(accountId, invoiceId, slipId);
  });
};

export const useDownloadTaxInvoice = () => {
  return useMutation<
    any,
    unknown,
    {
      accountId: number;
      invoiceId: number;
      slipId: string;
    }
  >(["downloadTaxInvoice"], ({ accountId, invoiceId, slipId }) => {
    return downloadTaxInvoice(accountId, invoiceId, slipId);
  });
};

export const useGenerateInvoice = () => {
  return useMutation<
    any,
    unknown,
    {
      invoiceId: number;
      invoiceTitle: string;
    }
  >(["generateInvoice"], ({ invoiceId, invoiceTitle }) => {
    return generateInvoice(invoiceId, invoiceTitle);
  });
};
