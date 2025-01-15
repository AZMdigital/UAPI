import axiosInstance from "~/config/axiosInstance";

import { INVOICES_ENDPOINTS } from "~/rest/endpoints";

const getPackageName = (packageName: string) => {
  if (packageName !== "") {
    return `&packageName=${packageName}`;
  } else {
    return "";
  }
};

const getInvoiceStatus = (invoiceStatus: string) => {
  if (invoiceStatus === "" || invoiceStatus === "All") {
    return "";
  } else {
    return `&invoiceStatus=${invoiceStatus.toUpperCase()}`;
  }
};

const getInvoiceType = (invoiceType: string) => {
  if (invoiceType === "" || invoiceType === "All") {
    return "";
  } else {
    return `&invoiceType=${invoiceType.toUpperCase()}`;
  }
};

const getPageNumber = (pageNumber: number) => {
  return `pageNumber=${pageNumber}`;
};

const getPageSize = (pageSize: number) => {
  return `&pageSize=${pageSize}`;
};
const getAllowPagination = (pagination: boolean) => {
  return `&applyPagination=${pagination}`;
};
export const getInvoicesWithPagination = async (
  packageName: string,
  invoiceStatus: string,
  invoiceType: string,
  pageNumber: number,
  pageSize: number,
  allowPagination: boolean
) => {
  let alteredPageNumber = pageNumber;
  if (pageNumber === 0) {
    alteredPageNumber = 1;
  } else {
    ++alteredPageNumber;
  }

  const finalUrl =
    INVOICES_ENDPOINTS.getInvoices +
    getPageNumber(alteredPageNumber) +
    getPageSize(pageSize) +
    getAllowPagination(allowPagination) +
    getPackageName(packageName) +
    getInvoiceStatus(invoiceStatus) +
    getInvoiceType(invoiceType);

  const { data: response } = await axiosInstance.get(finalUrl);
  return response;
};

export const uploadSlip = async (
  invoiceId: number,
  accountId: number,
  formData: FormData
) => {
  const finalUrl =
    INVOICES_ENDPOINTS.invoices +
    invoiceId +
    INVOICES_ENDPOINTS.account +
    accountId +
    INVOICES_ENDPOINTS.uplaodSlip;

  const { data: response } = await axiosInstance
    .post(finalUrl, formData, {
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => {
      return res;
    })
    .catch((error) => {
      // const customError = new Error(
      //   `failedRequestFile*/*${formData.get("description")}`
      // );
      throw error;
    });

  return response;
};

export const generateInvoice = async (
  invoiceId: number,
  invoiceTitle: string
) => {
  const finalUrl =
    INVOICES_ENDPOINTS.invoices + invoiceId + INVOICES_ENDPOINTS.generate;
  try {
    // Make the request to get the CSV file
    const { data: response } = await axiosInstance.get(finalUrl, {
      responseType: "blob", // Set response type to blob
    });

    // Create a new Blob from the response
    const blob = new Blob([response], { type: response.type });

    // Create a temporary link to trigger the download
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob); // Create an object URL for the Blob
    link.download = `UAPI_Invoice_${invoiceTitle}.pdf`; // Set the name of the downloaded file

    // Append the link to the body, trigger the click, then remove the link
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error downloading the CSV file:", error);
  }
};
export const downloadTaxInvoice = async (
  accountId: number,
  invoiceId: number,
  slipId: string
) => {
  const finalUrl =
    INVOICES_ENDPOINTS.invoices +
    invoiceId +
    INVOICES_ENDPOINTS.account +
    accountId +
    INVOICES_ENDPOINTS.tax +
    slipId;
  try {
    // Make the request to get the CSV file
    const { data: response } = await axiosInstance.get(finalUrl, {
      responseType: "blob", // Set response type to blob
    });

    // Create a new Blob from the response
    const blob = new Blob([response], { type: response.type });

    // Create a temporary link to trigger the download
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob); // Create an object URL for the Blob
    link.download = slipId; // Set the name of the downloaded file

    // Append the link to the body, trigger the click, then remove the link
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error downloading the CSV file:", error);
  }
};
export const downloadInvoiceSlip = async (
  accountId: number,
  invoiceId: number,
  slipId: string
) => {
  const finalUrl =
    INVOICES_ENDPOINTS.invoices +
    invoiceId +
    INVOICES_ENDPOINTS.account +
    accountId +
    INVOICES_ENDPOINTS.slip +
    slipId;
  try {
    // Make the request to get the CSV file
    const { data: response } = await axiosInstance.get(finalUrl, {
      responseType: "blob", // Set response type to blob
    });

    // Create a new Blob from the response
    const blob = new Blob([response], { type: response.type });

    // Create a temporary link to trigger the download
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob); // Create an object URL for the Blob
    link.download = slipId; // Set the name of the downloaded file

    // Append the link to the body, trigger the click, then remove the link
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error downloading the CSV file:", error);
  }
};
