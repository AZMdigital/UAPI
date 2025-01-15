import { Fragment, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import CheckCircleOutlineTwoToneIcon from "@mui/icons-material/CheckCircleOutlineTwoTone";
import CloseIcon from "@mui/icons-material/Close";
import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";

import { handleToastMessage } from "~/utils/helper";

import { useAppSelector } from "~/state/hooks";

import { useActivateCompanyPackage } from "~/rest/apiHooks/companies/useCompanies";

import {
  ActivePackage,
  AnnualPackageModalProps,
} from "~/modules/packageManagement/interfaces/packages.interface";
import { activatePackageFormSchema } from "~/modules/packageManagement/utils/activatePackageSchema";
import {
  annualPackage,
  serviceBundelPackage,
} from "~/modules/packageManagement/utils/helper";
import { labels } from "~/modules/packageManagement/utils/labels";

import ConfirmationDailog from "~/core/components/ConfirmationDialog";
import DateTextFieldController from "~/core/components/FormComponents/DateTextFieldComponent";
import { getFormattedDate, paths } from "~/core/utils/helper";

const PackageActivationModal = ({
  modalHeading,
  selectedPackage,
  packageDescriptionList,
  isOpen,
  handleAction,
}: AnnualPackageModalProps) => {
  const router = useRouter();
  const user = useAppSelector((state) => state.core.userInfo);
  const queryClient = useQueryClient();
  const [
    shouldPackageActivationConfirmationDialog,
    setPackageActivationConfirmationDialog,
  ] = useState(false);

  const { mutate: activateCompanyPackage, isLoading: isActivatingPackage } =
    useActivateCompanyPackage();

  const callActivateCompanyPackage = (
    packageData: ActivePackage,
    companyId: number,
    subAccountId: number | null
  ) => {
    activateCompanyPackage(
      {
        packageData,
        companyId,
        subAccountId,
      },
      {
        onSuccess: () => {
          // Invalidate the quries
          queryClient.invalidateQueries([
            "CompanySelectedPackagesWithPagination",
            "CompanySelectedPackages",
            "CompanyServicesPackages",
            "CompanyAnnualPackages",
          ]);
          // Show Toast Message
          handleToastMessage(labels.packageActivationRequest);
          // close the activation modal here
          handleAction(false);
          // Move to the package management screen
          router.push(paths.packageManagement);
        },
        onError: (error: any) => {
          const status =
            error?.error?.response?.status || error?.response?.status;
          if (status === 403) {
            // handleErroMessage(labels.forbiddenText);
          }
        },
      }
    );
  };

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

  const methods = useForm({
    defaultValues: { activationDate: "" },
    reValidateMode: "onSubmit",
    mode: "onSubmit",
    criteriaMode: "firstError",
    resolver: yupResolver(activatePackageFormSchema, {
      abortEarly: false,
    }),
  });
  const {
    getValues,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = methods;

  const onSubmitHandler = () => {
    setPackageActivationConfirmationDialog(true);
  };

  const onSubmit = handleSubmit(onSubmitHandler);

  const handleClose: DialogProps["onClose"] = (event, reason) => {
    if (reason && reason === "backdropClick") return;
    handleCancel();
  };

  const handleCancel = () => {
    reset();
    handleAction(false);
  };

  const handlePackageActivationConfirmation = (confirmationStatus: boolean) => {
    if (confirmationStatus) {
      // User has confirm the activation so let activate the package by doing an API call and close the dialog
      const { activationDate } = getValues();
      const packageData = {} as ActivePackage;
      packageData.packageId = selectedPackage.id;
      packageData.activationDate = getFormattedDate(activationDate);
      callActivateCompanyPackage(packageData, user?.company.id as number, null);
      // Close the dailog here
      setPackageActivationConfirmationDialog(false);
    } else {
      setPackageActivationConfirmationDialog(confirmationStatus);
    }
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
            {modalHeading}
          </Typography>

          {selectedPackage?.packageType === annualPackage && (
            <Typography paddingTop={0.5} variant="h3">
              {labels.allProcessBeforeTaxes}
            </Typography>
          )}
        </Box>
        <FormProvider {...methods}>
          <form onSubmit={onSubmit}>
            <Box width="100%" padding={2}>
              {selectedPackage?.packageType === serviceBundelPackage && (
                <Fragment>
                  <Typography marginY={1} variant="h1">
                    {`${selectedPackage?.pricePerPeriod} SAR`}
                  </Typography>
                  <Divider sx={{ paddingTop: 1 }} />
                </Fragment>
              )}

              <List sx={{ width: "100%" }}>
                {packageDescriptionList.map((value) => (
                  <ListItem
                    key={value}
                    disableGutters
                    disablePadding
                    alignItems="flex-start"
                  >
                    <ListItemIcon sx={{ minWidth: 35 }}>
                      <CheckCircleOutlineTwoToneIcon sx={{ color: "green" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="h3" component="div" paddingTop={1}>
                          {value}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>

              <Typography variant="h3" sx={{ paddingTop: 2, paddingBottom: 1 }}>
                {labels.activationDate}
              </Typography>
              <DateTextFieldController
                key="activationDate"
                control={control}
                controllerName="activationDate"
                label={labels.activationDate}
                textFieldType="text"
                errorMessage={errors.activationDate?.message as string}
                minDate={dayjs()}
                defaultDate={new Date()}
                dateFormat="YYYY-MM-DD"
              />
            </Box>

            <Stack
              direction="row"
              display="flex"
              justifyContent="center"
              paddingBottom={2}
              spacing={2}
            >
              <LoadingButton
                loading={isActivatingPackage}
                type="submit"
                sx={{
                  maxWidth: 50,
                  color: "white",
                  fontFamily: "SegoeUI",
                  textTransform: "capitalize",
                  backgroundColor: "primary.cyan",
                  "&:hover": {
                    backgroundColor: "primary.cyan",
                  },
                }}
              >
                {labels.save}
              </LoadingButton>
              <Button
                sx={{
                  color: "black",
                  border: "1px solid",
                  borderColor: "primary.textLightGray",
                  textTransform: "capitalize",
                  backgroundColor: "primary.white",
                  "&:hover": {
                    backgroundColor: "primary.white",
                  },
                }}
                onClick={handleCancel}
              >
                {labels.cancel}
              </Button>
            </Stack>
          </form>
        </FormProvider>
      </Box>
      <ConfirmationDailog
        isOpen={shouldPackageActivationConfirmationDialog}
        label={
          selectedPackage?.packageType === annualPackage
            ? labels.annualPackageActivationMessage
            : labels.serviceBundleAnnualActivationMessage
        }
        secondarylabel={labels.proceedMessage}
        handleAction={handlePackageActivationConfirmation}
      />
    </BootstrapDialog>
  );
};

export default PackageActivationModal;
