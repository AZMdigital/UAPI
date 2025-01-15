import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

import CallbackForm from "~/modules/profile/components/Callbacks/components/CallbackForm";
import { CallbackModalProps } from "~/modules/profile/interface/profile";
import { labels } from "~/modules/profile/utils/labels";

const CallbackModal = ({
  isEditMode,
  servicesList,
  selectedCallback,
  isOpen,
  isSaveBtnEnabled,
  handleCancel,
}: CallbackModalProps) => {
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
  };

  const handleCloseAction = () => {
    handleCancel(false);
  };

  return (
    <BootstrapDialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={isOpen}
    >
      <IconButton
        aria-label="close"
        onClick={handleCloseAction}
        sx={{
          position: "absolute",
          right: 5,
          top: 6,
        }}
      >
        <CloseIcon fontSize="small" sx={{ color: "white" }} />
      </IconButton>

      <Box width={500} flexDirection="column">
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="left"
          padding={2}
          sx={{ backgroundColor: "primary.cyan" }}
        >
          <Typography variant="h2" color="white">
            {isEditMode ? labels.editCallack : labels.addCallback}
          </Typography>
        </Box>

        <CallbackForm
          isEditMode={isEditMode}
          isSaveBtnEnabled={isSaveBtnEnabled}
          servicesList={servicesList}
          selectedCallback={selectedCallback}
          handleCancel={handleCloseAction}
        />
      </Box>
    </BootstrapDialog>
  );
};

export default CallbackModal;
