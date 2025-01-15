import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

import { LogsDetailProps } from "~/modules/auditLogs/interfaces/auditLogs.interface";
import { auditActivityDetailColumns } from "~/modules/auditLogs/utils/helper";
import { labels } from "~/modules/auditLogs/utils/labels";

import TableComponent from "~/core/components/Table";

const AuditLogsDetail = ({
  isOpen,
  handleAction,
  selectedLogsData,
}: LogsDetailProps) => {
  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
      padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
      padding: theme.spacing(1),
    },
    "& .MuiDialog-paper": {
      borderRadius: "16px",
      innerWidth: 1000,
    },
    "& .MuiDialog-container": {
      "& .MuiPaper-root": {
        width: "100%",
        maxWidth: "900px",
      },
    },
  }));

  const handleClose: DialogProps["onClose"] = (event, reason) => {
    if (reason && reason === "backdropClick") return;
    handleCancel();
  };

  const handleCancel = () => {
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
        onClick={handleCancel}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>

      <Box width="100%" flexDirection="column" paddingX={5} paddingY={2}>
        <Box display="flex" justifyContent="center" paddingBottom={2}>
          <Typography paddingTop={2} variant="h1" color="primary.black">
            {labels.auditLogsDetail}
          </Typography>
        </Box>

        <Divider />
        <Grid container spacing={1} xs={12} paddingY={2}>
          <Grid item xs={6}>
            <Stack direction="column" spacing={1}>
              <Typography paddingTop={2} variant="h1" color="primary.black">
                {labels.accountName}
              </Typography>
              <Typography variant="h4" color="primary.blackishGray">
                {selectedLogsData?.updatedCompanyName}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={6}>
            <Grid item xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography paddingTop={2} variant="h1" color="primary.black">
                  {labels.userName}
                </Typography>
                <Typography variant="h4" color="primary.blackishGray">
                  {selectedLogsData?.updatedByUserName}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <Grid item xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography paddingTop={2} variant="h1" color="primary.black">
                  {labels.moduleName}
                </Typography>
                <Typography variant="h4" color="primary.blackishGray">
                  {selectedLogsData?.moduleName}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <Stack direction="column" spacing={1}>
              <Typography paddingTop={2} variant="h1" color="primary.black">
                {labels.activity}
              </Typography>
              <Typography variant="h4" color="primary.blackishGray">
                {selectedLogsData?.description}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={6}>
            <Grid item xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography paddingTop={2} variant="h1" color="primary.black">
                  {labels.activityDate}
                </Typography>
                <Typography variant="h4" color="primary.blackishGray">
                  {selectedLogsData?.date}
                </Typography>
              </Stack>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid item xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography paddingTop={2} variant="h1" color="primary.black">
                  {labels.oldValues}
                </Typography>
                <Grid item paddingTop={0.5}>
                  <TableComponent
                    columnHeaderHeight={48}
                    columns={auditActivityDetailColumns}
                    rows={selectedLogsData?.formValueArray}
                    loading={false}
                    deleting={false}
                    defaultPageSize={5}
                  />
                </Grid>
              </Stack>
            </Grid>
          </Grid>
        </Grid>
        <Box display="flex" justifyContent="center" paddingY={2}>
          <Button
            sx={{
              maxWidth: 50,
              color: "white",
              fontFamily: "Frutiger",
              backgroundColor: "primary.cyan",
              "&:hover": {
                backgroundColor: "primary.cyan",
              },
            }}
            onClick={handleCancel}
          >
            {labels.back}
          </Button>
        </Box>
      </Box>
    </BootstrapDialog>
  );
};

export default AuditLogsDetail;
