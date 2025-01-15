import { ActionCriteria } from "~/core/components/interface";

export function formatCurrency(value: any) {
  // Ensure the input is treated as a string
  let [integerPart, decimalPart] = value.toString().split(".");

  // Add a comma if the integer part has more than 3 digits
  if (integerPart.length > 3) {
    integerPart = `${integerPart.slice(0, -3)},${integerPart.slice(-3)}`;
  }

  // Ensure we always have a decimal part (default to `.0` if missing)
  decimalPart = decimalPart ? decimalPart : "0";

  return `${integerPart}.${decimalPart} SAR`;
}

export interface InvoiceUploadModalProps {
  selectedInvoice: any;
  modalHeading: string;
  isOpen: boolean;
  handleAction: (state: boolean) => void;
}

export enum FileStatus {
  ISUPLOADING = "isUploading",
  ISFAILEDUPLOADING = "isFailedUploading",
  ISUPLOADED = "isUploaded",
  ISSELECTED = "isSelected",
}

export interface CompanyAttachmentProps {
  attachmentFile: File;
}

export interface FileUploadingProps {
  accountId: number;
  invoiceId: number;
  modalHeading: string;
  handleCloseAction: (state: boolean) => void;
  handleCancelAction: (state: boolean) => void;
}

export interface FileAttachment {
  preview: string;
  id: number;
  name: string;
  file: File;
  fileStatus: FileStatus;
}

export const invoiceStatus = [
  {
    label: "All",
    value: "",
  },
  {
    label: "New",
    value: "NEW",
  },
  {
    label: "Pending",
    value: "PENDING",
  },
  {
    label: "Issued",
    value: "ISSUED",
  },
  {
    label: "Paid",
    value: "PAID",
  },
  {
    label: "Failed",
    value: "FAILED",
  },
];

export const invoiceType = [
  {
    label: "All",
    value: "",
  },
  {
    label: "Prepaid",
    value: "PREPAID",
    disabled: false,
  },
  {
    label: "Postpaid",
    value: "POSTPAID",
    disabled: false,
  },
];
export const uploadSlipStatusCriteria: ActionCriteria = {
  key: "slipStatus",
  value: null,
};

// eslint-disable-next-line id-length
export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
