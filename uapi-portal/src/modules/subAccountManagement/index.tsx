import { Fragment, SetStateAction, useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import { useRouter } from "next/router";

import { handleSuccessMessage } from "~/utils/helper";
import {
  SUB_ACCOUNT_ADD,
  SUB_ACCOUNT_DELETE,
  SUB_ACCOUNT_EDIT,
} from "~/utils/permissionsConstants";

import { useAppDispatch, useAppSelector } from "~/state/hooks";

import {
  useDeleteCompanySubAccount,
  useGetCompanySubAccounts,
  useGetSubAccountToken,
} from "~/rest/apiHooks/companies/useCompanies";

import {
  subAccountsColumns,
  switchAccountCriteria,
} from "~/modules/subAccountManagement/utils/helper";
import { labels } from "~/modules/subAccountManagement/utils/labels";

import ConfirmationDailog from "~/core/components/ConfirmationDialog";
import SearchTextField from "~/core/components/FormComponents/SearchTextField";
import ContainerLayout from "~/core/components/Layouts/ContainerLayout";
import TableComponent from "~/core/components/Table";
import UnAuthorizeView from "~/core/components/UnAuthorizesView";
import {
  saveSelection,
  setAuthUser,
  setCurrentCompany,
  setMainAccountToken,
  setUserInfo,
  setUserRolePermissions,
  toggleModal,
} from "~/core/state/coreSlice";
import { FormModes, paths } from "~/core/utils/helper";

const SubAccountManagement = () => {
  const router = useRouter();
  const user = useAppSelector((state) => state.core.userInfo);
  const mainAccountToken = useAppSelector((state) => state.core.token);
  const mainAccountRefreshToken = useAppSelector(
    (state) => state.core.refreshToken
  );
  const mainAccountValidity = useAppSelector((state) => state.core.validity);
  const mainAccountRefreshValidity = useAppSelector(
    (state) => state.core.refreshValidity
  );
  const mainAccountTokenType = useAppSelector((state) => state.core.tokenType);
  const dispatch = useAppDispatch();
  const [isShowUnAuthView, setShowUnAuthView] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState(0);
  const [selectedSubAccount, setSelectedSubAccount] = useState<any>(null);
  const [shouldShowDialog, setShowDialog] = useState(false);
  const [shouldShowSwitchAccountDialog, setShowSwitchAccountDialog] =
    useState(false);
  const [shouldTriggerRefetch, setTriggerRefetch] = useState(false);
  const [searchSubAccountStr, setsearchSubAccountStr] = useState("");
  const [isSearchLoading, setSearchLoading] = useState(false);
  const [companiesData, setCompaniesData] = useState<any>(null);
  const {
    data: accountsData,
    mutate: getSubAccounts,
    isLoading: isSubAccountLoading,
  } = useGetCompanySubAccounts();

  const userPermissions = useAppSelector(
    (state) => state.core.userRolePermissions
  );

  const userPermissionsStrings: string[] = userPermissions.map(
    (permission) => permission as unknown as string
  );

  const isSuperAdmin: any = user?.isSuperAdmin;

  const hasAddSubAccountPermission: boolean =
    userPermissionsStrings.includes(SUB_ACCOUNT_ADD);

  const hasDeleteSubAccountPermission: boolean =
    userPermissionsStrings.includes(SUB_ACCOUNT_DELETE);

  const hasEditSubAccountPermission: boolean =
    userPermissionsStrings.includes(SUB_ACCOUNT_EDIT);

  const { mutate: deleteOneCompany, isLoading: isDeleting } =
    useDeleteCompanySubAccount();

  const { mutate: getSubAccountToken } = useGetSubAccountToken();

  useEffect(() => {
    if (accountsData) {
      setSearchLoading(false);
      setShowUnAuthView(false);
      setCompaniesData(accountsData.companies);
    }
  }, [accountsData]);

  useEffect(() => {
    if (user) {
      getSubAccounts(
        {
          companyId: user.company.id,
          query: searchSubAccountStr,
        },
        {
          onError: (error: any) => {
            const status =
              error?.error?.response?.status || error?.response?.status;
            if (status === 403) {
              setShowUnAuthView(true);
            }
          },
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldTriggerRefetch, searchSubAccountStr]);

  const navigateToSubAccountsForm = () => {
    router.push(paths.createSubAccounts);
  };

  const handleSearch = (query: SetStateAction<string>) => {
    // Set the query
    setsearchSubAccountStr(query);

    // start the loader
    if (query) setSearchLoading(true);
  };

  const onEdit = (input: any) => {
    dispatch(
      toggleModal({
        title: labels.updateSubAccount,
        formMode: FormModes.EDIT,
      })
    );
    dispatch(setCurrentCompany(input));
    router.push(paths.createSubAccounts);
  };

  const onView = (input: any) => {
    dispatch(
      toggleModal({
        title: labels.viewSubAccount,
        formMode: FormModes.VIEW,
      })
    );
    dispatch(setCurrentCompany(input));
    router.push(paths.createSubAccounts);
  };

  const deleteSelectedCompany = (companyId: number) => {
    setSelectedCompanyId(companyId);
    setShowDialog(true);
  };

  const handleDeleteAction = (confirmationStatus: boolean) => {
    if (confirmationStatus) {
      setShowDialog(false);
      deleteOneCompany(
        { companyId: user!.company.id, subAccountId: selectedCompanyId },
        {
          onSuccess: () => {
            setTriggerRefetch((value) => !value);
            handleSuccessMessage("SubAccount", "deleted");
          },
        }
      );
    } else {
      setShowDialog(false);
    }
  };

  const saveUserInfo = () => {
    const subAccountData = JSON.parse(JSON.stringify(selectedSubAccount));
    const adminData = subAccountData.superAdmin;
    const userCompanyData = subAccountData;
    delete userCompanyData.superAdmin;
    adminData.company = userCompanyData;

    dispatch(setUserInfo({ userInfo: adminData }));

    if (adminData.isSuperAdmin) {
      // If super admin by pass the flow because we don't have roles in it.
      dispatch(saveSelection(""));
      dispatch(setUserRolePermissions([]));
      router.push(paths.homePage);
    }
  };

  const updateToken = (data: any) => {
    const { token, refreshToken, validity, refreshValidity, tokenType } = data;

    // Store Main Account Token
    dispatch(
      setMainAccountToken({
        mainAccountToken,
        mainAccountRefreshToken,
        mainAccountValidity,
        mainAccountRefreshValidity,
        mainAccountTokenType,
      })
    );

    // Store Sub Account Token
    dispatch(
      setAuthUser({
        token,
        refreshToken,
        validity,
        refreshValidity,
        tokenType,
      })
    );

    // Get UserInfo
    saveUserInfo();
  };

  const handleSwitchAction = (confirmationStatus: boolean) => {
    if (confirmationStatus) {
      getSubAccountToken(
        { data: { subAccountId: selectedSubAccount.id } },
        {
          onSuccess: (data: any) => {
            updateToken(data);
          },
          onError: () => {
            setShowSwitchAccountDialog(false);
          },
        }
      );
      setShowSwitchAccountDialog(false);
    } else {
      setShowSwitchAccountDialog(false);
    }
  };
  useEffect(() => {
    if (accountsData) {
      setSearchLoading(false);
      setShowUnAuthView(false);
      const updatedData = accountsData.companies.map((company: any) => ({
        ...company,
        isSwitchable: company.accountType === "SUB" && company.isActive,
      }));
      setCompaniesData(updatedData);
    }
  }, [accountsData]);

  const handleSwitchAccountAction = (input: any) => {
    setSelectedSubAccount(input);
    setShowSwitchAccountDialog(true);
  };

  return (
    <Fragment>
      {isShowUnAuthView ? (
        <UnAuthorizeView hideHomeBtn />
      ) : (
        <Fragment>
          <ContainerLayout
            buttonLabel={labels.createSubAccount}
            buttonAction={navigateToSubAccountsForm}
            breadCrumbs={[labels.subAccounts]}
            showButton={isSuperAdmin || hasAddSubAccountPermission}
          >
            <Grid item container xs={8}>
              <Grid item xs={4}>
                <SearchTextField
                  searchPlaceHolder={labels.searchSubAccount}
                  onSearch={handleSearch}
                  interval={300}
                  isSearchLoading={isSearchLoading}
                />
              </Grid>
            </Grid>
            <Grid item container xs={12} columnGap={2}>
              <Grid item xs={12}>
                <TableComponent
                  columns={subAccountsColumns}
                  rows={companiesData}
                  columnHeaderHeight={48}
                  loading={isSubAccountLoading}
                  deleting={isDeleting}
                  showDeleteButton={
                    isSuperAdmin || hasDeleteSubAccountPermission
                  }
                  showEditButton={isSuperAdmin || hasEditSubAccountPermission}
                  onDelete={deleteSelectedCompany}
                  onEdit={onEdit}
                  showViewButton
                  onView={onView}
                  actions
                  showActionTitle
                  onCustomAction={handleSwitchAccountAction}
                  customActionTitle={labels.switchAccount}
                  showCustomActionButton
                  actionCriteria={switchAccountCriteria}
                />
              </Grid>
            </Grid>
          </ContainerLayout>
          <ConfirmationDailog
            isOpen={shouldShowDialog}
            label={labels.companyDeleteConfirmation}
            handleAction={handleDeleteAction}
          />
          <ConfirmationDailog
            isOpen={shouldShowSwitchAccountDialog}
            label={labels.accountSwitchConfirmation}
            handleAction={handleSwitchAction}
          />
        </Fragment>
      )}
    </Fragment>
  );
};

export default SubAccountManagement;
