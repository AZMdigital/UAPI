import Dialog, { DialogProps } from "@mui/material/Dialog";
import { styled } from "@mui/material/styles";

import { handleSuccessMessage } from "~/utils/helper";

import FileUploading from "~/modules/invoiceManagement/components/FileUploading";
import {
  delay,
  InvoiceUploadModalProps,
} from "~/modules/invoiceManagement/utils/helper";
import { labels } from "~/modules/invoiceManagement/utils/labels";

const InvoiceUploadModal = ({
  handleAction,
  isOpen,
  modalHeading,
  selectedInvoice,
}: InvoiceUploadModalProps) => {
  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
      padding: theme.spacing(0),
    },
    "& .MuiDialogActions-root": {
      padding: theme.spacing(1),
    },
    "& .MuiDialog-paper": {
      borderRadius: "3px",
      innerWidth: 800,
    },
  }));

  const handleClose: DialogProps["onClose"] = (event, reason) => {
    if (reason && reason === "backdropClick") return;
    handleCancel();
  };

  const handleCancel = () => {
    handleAction(false);
  };

  const handleSuccessUpload = async () => {
    handleAction(false);
    await delay(1000);
    handleSuccessMessage(labels.fileUploaded, "");
  };

  return (
    <BootstrapDialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={isOpen}
    >
      <FileUploading
        accountId={selectedInvoice?.accountId}
        invoiceId={selectedInvoice?.id}
        handleCloseAction={handleSuccessUpload}
        handleCancelAction={handleCancel}
        modalHeading={modalHeading}
      />
    </BootstrapDialog>
  );
};

export default InvoiceUploadModal;
