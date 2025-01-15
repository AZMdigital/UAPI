import CloseIcon from "@mui/icons-material/Close";
import { Card, CardContent } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

import { LogsDetailProps } from "~/modules/callbackLogs/interfaces/callbackLogs.interface";
import { labels } from "~/modules/callbackLogs/utils/labels";

const CallbackLogsDetail = ({
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
            {labels.callbackLogsDetail}
          </Typography>
        </Box>

        <Divider />
        <Grid container spacing={1} xs={12} paddingY={2}>
          <Grid item xs={6}>
            <Stack direction="column" spacing={1}>
              <Typography paddingTop={2} variant="h1" color="primary.black">
                {labels.serviceName}
              </Typography>
              <Typography variant="h4" color="primary.blackishGray">
                {selectedLogsData?.serviceName}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={6}>
            <Grid item xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography paddingTop={2} variant="h1" color="primary.black">
                  {labels.outboundUrl}
                </Typography>
                <Typography variant="h4" color="primary.blackishGray">
                  {selectedLogsData?.outboundUrl}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <Grid item xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography paddingTop={2} variant="h1" color="primary.black">
                  {labels.outboundResponse}
                </Typography>
                <Typography variant="h4" color="primary.blackishGray">
                  {selectedLogsData?.outboundResponse}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <Stack direction="column" spacing={1}>
              <Typography paddingTop={2} variant="h1" color="primary.black">
                {labels.createdAt}
              </Typography>
              <Typography variant="h4" color="primary.blackishGray">
                {selectedLogsData?.createdAt}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid item xs={12}>
            <Stack direction="column" spacing={1}>
              <Typography paddingTop={2} variant="h1" color="primary.black">
                {labels.inboundRequestData}
              </Typography>
              <Card elevation={0} sx={{ backgroundColor: "primary.layoutBg" }}>
                <CardContent sx={{ padding: 2 }}>
                  <Typography
                    variant="h4"
                    color="primary.blackishGray"
                    sx={{ wordBreak: "break-word" }}
                  >
                    {selectedLogsData?.inboundRequestData}
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
                {labels.outboundRequestData}
              </Typography>
              <Card elevation={0} sx={{ backgroundColor: "primary.layoutBg" }}>
                <CardContent sx={{ padding: 2 }}>
                  <Typography
                    variant="h4"
                    color="primary.blackishGray"
                    sx={{ wordBreak: "break-word" }}
                  >
                    {selectedLogsData?.outboundRequestData}
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
                {labels.error}
              </Typography>
              <Card elevation={0} sx={{ backgroundColor: "primary.layoutBg" }}>
                <CardContent>
                  <Typography variant="h4" color="primary.blackishGray">
                    {selectedLogsData?.error}
                  </Typography>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>

        <Grid item xs={6}>
          <Stack direction="column" spacing={1}>
            <Typography paddingTop={2} variant="h1" color="primary.black">
              {labels.inboundRequestReceivedAt}
            </Typography>
            <Typography variant="h4" color="primary.blackishGray">
              {selectedLogsData?.inboundRequestReceivedAt}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={6}>
          <Stack direction="column" spacing={1}>
            <Typography paddingTop={2} variant="h1" color="primary.black">
              {labels.outboundResponseReceivedAt}
            </Typography>
            <Typography variant="h4" color="primary.blackishGray">
              {selectedLogsData?.outboundResponseReceivedAt}
            </Typography>
          </Stack>
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

export default CallbackLogsDetail;
