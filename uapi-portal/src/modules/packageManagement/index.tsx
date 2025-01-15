import { Fragment, SetStateAction, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Typography } from "@mui/material";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import { useRouter } from "next/router";

import { PERMISSION_PACKAGE_ADD } from "~/utils/permissionsConstants";

import { useAppSelector } from "~/state/hooks";

import {
  useGetCompanySelectedPackagesWithPagination,
  useGetServicesCompanySelectedPackagesWithPagination,
} from "~/rest/apiHooks/companies/useCompanies";

import PackageDetail from "~/modules/packageManagement/components/PackageDetail";
import {
  annualPackageColumns,
  getPackageAvailableAmount,
  packageStatus,
  servicesPackageColumns,
} from "~/modules/packageManagement/utils/helper";
import { labels } from "~/modules/packageManagement/utils/labels";

import DropDownController from "~/core/components/FormComponents/DropDownComponent";
import SearchTextField from "~/core/components/FormComponents/SearchTextField";
import ContainerLayout from "~/core/components/Layouts/ContainerLayout";
import { MenuItemStyle } from "~/core/components/style";
import TableComponent from "~/core/components/Table";
import UnAuthorizeView from "~/core/components/UnAuthorizesView";
import { AccountType, paths } from "~/core/utils/helper";

