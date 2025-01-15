import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

import { PackageDetailProps } from "~/modules/packageManagement/interfaces/packages.interface";
import {
  annualPackage,
  getFormattedStatus,
  getPackageAvailableAmount,
  getPackageStatusBgColor,
  getPackageStatusTextColor,
  serviceBundelPackage,
} from "~/modules/packageManagement/utils/helper";
import { labels } from "~/modules/packageManagement/utils/labels";

import { convertToTitleCase } from "~/core/utils/helper";

const PackageDetail = ({
  isOpen,
  handleAction,
  selectedPackage,
}: PackageDetailProps) => {
  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
      padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
      padding: theme.spacing(1),
    },
    "& .MuiDialog-paper": {
      borderRadius: "16px",
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
            {labels.packageDetail}
          </Typography>
        </Box>

        <Divider />
        <Grid container spacing={1} xs={12} paddingY={4}>
          <Grid item xs={6}>
            <Stack direction="column" spacing={1}>
              <Typography paddingTop={2} variant="h1" color="primary.black">
                {labels.packageName}
              </Typography>
              <Typography variant="h4" color="primary.blackishGray">
                {selectedPackage?.packageName}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={6}>
            <Grid item xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography paddingTop={2} variant="h1" color="primary.black">
                  {labels.price}
                </Typography>
                <Typography variant="h4" color="primary.blackishGray">
                  {`${selectedPackage?.packagePricePerPeriod} SAR`}
                </Typography>
              </Stack>
            </Grid>
          </Grid>

          {selectedPackage?.package.packageType === annualPackage && (
            <Grid item xs={6}>
              <Stack direction="column" spacing={1}>
                <Typography paddingTop={2} variant="h1" color="primary.black">
                  {labels.transactionLimit}
                </Typography>
                <Typography variant="h4" color="primary.blackishGray">
                  {selectedPackage?.packageTransactionLimit}
                </Typography>
              </Stack>
            </Grid>
          )}

          {selectedPackage?.package.packageType === annualPackage && (
            <Grid item xs={6}>
              <Grid item xs={12}>
                <Stack direction="column" spacing={1}>
                  <Typography paddingTop={2} variant="h1" color="primary.black">
                    {labels.transactionConsumption}
                  </Typography>
                  <Typography variant="h4" color="primary.blackishGray">
                    {selectedPackage?.transactionConsumption}
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          )}

          {selectedPackage?.package.packageType === serviceBundelPackage && (
            <Grid item xs={6}>
              <Grid item xs={12}>
                <Stack direction="column" spacing={1}>
                  <Typography paddingTop={2} variant="h1" color="primary.black">
                    {labels.availableAmount}
                  </Typography>
                  <Typography variant="h4" color="primary.blackishGray">
                    {`${getPackageAvailableAmount(
                      selectedPackage?.packagePricePerPeriod,
                      selectedPackage?.priceConsumption,
                      selectedPackage?.packagePackageType
                    )} SAR`}
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          )}

          {selectedPackage?.package.packageType === serviceBundelPackage && (
            <Grid item xs={6}>
              <Grid item xs={12}>
                <Stack direction="column" spacing={1}>
                  <Typography paddingTop={2} variant="h1" color="primary.black">
                    {labels.priceConsumption}
                  </Typography>
                  <Typography variant="h4" color="primary.blackishGray">
                    {`${selectedPackage?.priceConsumption} SAR`}
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          )}

          <Grid item xs={6}>
            <Grid item xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography paddingTop={2} variant="h1" color="primary.black">
                  {labels.dueDate}
                </Typography>
                <Typography variant="h4" color="primary.blackishGray">
                  {selectedPackage?.activationDate.split("T")[0]}
                </Typography>
              </Stack>
            </Grid>
          </Grid>

          <Grid item xs={6}>
            <Stack direction="column" spacing={1}>
              <Typography paddingTop={2} variant="h1" color="primary.black">
                {labels.status}
              </Typography>

              <Chip
                label={convertToTitleCase(
                  getFormattedStatus(selectedPackage?.packageStatus || "")
                )}
                variant="outlined"
                sx={{
                  height: 25,
                  fontWeight: 400,
                  width: "fit-content",
                  fontSize: "0.97rem",
                  color: getPackageStatusTextColor(
                    selectedPackage?.packageStatus
                  ),
                  border: "none",
                  backgroundColor: getPackageStatusBgColor(
                    selectedPackage?.packageStatus
                  ),
                }}
              />
            </Stack>
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

export default PackageDetail;
