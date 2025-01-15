import { Fragment, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import { useAppSelector } from "~/state/hooks";

import {
  useGetCompanyAnnualPackages,
  useGetCompanySelectedPackages,
  useGetCompanyServicesPackages,
} from "~/rest/apiHooks/companies/useCompanies";

import { AccountType, addPackageTabs } from "~/modules/_core/utils/helper";
import AnnualPackages from "~/modules/packageManagement/components/AnnualPackages";
import ServiceBundlePackages from "~/modules/packageManagement/components/ServiceBundlePackages";
import {
  annualPackage,
  getCompanyActivePackages,
  serviceBundelPackage,
} from "~/modules/packageManagement/utils/helper";
import { labels } from "~/modules/packageManagement/utils/labels";

import { AppHead } from "~/core/components/Apphead";
import ContainerLayout from "~/core/components/Layouts/ContainerLayout";
import LoadingView from "~/core/components/LoadingView";
import TabsComponent from "~/core/components/TabsComponent";
import UnAuthorizeView from "~/core/components/UnAuthorizesView";

const PackageSelection = () => {
  const user = useAppSelector((state) => state.core.userInfo);
  const pagetitle = useAppSelector((state) => state.core.modalTitle);
  const [activeStep, setActiveStep] = useState<number>(0);
  const packageTabs = [...addPackageTabs];
  const [currentPackageTabs, setPackageTabs] = useState(packageTabs);
  const [isShowUnAuthView, setShowUnAuthView] = useState(false);
  const [selectedAnnualPackagesData, setSelectedAnnualPackagesData] = useState<
    any[]
  >([]);

  const [availableAnnualPackagesData, setAvailableAnnualPackagesData] =
    useState<any[]>([]);

  const [availableServiceBundleData, setAvailableServiceBundleData] = useState<
    any[]
  >([]);

  const [selectedServicePackagesData, setSelectedServicePackagesData] =
    useState<any[]>([]);
  const {
    mutateAsync: getCompanyAnnualPackageList,
    data: companyAnnualPacakageData,
    isLoading: isAnnualPackageLoading,
  } = useGetCompanyAnnualPackages();

  const {
    mutateAsync: getCompanyServicesPackageList,
    data: companyServicePackageData,
    isLoading: isServicePackageLoading,
  } = useGetCompanyServicesPackages();

  const {
    mutateAsync: getCompanySelectedPackages,
    data: companySelectedPackageData,
    isLoading: isCompanySelectedPackageLoading,
    error,
    isError,
  } = useGetCompanySelectedPackages();

  const getMainAccountId = () => {
    if (user?.company.accountType === AccountType.SUB) {
      return user?.company.mainAccountId;
    } else {
      return null;
    }
  };

  const getSubAccountId = () => {
    if (user?.company.accountType === AccountType.SUB) {
      return user?.company.id;
    } else {
      return null;
    }
  };

  const getCompanyId = () => {
    if (user?.company.accountType === AccountType.SUB) {
      return user?.company.mainAccountId as number;
    } else {
      return user?.company.id as number;
    }
  };

  useEffect(() => {
    // Get company Packages
    if (user) {
      getCompanySelectedPackages({
        mainAccountId: getMainAccountId(),
        subAccountId: getSubAccountId(),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setShowUnAuthView(false);
    if (companySelectedPackageData && user) {
      // Get All packages here
      getCompanyAnnualPackageList({
        companyId: getCompanyId(),
        subAccountId: getSubAccountId(),
      });
      getCompanyServicesPackageList({
        companyId: getCompanyId(),
        subAccountId: getSubAccountId(),
      });

      const filteredAnnualData = getCompanyActivePackages(
        companySelectedPackageData.companyPackageSelectedList,
        annualPackage
      );
      setSelectedAnnualPackagesData(filteredAnnualData);

      // Set Service Data
      const filteredServiceData = getCompanyActivePackages(
        companySelectedPackageData.companyPackageSelectedList,
        serviceBundelPackage
      );
      setSelectedServicePackagesData(filteredServiceData);

      // Check if the User has any Annual Package
      if (filteredAnnualData.length === 0) {
        // Disable Services Tab
        const updatedTabs = [...currentPackageTabs];
        updatedTabs[1].disabled = true;
        setPackageTabs(updatedTabs);
      }
    }
    if (isError) {
      const errorObj: any = error;
      const status =
        errorObj?.error?.response?.status || errorObj?.response?.status;

      if (status === 403) {
        setShowUnAuthView(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companySelectedPackageData, error, isError]);

  useEffect(() => {
    if (companyAnnualPacakageData && companySelectedPackageData) {
      // First we check do we have any selected Annual Packages
      if (companySelectedPackageData.companyPackageSelectedList.length > 0) {
        // We need to filter out all available Annual packages that are not already subscribed
        const unSubcribedPackages = companyAnnualPacakageData.filter(
          (item: any) =>
            !companySelectedPackageData.companyPackageSelectedList.some(
              (obj: any) => obj.package && obj.package.id === item.id
            )
        );

        setAvailableAnnualPackagesData(unSubcribedPackages);
      } else {
        // Just show all the Annual packages
        setAvailableAnnualPackagesData(companyAnnualPacakageData);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyAnnualPacakageData]);

  useEffect(() => {
    if (companyServicePackageData && companySelectedPackageData) {
      // First we check do we have any selected Service Packages
      if (companySelectedPackageData.companyPackageSelectedList.length > 0) {
        // We need to filter out all available Service packages that are not already subscribed
        const unSubcribedPackages = companyServicePackageData.filter(
          (item: any) =>
            !companySelectedPackageData.companyPackageSelectedList.some(
              (obj: any) =>
                obj.package &&
                obj.package.id === item.id &&
                // new check
                obj.packageStatus === "ACTIVE"
            )
        );
        setAvailableServiceBundleData(unSubcribedPackages);
      } else {
        // Just show all the Service packages
        setAvailableServiceBundleData(companyServicePackageData);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyServicePackageData]);

  useEffect(() => {
    if (companyAnnualPacakageData && companySelectedPackageData) {
      // First we check do we have any selected Annual Packages
      if (companySelectedPackageData.companyPackageSelectedList.length > 0) {
        // We need to filter out all available Annual packages that are not already subscribed
        const unSubcribedPackages = companyAnnualPacakageData.filter(
          (item: any) =>
            !companySelectedPackageData.companyPackageSelectedList.some(
              (obj: any) =>
                obj.package &&
                obj.package.id === item.id &&
                // new check
                obj.packageStatus === "ACTIVE"
            )
        );
        setAvailableAnnualPackagesData(unSubcribedPackages);
      } else {
        // Just show all the Annual packages
        setAvailableAnnualPackagesData(companyAnnualPacakageData);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyAnnualPacakageData]);

  return (
    <Fragment>
      <AppHead title={pagetitle} />

      {isShowUnAuthView ? (
        <UnAuthorizeView hideHomeBtn />
      ) : (
        <ContainerLayout
          breadCrumbs={[labels.packageManagment, labels.addPackage]}
        >
          <Box display="flex" flexDirection="column" width="100%">
            <Box
              width="100%"
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
            >
              <Typography
                marginTop={3}
                variant="caption"
                textAlign="center"
                maxWidth={654}
                textOverflow="clip"
              >
                {labels.choosePlan}
              </Typography>
              <Typography
                variant="h5"
                fontFamily="SegoeUI"
                maxWidth={654}
                textAlign="center"
                marginTop={2}
                marginBottom={4}
              >
                {labels.planDescription}
              </Typography>

              <Fragment>
                {isServicePackageLoading ||
                isAnnualPackageLoading ||
                isCompanySelectedPackageLoading ? (
                  <LoadingView />
                ) : (
                  <Fragment>
                    <TabsComponent
                      tabArray={currentPackageTabs}
                      currentActiveStep={activeStep}
                      setCurrentTab={setActiveStep}
                    />

                    <Grid
                      container
                      xs={11.5}
                      sx={{
                        justifyContent: "center",
                      }}
                    >
                      {activeStep === 0 ? (
                        <AnnualPackages
                          packages={availableAnnualPackagesData}
                          companySelectedPackages={selectedAnnualPackagesData}
                        />
                      ) : (
                        <ServiceBundlePackages
                          packages={availableServiceBundleData}
                          companySelectedPackages={selectedServicePackagesData}
                        />
                      )}
                    </Grid>
                  </Fragment>
                )}
              </Fragment>
            </Box>
          </Box>
        </ContainerLayout>
      )}
    </Fragment>
  );
};

export default PackageSelection;
