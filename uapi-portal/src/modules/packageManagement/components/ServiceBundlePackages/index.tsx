import { Fragment, useState } from "react";
import CheckCircleOutlineTwoToneIcon from "@mui/icons-material/CheckCircleOutlineTwoTone";
import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";

import { handleErroMessage, handleToastMessage } from "~/utils/helper";

import { useAppDispatch, useAppSelector } from "~/state/hooks";

import {
  useGetCompanyServicesPackages,
  useSubscribeServicePostpaidPackage,
} from "~/rest/apiHooks/companies/useCompanies";
import { PackageType } from "~/rest/models/package";

import PackageActivationModal from "~/modules/packageManagement/components/PackageActivationModal";
import PackageCard from "~/modules/packageManagement/components/PackageCard";
import { AllPackageProps } from "~/modules/packageManagement/interfaces/packages.interface";
import {
  postPaidDescriptions,
  serviceBundleDescriptions,
} from "~/modules/packageManagement/utils/helper";
import { labels } from "~/modules/packageManagement/utils/labels";

import ConfirmationDailog from "~/core/components/ConfirmationDialog";
import { setUserInfo } from "~/core/state/coreSlice";
import { AccountType, getFormattedDate, paths } from "~/core/utils/helper";

export default function ServiceBundlePackages({
  packages,
  companySelectedPackages,
}: AllPackageProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.core.userInfo);
  const [shouldShowPackageModal, setShowPackageModal] = useState(false);
  const [isRenewFlow, setIsRenewFlow] = useState(false);
  const [isPostPaidFlow, setIsPostPaidFlow] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<PackageType>();
  const [selectedRenewalPackage, setSelectedRenewalPackage] = useState<any>();
  const [
    shouldPackageSelectionConfirmationDialog,
    setPackageSelectionConfirmationDialog,
  ] = useState(false);

  const {
    mutateAsync: getCompanyServicesPackageList,
    isLoading: isServicePackageLoading,
  } = useGetCompanyServicesPackages();

  const { mutate: subscribePostpaidPackage } =
    useSubscribeServicePostpaidPackage();

  const callSubscribePostpaidPackage = (companyId: number) => {
    subscribePostpaidPackage(
      {
        companyId,
      },
      {
        onSuccess: (data: any) => {
          // Remove PostPaid Flow
          setIsPostPaidFlow(false);
          // Show Toast Message
          handleToastMessage(labels.postPaidPackageActivated);

          const newUserData = JSON.parse(JSON.stringify(user));
          newUserData.company.servicesPostpaidSubscribed =
            data.servicesPostpaidSubscribed;
          newUserData.company.servicesPostpaidSubscriptionDate =
            data.servicesPostpaidSubscriptionDate;

          dispatch(setUserInfo({ userInfo: newUserData }));
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

  const handlePackageModalAction = (Status: boolean) => {
    setShowPackageModal(Status);
  };

  const getCompanyId = () => {
    if (user?.company.accountType === AccountType.SUB) {
      return user?.company.mainAccountId as number;
    } else {
      return user?.company.id as number;
    }
  };

  const getSubAccountId = () => {
    if (user?.company.accountType === AccountType.SUB) {
      return user?.company.id;
    } else {
      return null;
    }
  };

  const handleRenewPackage = async () => {
    // Check if this pacakge is available or not.
    try {
      const latestServicePackages = await getCompanyServicesPackageList({
        companyId: getCompanyId(),
        subAccountId: getSubAccountId(),
      });

      const filterArray = latestServicePackages.filter(
        (key: any) => key.id === selectedRenewalPackage.package.id
      );

      if (filterArray.length > 0) {
        // Remove PostPaid Flow
        setIsPostPaidFlow(false);
        // Set Renewal Flow
        setIsRenewFlow(true);
        // set the company selected package in selection package
        setSelectedPackage(selectedRenewalPackage.package);
        // Show the activation modal
        setShowPackageModal(true);
      } else {
        handleErroMessage(labels.selectedPackageNotAvailable);
      }
    } catch (error) {
      handleErroMessage(labels.selectedPackageNotAvailable);
    }
  };

  const handlePostPackageFlow = () => {
    // Set Post paid Flow
    setIsPostPaidFlow(true);

    // Show Confirmation dialog
    setPackageSelectionConfirmationDialog(true);
  };

  const handleActivationPackage = () => {
    // disable postpaid
    setIsPostPaidFlow(false);

    // Set Activation Flow
    setIsRenewFlow(false);

    // Show Confirmation dialog
    setPackageSelectionConfirmationDialog(true);
  };

  const handlePackageSelectionConfirmation = (confirmationStatus: boolean) => {
    if (confirmationStatus) {
      // User has confirm so please show the activation modal
      // Now Check if its the post paid flow or renew flow
      if (isPostPaidFlow) {
        // do post paid call here
        callSubscribePostpaidPackage(user?.company.id as number);
        // close the confirmation
        setPackageSelectionConfirmationDialog(false);
      } else {
        if (isRenewFlow) {
          // set the company selected package in selection package
          setSelectedPackage(selectedRenewalPackage.package);
        }
        // Show the activation modal
        setShowPackageModal(true);
        // close the confirmation
        setPackageSelectionConfirmationDialog(false);
      }
    } else {
      // close the confirmation
      setPackageSelectionConfirmationDialog(false);

      // disable postpaid
      setIsPostPaidFlow(false);
    }
  };
  const selectRenewalPackage = (value: PackageType) => {
    setSelectedRenewalPackage(value);
    setSelectedPackage(undefined);
  };

  const selectAvailablePackage = (value: PackageType) => {
    setSelectedPackage(value);
    setSelectedRenewalPackage(undefined);
  };

  const showPostPaidBundle = () => {
    if (companySelectedPackages?.length === 0) {
      return (
        <Fragment>
          <Typography
            variant="h1"
            textAlign="center"
            sx={{ color: "primary.cyan" }}
          >
            {labels.postpaidBundle}
          </Typography>
          <Card
            variant="outlined"
            sx={{
              display: "inline-table",
              borderRadius: "4px",
              marginTop: 3,
              width: "100%",
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                paddingBottom: 3,
              }}
            >
              <List sx={{ width: "100%", marginTop: 3 }}>
                {postPaidDescriptions.map((value) => (
                  <ListItem key={value} disableGutters alignItems="flex-start">
                    <ListItemIcon sx={{ minWidth: 35 }}>
                      <CheckCircleOutlineTwoToneIcon sx={{ color: "green" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography
                          variant="h5"
                          component="div"
                          paddingTop={0.5}
                        >
                          {value}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>

              <Box width="100%" display="flex" justifyContent="center">
                {user?.company.servicesPostpaidSubscribed === true ? (
                  <Typography
                    variant="h5"
                    component="div"
                    paddingTop={0.5}
                    sx={{ color: "grey" }}
                  >
                    {labels.postPaidPackageSubscribedText +
                      getFormattedDate(
                        user?.company.servicesPostpaidSubscriptionDate
                      )}
                  </Typography>
                ) : (
                  <LoadingButton
                    loading={false}
                    disabled={false}
                    type="submit"
                    onClick={() => handlePostPackageFlow()}
                    sx={{
                      height: 35,
                      width: 72,
                      color: "primary.typoWhite",
                      textTransform: "capitalize",
                      backgroundColor: "primary.green",
                      "&:hover": {
                        backgroundColor: "primary.green",
                      },
                    }}
                  >
                    {labels.submit}
                  </LoadingButton>
                )}
              </Box>
            </CardContent>
          </Card>
        </Fragment>
      );
    } else {
      <></>;
    }
  };

  return (
    <Box
      display="content"
      flexDirection="column"
      paddingTop={3}
      paddingX={5}
      width="100%"
    >
      {user?.company.allowPostpaidPackages && showPostPaidBundle()}

      {!user?.company.servicesPostpaidSubscribed && (
        <Fragment>
          {companySelectedPackages?.length > 0 && (
            <Fragment>
              <Typography variant="h1" textAlign="center" marginTop={4}>
                {labels.subscribedPrepaidBundles}
              </Typography>
              <Divider sx={{ marginTop: 1 }} />

              <Grid
                display="flex"
                justifyContent="center"
                alignContent="center"
                direction="column"
                container
                xs={12}
                paddingTop={5}
                paddingX={1}
                columnGap={3}
                height={
                  companySelectedPackages?.length > 0 ? 650 : "fit-content"
                }
                width="100%"
                style={{
                  // eslint-disable-next-line @typescript-eslint/naming-convention
                  WebkitAlignContent: "unset",
                }}
                sx={{ overflowX: "auto" }}
              >
                <Box display="flex" justifyContent="center" gap={3}>
                  {companySelectedPackages?.map((packageData: any) => (
                    <PackageCard
                      key={packageData.id}
                      packageDescriptionList={serviceBundleDescriptions}
                      packageData={packageData.package}
                      otherData={packageData}
                      selectedPackage={selectedRenewalPackage!}
                      handleSelection={selectRenewalPackage}
                    />
                  ))}
                </Box>
              </Grid>

              <Box
                width="100%"
                paddingY={5}
                display="flex"
                justifyContent="center"
              >
                <LoadingButton
                  loading={isServicePackageLoading}
                  disabled={selectedRenewalPackage === undefined}
                  onClick={() => handleRenewPackage()}
                  type="submit"
                  sx={{
                    width: "120px",
                    height: "40px",
                    color: "primary.typoWhite",
                    textTransform: "capitalize",
                    backgroundColor: "primary.green",
                    "&:hover": {
                      backgroundColor: "primary.green",
                    },
                    "&.Mui-disabled": {
                      backgroundColor: "primary.green",
                      color: "primary.typoWhite",
                      opacity: 0.4,
                    },
                  }}
                >
                  {!isServicePackageLoading && labels.reNewPackage}
                </LoadingButton>
              </Box>
            </Fragment>
          )}

          {packages?.length > 0 && (
            <Fragment>
              <Typography variant="h1" textAlign="center" marginTop={4}>
                {labels.availablePrepaidBundles}
              </Typography>
              <Divider sx={{ marginTop: 1 }} />

              <Grid
                display="flex"
                justifyContent="center"
                alignContent="center"
                direction="column"
                container
                xs={12}
                paddingTop={5}
                paddingX={1}
                columnGap={3}
                height={packages?.length > 0 ? 560 : "fit-content"}
                width="100%"
                style={{
                  // eslint-disable-next-line @typescript-eslint/naming-convention
                  WebkitAlignContent: "unset",
                }}
                sx={{ overflowX: "auto" }}
              >
                <Box display="flex" justifyContent="center" gap={3}>
                  {packages?.map((packageData: PackageType) => (
                    <PackageCard
                      key={packageData.id}
                      packageDescriptionList={serviceBundleDescriptions}
                      packageData={packageData}
                      selectedPackage={selectedPackage!}
                      handleSelection={selectAvailablePackage}
                    />
                  ))}
                </Box>
              </Grid>

              <Box
                width="100%"
                paddingY={5}
                display="flex"
                justifyContent="center"
              >
                <LoadingButton
                  loading={false}
                  disabled={selectedPackage === undefined}
                  onClick={() => handleActivationPackage()}
                  type="submit"
                  sx={{
                    color: "primary.typoWhite",
                    textTransform: "capitalize",
                    backgroundColor: "primary.green",
                    "&:hover": {
                      backgroundColor: "primary.green",
                    },
                    "&.Mui-disabled": {
                      backgroundColor: "primary.green",
                      color: "primary.typoWhite",
                      opacity: 0.4,
                    },
                  }}
                >
                  {labels.generateInvoice}
                </LoadingButton>
              </Box>
            </Fragment>
          )}
        </Fragment>
      )}

      <PackageActivationModal
        modalHeading={labels.addNewServiceBundle}
        isOpen={shouldShowPackageModal}
        handleAction={handlePackageModalAction}
        selectedPackage={selectedPackage!}
        packageDescriptionList={serviceBundleDescriptions}
      />
      <ConfirmationDailog
        isOpen={shouldPackageSelectionConfirmationDialog}
        label={
          isPostPaidFlow
            ? labels.postPaidSelectionMessage
            : labels.packageSelectionMessage
        }
        handleAction={handlePackageSelectionConfirmation}
      />
    </Box>
  );
}