const PackageManagement = () => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  const [servicesPaginationModel, setServicesPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  const [totalAnnualRowCount, setTotalAnnualRowCount] = useState(0);
  const [totalRowCountForServices, setTotalRowCountForServices] = useState(0);
  const [annualPackageNameStr, setAnnualPackageNameStr] = useState("");
  const [packageStatusStr, setPackageStatusStr] = useState("");
  const [servicesPackageNameStr, setServicesPackageNameStr] = useState("");
  const [servicesPackageStatusStr, setServicesPackageStatusStr] = useState("");
  const user = useAppSelector((state) => state.core.userInfo);
  const [isSearchLoadingForAnnual, setSearchForAnnualLoading] = useState(false);
  const [isSearchLoadingForServices, setSearchLoadingForServices] =
    useState(false);
  const [isShowUnAuthView, setShowUnAuthView] = useState(false);
  const [annualPackagesData, setAnnualPackagesData] = useState<any[]>([]);
  const [packagesDataForServices, setPackagesDataForServices] = useState<any[]>(
    []
  );

  const userPermissions = useAppSelector(
    (state) => state.core.userRolePermissions
  );

  const userPermissionsStrings: string[] = userPermissions.map(
    (permission) => permission as unknown as string
  );

  const hasPackageAddPermission: boolean = userPermissionsStrings.includes(
    PERMISSION_PACKAGE_ADD
  );

  const isSuperAdmin: any = user?.isSuperAdmin;

  const [selectedPackagesData, setSelectedPackagesData] = useState<any>();
  const [shouldShowPackageDetail, setShowPackageDetail] = useState(false);
  const [selectedServicesPackagesData, setSelectedServicesPackagesData] =
    useState<any>();
  const [shouldShowServicesPackageDetail, setShowServicesPackageDetail] =
    useState(false);
  const router = useRouter();
  const {
    mutateAsync: getCompanySelectedPackageList,
    data: companySelectedPackageData,
    isLoading: isCompanySelectedPackageLoading,
  } = useGetCompanySelectedPackagesWithPagination();

  const {
    mutateAsync: getCompanySelectedServicesPackagesWithPagination,
    data: companySelectedServicesPackageData,
    isLoading: isCompanySelectedServicesPackageLoading,
  } = useGetServicesCompanySelectedPackagesWithPagination();

  const navigateToPackageCreation = () => {
    router.push(paths.createPackageManagement);
  };

  const getTransactionLimit = (data: any) => {
    // Hide Transaction limit for service bundles
    return data.package.packageType === "SERVICES"
      ? ""
      : data.package.transactionLimit;
  };

  const extractPackageObjects: (array: any[]) => any[] = (array) => {
    return array.map((obj) => {
      const mergedObj: any = {
        ...obj,
        availableAmount: getPackageAvailableAmount(
          obj.package.pricePerPeriod,
          obj.priceConsumption,
          obj.package.packageType
        ),
        packageId: obj.package.id,
        packageName: obj.package.name,
        packageArabicName: obj.package.arabicName,
        packageTransactionLimit: getTransactionLimit(obj),
        packagePricePerPeriod: obj.package.pricePerPeriod,
        packageIsActive: obj.package.isActive,
        packageCreatedAt: obj.package.createdAt,
        packageUpdatedAt: obj.package.updatedAt,
        packageCreatedBy: obj.package.createdBy,
        packageUpdatedBy: obj.package.updatedBy,
        packagePackageCode: obj.package.packageCode,
        packageActivationDate: obj.package.activationDate,
        packagePackageType: obj.package.packageType,
        packagePackagePeriod: obj.package.packagePeriod,
        packageValidity: obj.package.packagePeriod,
        accountName:
          obj.company.accountType === AccountType.MAIN
            ? obj.company.companyName
            : "",
        subAccountName:
          obj.company.accountType === AccountType.SUB
            ? obj.company.companyName
            : "",
      };
      return mergedObj;
    });
  };

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

  useEffect(() => {
    if (companySelectedPackageData) {
      setTotalAnnualRowCount(companySelectedPackageData.totalRecords);
      setSearchForAnnualLoading(false);
      setAnnualPackagesData(
        extractPackageObjects(
          companySelectedPackageData.companyPackageSelectedList
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companySelectedPackageData]);

  useEffect(() => {
    if (companySelectedServicesPackageData) {
      setTotalRowCountForServices(
        companySelectedServicesPackageData.totalRecords
      );
      setSearchLoadingForServices(false);
      setPackagesDataForServices(
        extractPackageObjects(
          companySelectedServicesPackageData.companyPackageSelectedList
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companySelectedServicesPackageData]);

  useEffect(() => {
    getCompanySelectedPackageList(
      {
        packageName: annualPackageNameStr,
        packageStatus: packageStatusStr,
        pageNumber: paginationModel.page,
        pageSize: paginationModel.pageSize,
        packageType: "ANNUAL",
        mainAccountId: getMainAccountId(),
        subAccountId: getSubAccountId(),
      },
      {
        onSuccess: () => {
          setShowUnAuthView(false);
        },
        onError: (error: any) => {
          const status =
            error?.error?.response?.status || error?.response?.status;
          if (status === 403) {
            setShowUnAuthView(true);
          }
        },
      }
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationModel.page, annualPackageNameStr, packageStatusStr]);

  useEffect(() => {
    getCompanySelectedServicesPackagesWithPagination(
      {
        packageName: servicesPackageNameStr,
        packageStatus: servicesPackageStatusStr,
        pageNumber: servicesPaginationModel.page,
        pageSize: servicesPaginationModel.pageSize,
        packageType: "SERVICES",
        mainAccountId: getMainAccountId(),
        subAccountId: getSubAccountId(),
      },
      {
        onSuccess: () => {
          setShowUnAuthView(false);
        },
        onError: (error: any) => {
          const status =
            error?.error?.response?.status || error?.response?.status;
          if (status === 403) {
            setShowUnAuthView(true);
          }
        },
      }
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    servicesPaginationModel.page,
    servicesPackageNameStr,
    servicesPackageStatusStr,
  ]);

  const onPackageView = (viewPackage: any) => {
    setSelectedPackagesData(viewPackage);
    setShowPackageDetail(true);
  };

  const onPackageViewForServices = (viewPackage: any) => {
    setSelectedServicesPackagesData(viewPackage);
    setShowServicesPackageDetail(true);
  };

  const footerSummary = () => {
    return (
      <Grid
        container
        xs={12}
        paddingX={1.2}
        height={90} // Adjusted height to fit both lines
        alignItems="center"
        justifyContent="center"
        sx={{ backgroundColor: "#F3F3F3" }}
      >
        <Grid
          item
          xs={12}
          display="flex"
          justifyContent="center"
          paddingLeft={1}
        >
          <Typography variant="h2" textAlign="center" noWrap>
            {labels.availableAmountUpdated}
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          display="flex"
          justifyContent="center"
          paddingLeft={1}
        >
          <Typography variant="h2" textAlign="center" noWrap>
            {labels.priceConsumptionUpdated}
          </Typography>
        </Grid>
      </Grid>
    );
  };

  const annualFooterSummary = () => {
    return (
      <Grid
        container
        xs={12}
        paddingX={1.2}
        height={45}
        alignItems="center"
        justifyContent="center"
        sx={{ backgroundColor: "#F3F3F3" }}
      >
        <Grid
          item
          xs={12}
          paddingLeft={1}
          display="flex"
          justifyContent="center"
        >
          <Typography variant="h2" display="inline" textAlign="center" noWrap>
            {labels.annualPackageTransactionConsumptionMessage}
          </Typography>
        </Grid>
      </Grid>
    );
  };

  const handleSearch = (query: SetStateAction<string>) => {
    // Set the query
    setAnnualPackageNameStr(query);

    // start the loader
    if (query) setSearchForAnnualLoading(true);

    // Reset the Pagination
    setPaginationModel({ page: 0, pageSize: 5 });
  };

  const handleSearchForServices = (query: SetStateAction<string>) => {
    // Set the query
    setServicesPackageNameStr(query);

    // start the loader
    if (query) setSearchLoadingForServices(true);

    // Reset the Pagination
    setServicesPaginationModel({ page: 0, pageSize: 5 });
  };

  const handlePackageDetailAction = (Status: boolean) => {
    setShowPackageDetail(Status);
  };

  const handlePackageDetailActionForServices = (Status: boolean) => {
    setShowServicesPackageDetail(Status);
  };

  const methods = useForm();

  const showHideAddPackageButton = () => {
    if (user?.company.accountType === AccountType.MAIN) {
      // For Main Accounts
      if (isSuperAdmin || hasPackageAddPermission) {
        return true;
      }
    } else {
      // for Sub Account
      if (user?.company.useMainAccountBundles) {
        return false;
      } else if (isSuperAdmin || hasPackageAddPermission) return true;
    }
  };

  return (
    <Fragment>
      {isShowUnAuthView ? (
        <UnAuthorizeView hideHomeBtn />
      ) : (
        <ContainerLayout
          buttonLabel={labels.addpackage}
          buttonAction={navigateToPackageCreation}
          breadCrumbs={[labels.packageManagment]}
          showButton={showHideAddPackageButton()} // {isSuperAdmin || hasPackageAddPermission}
        >
          <Grid
            container
            item
            direction="row"
            xs={12}
            justifyContent="space-between"
          >
            <Grid item container columnGap={2} xs={8}>
              <Grid item xs={4}>
                <SearchTextField
                  searchPlaceHolder={labels.searchAnnualPackageName}
                  onSearch={handleSearch}
                  interval={300}
                  isSearchLoading={isSearchLoadingForAnnual}
                />
              </Grid>
              <Grid item xs={4}>
                <FormProvider {...methods}>
                  <DropDownController
                    controllerName=""
                    placeHolder={labels.selectPackageStatus}
                    isRequired={false}
                    disabled={false}
                    showToolTip
                    defaultSelectedValue={packageStatusStr}
                    onSelectChange={(selectedValue) =>
                      setPackageStatusStr(selectedValue.target.value)
                    }
                  >
                    {packageStatus?.map((data: any) => {
                      return (
                        <MenuItem
                          key={data.label}
                          value={data.label}
                          sx={MenuItemStyle}
                        >
                          {data.label}
                        </MenuItem>
                      );
                    })}
                  </DropDownController>
                </FormProvider>
              </Grid>
            </Grid>
            {user?.company.servicesPostpaidSubscribed && (
              <Grid item>
                <Chip
                  label={labels.servicePostpaidPackage}
                  variant="outlined"
                  sx={{
                    height: 40,
                    fontWeight: 400,
                    fontSize: "0.97rem",
                    color: "secondary.activeText",
                    border: "none",
                    backgroundColor: "secondary.activeBg",
                  }}
                />
              </Grid>
            )}
          </Grid>
          <Grid item>
            <TableComponent
              columnHeaderHeight={45}
              columns={annualPackageColumns}
              rows={annualPackagesData}
              loading={isCompanySelectedPackageLoading}
              deleting={false}
              onView={onPackageView}
              rowCount={totalAnnualRowCount}
              paginationMode="server"
              showActionTitle
              showViewButton
              actions
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              showFooterRow
              footerView={annualFooterSummary()}
              showHeaderView
              headerName={labels.annualPackage}
            />
            <PackageDetail
              isOpen={shouldShowPackageDetail}
              selectedPackage={selectedPackagesData}
              handleAction={handlePackageDetailAction}
            />
          </Grid>

          <Grid item container columnGap={2} xs={8}>
            {!user?.company.servicesPostpaidSubscribed && (
              <Grid item xs={2.8}>
                <SearchTextField
                  searchPlaceHolder={labels.searchPackageName}
                  onSearch={handleSearchForServices}
                  interval={300}
                  isSearchLoading={isSearchLoadingForServices}
                />
              </Grid>
            )}

            {!user?.company.servicesPostpaidSubscribed && (
              <Grid item xs={2.65}>
                <FormProvider {...methods}>
                  <DropDownController
                    controllerName=""
                    placeHolder={labels.selectServicesPackagesStatus}
                    isRequired={false}
                    disabled={false}
                    showToolTip
                    defaultSelectedValue={servicesPackageStatusStr}
                    onSelectChange={(selectedValue) =>
                      setServicesPackageStatusStr(selectedValue.target.value)
                    }
                  >
                    {packageStatus?.map((data: any) => {
                      return (
                        <MenuItem
                          key={data.label}
                          value={data.label}
                          sx={MenuItemStyle}
                        >
                          {data.label}
                        </MenuItem>
                      );
                    })}
                  </DropDownController>
                </FormProvider>
              </Grid>
            )}
          </Grid>

          <Grid item>
            {!user?.company.servicesPostpaidSubscribed && (
              <TableComponent
                columnHeaderHeight={45}
                columns={servicesPackageColumns}
                rows={packagesDataForServices}
                loading={isCompanySelectedServicesPackageLoading}
                deleting={false}
                onView={onPackageViewForServices}
                rowCount={totalRowCountForServices}
                paginationMode="server"
                paginationModel={servicesPaginationModel}
                onPaginationModelChange={setServicesPaginationModel}
                showFooterRow
                showActionTitle
                showViewButton
                actions
                showHeaderView
                footerView={footerSummary()}
                headerName={labels.servicesPackage}
              />
            )}
          </Grid>

          <PackageDetail
            isOpen={shouldShowServicesPackageDetail}
            selectedPackage={selectedServicesPackagesData}
            handleAction={handlePackageDetailActionForServices}
          />
        </ContainerLayout>
      )}
    </Fragment>
  );
};

export default PackageManagement;
