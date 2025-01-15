import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

import { getFormattedDateTime } from "~/modules/reports/utils/helper";
import { LogsDetailProps } from "~/modules/reports/utils/interfaces/reports.interface";
import { labels } from "~/modules/reports/utils/labels";

const LogsDetail = ({
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
            {labels.logsDetail}
          </Typography>
        </Box>

        <Divider />
        <Grid container spacing={1} xs={12} paddingY={4}>
          <Grid item xs={6}>
            <Stack direction="column" spacing={1}>
              <Typography paddingTop={2} variant="h1" color="primary.black">
                {labels.serviceName}
              </Typography>
              <Typography variant="h4" color="primary.blackishGray">
                {selectedLogsData?.service}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={6}>
            <Grid item xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography paddingTop={2} variant="h1" color="primary.black">
                  {labels.transactionDate}
                </Typography>
                <Typography variant="h4" color="primary.blackishGray">
                  {selectedLogsData?.transactionDate}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <Stack direction="column" spacing={1}>
              <Typography paddingTop={2} variant="h1" color="primary.black">
                {labels.requestTime}
              </Typography>
              <Typography variant="h4" color="primary.blackishGray">
                {getFormattedDateTime(selectedLogsData?.requestTime)}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={6}>
            <Grid item xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography paddingTop={2} variant="h1" color="primary.black">
                  {labels.responseTime}
                </Typography>
                <Typography variant="h4" color="primary.blackishGray">
                  {getFormattedDateTime(selectedLogsData?.responseTime)}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid item xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography paddingTop={2} variant="h1" color="primary.black">
                  {labels.serviceUrl}
                </Typography>
                <Card
                  elevation={0}
                  sx={{ backgroundColor: "primary.layoutBg" }}
                >
                  <CardContent>
                    <Typography variant="h4" color="primary.blackishGray">
                      {selectedLogsData?.url}
                    </Typography>
                  </CardContent>
                </Card>
              </Stack>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid item xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography paddingTop={2} variant="h1" color="primary.black">
                  {labels.request}
                </Typography>
                <Card
                  elevation={0}
                  sx={{ backgroundColor: "primary.layoutBg" }}
                >
                  <CardContent>
                    <Typography variant="h4" color="primary.blackishGray">
                      {selectedLogsData?.requestText}
                    </Typography>
                  </CardContent>
                </Card>
              </Stack>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid item xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography paddingTop={2} variant="h1" color="primary.black">
                  {labels.response}
                </Typography>
                <Card
                  elevation={0}
                  sx={{ backgroundColor: "primary.layoutBg" }}
                >
                  <CardContent>
                    <Typography variant="h4" color="primary.blackishGray">
                      {selectedLogsData?.responseText}
                    </Typography>
                  </CardContent>
                </Card>
              </Stack>
            </Grid>
          </Grid>
        </Grid>

        <Box display="flex" justifyContent="center" paddingBottom={2}>
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

export default LogsDetail;
