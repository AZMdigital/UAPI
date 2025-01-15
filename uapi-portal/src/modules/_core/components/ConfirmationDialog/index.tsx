import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Image from "next/image";

import { ConfirmationDialogProps } from "~/modules/_core/components/interface";

import confirmationIcon from "~/public/assets/ConfirmationIcon.svg";

import { labels } from "~/core/utils/labels";

const ConfirmationDailog = ({
  isOpen,
  label,
  secondarylabel,
  handleAction,
  showLoading,
}: ConfirmationDialogProps) => {
  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
      padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
      padding: theme.spacing(1),
    },
    "& .MuiDialog-paper": {
      borderRadius: "3px",
    },
  }));

  const HandlePositiveAction = () => {
    handleAction(true);
  };

  const handleClose = () => {
    handleAction(false);
  };

  return (
    <BootstrapDialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={isOpen}
    >
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>

      <Stack direction="column" padding={5}>
        <Box width="100%" display="flex" justifyContent="center" paddingTop={3}>
          <Image src={confirmationIcon} alt="" height={62} width={62} />
        </Box>

        <Typography paddingTop={2} variant="h3" color="primary.blackishGray">
          {label}
        </Typography>

        {secondarylabel && (
          <Typography paddingTop={2} variant="h3" color="primary.blackishGray">
            {secondarylabel}
          </Typography>
        )}

        {showLoading && (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            paddingTop={2}
          >
            <CircularProgress size={20} />
          </Box>
        )}

        <Stack
          direction="row"
          spacing={2}
          width="100%"
          justifyContent="center"
          paddingTop={3}
        >
          <Button
            sx={{
              color: "primary.typoWhite",
              backgroundColor: "primary.green",
              "&:hover": {
                backgroundColor: "primary.green",
              },
            }}
            onClick={HandlePositiveAction}
          >
            {labels.yes}
          </Button>
          <Button
            sx={{
              color: "black",
              border: "1px solid",
              borderColor: "primary.textLightGray",
              backgroundColor: "primary.white",
              "&:hover": {
                backgroundColor: "primary.white",
              },
            }}
            onClick={handleClose}
          >
            {labels.no}
          </Button>
        </Stack>
      </Stack>
    </BootstrapDialog>
  );
};

export default ConfirmationDailog;
