import { Fragment, useState } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import { handleErroMessage } from "~/utils/helper";

import { useAppSelector } from "~/state/hooks";

import { useGetCompanyAnnualPackages } from "~/rest/apiHooks/companies/useCompanies";
import { PackageType } from "~/rest/models/package";

import PackageActivationModal from "~/modules/packageManagement/components/PackageActivationModal";
import PackageCard from "~/modules/packageManagement/components/PackageCard";
import { AllPackageProps } from "~/modules/packageManagement/interfaces/packages.interface";
import {
  annualSubscriptionDescriptions,
  updateTransactionLimit,
} from "~/modules/packageManagement/utils/helper";
import { labels } from "~/modules/packageManagement/utils/labels";

import ConfirmationDailog from "~/core/components/ConfirmationDialog";
import { AccountType } from "~/core/utils/helper";

export default function AnnualPackages({
  packages,
  companySelectedPackages,
}: AllPackageProps) {
  const user = useAppSelector((state: any) => state.core.userInfo);
  const [shouldShowPackageModal, setShowPackageModal] = useState(false);
  const [isRenewFlow, setIsRenewFlow] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<PackageType>();
  const [selectedRenewalPackage, setSelectedRenewalPackage] = useState<any>();
  const [
    shouldPackageSelectionConfirmationDialog,
    setPackageSelectionConfirmationDialog,
  ] = useState(false);

  const {
    mutateAsync: getCompanyAnnualPackageList,
    isLoading: isAnnualPackageLoading,
  } = useGetCompanyAnnualPackages();

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
      const latestAnnualPackages = await getCompanyAnnualPackageList({
        companyId: getCompanyId(),
        subAccountId: getSubAccountId(),
      });
      const filterArray = latestAnnualPackages.filter(
        (key: any) => key.id === selectedRenewalPackage.package.id
      );

      if (filterArray.length > 0) {
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

  const handleActivationPackage = () => {
    // Set Activation Flow
    setIsRenewFlow(false);

    // Show Confirmation dialog
    setPackageSelectionConfirmationDialog(true);
  };

  const handlePackageSelectionConfirmation = (confirmationStatus: boolean) => {
    if (confirmationStatus) {
      // User has confirm so please show the activation modal

      // Now Check if its the renew flow
      if (isRenewFlow) {
        // set the company selected package in selection package
        setSelectedPackage(selectedRenewalPackage.package);
      }

      // Show the activation modal
      setShowPackageModal(true);

      // close the confirmation
      setPackageSelectionConfirmationDialog(false);
    } else {
      // close the confirmation
      setPackageSelectionConfirmationDialog(false);
    }
  };

  const getPackageDetailList = () => {
    if (selectedPackage) {
      const detailList: string[] = [];

      // Package Name
      detailList.push(`${labels.packageName}: ${selectedPackage.name}`);
      // Package Transaction limit
      detailList.push(
        `${labels.transactionLimit}: ${selectedPackage.transactionLimit}`
      );
      // Package Price
      detailList.push(
        `${labels.packagePrice}: ${selectedPackage.pricePerPeriod} SAR`
      );
      // Package period
      detailList.push(
        `${labels.duration}: ${getDaysFromPackagePeriod(
          selectedPackage.packagePeriod
        )}`
      );
      return detailList;
    } else {
      return [];
    }
  };

  const getDaysFromPackagePeriod = (packagePeriod: string) => {
    // Return the number of days based on the package period
    if (packagePeriod === "YEARLY") {
      return "365 Days";
    } else if (packagePeriod === "QUARTERLY") {
      return "90 Days";
    } else if (packagePeriod === "MONTHLY") {
      return "30 Days";
    } else {
      return "-";
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

  return (
    <Box display="content" flexDirection="column" paddingX={5} width="100%">
      {companySelectedPackages?.length > 0 && (
        <Fragment>
          <Typography variant="h1" textAlign="center" marginTop={4}>
            {labels.subscribedPackages}
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
            height={companySelectedPackages?.length > 0 ? 450 : "fit-content"}
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
                  packageDescriptionList={updateTransactionLimit(
                    annualSubscriptionDescriptions,
                    packageData.package.transactionLimit
                  )}
                  packageData={packageData.package}
                  otherData={packageData}
                  selectedPackage={selectedRenewalPackage!}
                  handleSelection={selectRenewalPackage}
                />
              ))}
            </Box>
          </Grid>

          <Box width="100%" paddingY={5} display="flex" justifyContent="center">
            <LoadingButton
              loading={isAnnualPackageLoading}
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
              {!isAnnualPackageLoading && labels.reNewPackage}
            </LoadingButton>
          </Box>
        </Fragment>
      )}

      {packages?.length > 0 && (
        <Fragment>
          <Typography variant="h1" textAlign="center" marginTop={4}>
            {labels.availablePackages}
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
            height={packages?.length > 0 ? 450 : "fit-content"}
            width="100%"
            style={{
              // eslint-disable-next-line @typescript-eslint/naming-convention
              WebkitAlignContent: "unset",
            }}
            sx={{ overflowX: "auto" }}
          >
            <Box display="flex" justifyContent="center" gap={3}>
              {packages?.map((packageData: PackageType, index: number) => (
                <PackageCard
                  key={packageData.id}
                  packageDescriptionList={updateTransactionLimit(
                    annualSubscriptionDescriptions,
                    packages[index].transactionLimit
                  )}
                  packageData={packageData}
                  selectedPackage={selectedPackage!}
                  handleSelection={selectAvailablePackage}
                />
              ))}
            </Box>
          </Grid>

          <Box width="100%" paddingY={5} display="flex" justifyContent="center">
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

      <PackageActivationModal
        modalHeading={labels.addNewAnnualPackage}
        isOpen={shouldShowPackageModal}
        handleAction={handlePackageModalAction}
        selectedPackage={selectedPackage!}
        packageDescriptionList={getPackageDetailList()}
      />
      <ConfirmationDailog
        isOpen={shouldPackageSelectionConfirmationDialog}
        label={labels.packageSelectionMessage}
        handleAction={handlePackageSelectionConfirmation}
      />
    </Box>
  );
}
