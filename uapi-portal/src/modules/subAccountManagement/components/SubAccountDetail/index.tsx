import { Fragment } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useRouter } from "next/router";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQueryClient } from "@tanstack/react-query";

import { Status } from "~/config/appConfig";

import { handleSuccessMessage } from "~/utils/helper";

import { useAppSelector } from "~/state/hooks";

import {
  useCreateSubAccount,
  useUpdateSubAccount,
} from "~/rest/apiHooks/companies/useCompanies";

import { SubAccountForm } from "~/modules/subAccountManagement/components/SubAccountForm";
import { subAccountSchema } from "~/modules/subAccountManagement/utils/accountFormSchema";
import { labels } from "~/modules/subAccountManagement/utils/labels";

import { AppHead } from "~/core/components/Apphead";
import FormLoadingButton from "~/core/components/Buttons/FormLoadingButton";
import ContainerLayout from "~/core/components/Layouts/ContainerLayout";
import { isEditFormMode, paths } from "~/core/utils/helper";

const SubAccountDetail = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const user = useAppSelector((state) => state.core.userInfo);
  const isValidUserName = useAppSelector(
    (state) => state.user.userNameValidation
  );
  const isValidUserEmail = useAppSelector(
    (state) => state.user.userEmailValidation
  );
  const pagetitle = useAppSelector((state) => state.core.modalTitle);
  const formMode = useAppSelector((state) => state.core.formMode);
  const isEditMode = isEditFormMode(
    useAppSelector((state) => state.core.formMode)
  );
  const company = useAppSelector((state) => state.core.currentCompany);
  const { mutate: creatNewSubAccount, isLoading: isCreatingSubAccount } =
    useCreateSubAccount();

  const { mutate: updateSubAccountDetails, isLoading: isUpdatingSubAccount } =
    useUpdateSubAccount();

  const getCompanyDefaultValues = () => {
    if (isEditMode || formMode === "view") {
      return {
        companyName: company?.companyName,
        isActive: company?.isActive ? Status.ACTIVE : Status.IN_ACTIVE,
        subAccountDescription: company?.subAccountTypeDesc,
        useMainAccountBundles: company?.useMainAccountBundles,
        user: company?.superAdmin,
      };
    } else {
      return {
        isActive: Status.ACTIVE,
      };
    }
  };

  const methods = useForm({
    defaultValues: {
      ...getCompanyDefaultValues(),
    },
    reValidateMode: "onBlur",
    mode: "onBlur",
    criteriaMode: "all",
    resolver: yupResolver(subAccountSchema, {
      abortEarly: false,
    }),
  });
  const { getValues } = methods;

  const createSubAccount = (companydata: any) => {
    creatNewSubAccount(
      { accountData: companydata, companyId: user!.company.id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(["CompanySubAccounts"]);
          handleSuccessMessage("Sub Account", "created");
          router.push(paths.subAccounts);
        },
      }
    );
  };

  const updateSubAccountData = (companydata: any) => {
    updateSubAccountDetails(
      {
        accountData: companydata,
        companyId: user!.company.id,
        subAccountId: company!.id ?? 0,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(["CompanySubAccounts"]);
          handleSuccessMessage("Sub Account", "updated");
          router.push(paths.subAccounts);
        },
      }
    );
  };

  const alterSubmitValues = (existingValues: any) => {
    const alteredData = JSON.parse(JSON.stringify(existingValues));
    alteredData.isActive = alteredData.isActive === Status.ACTIVE;
    alteredData.user = {
      userType: "COMPANY_USER",
      firstName: alteredData.user.firstName,
      lastName: alteredData.user.lastName,
      nationalId: alteredData.user.nationalId,
      username: alteredData.user.username,
      email: alteredData.user.email,
      contactNo: alteredData.user.contactNo,
    };
    return alteredData;
  };

  const onSubmit = async () => {
    const values = getValues();

    if (!isEditMode) {
      if (isValidUserName && isValidUserEmail) {
        createSubAccount(alterSubmitValues(values));
      }
    } else {
      updateSubAccountData(alterSubmitValues(values));
    }
  };

  const handleBack = () => {
    router.push(paths.subAccounts);
  };

  return (
    <Fragment>
      <AppHead
        title={isEditMode ? labels.updateAccount : labels.createAccount}
      />
      <ContainerLayout breadCrumbs={[labels.subAccounts, pagetitle]}>
        <Grid item container sx={{ justifyContent: "center" }}>
          <Grid item xs={11}>
            <Fragment>
              <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)}>
                  <Box
                    width="100%"
                    sx={{
                      flexDirection: "column",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <SubAccountForm />
                  </Box>

                  <Box
                    width="100%"
                    paddingTop={4}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    {formMode === "view" && (
                      <FormLoadingButton
                        buttonVariant="contained"
                        onClickEvent={handleBack}
                        color="primary.typoWhite"
                        backgroundColor="primary.green"
                      >
                        {labels.back}
                      </FormLoadingButton>
                    )}

                    {(formMode === "create" || formMode === "edit") && (
                      <FormLoadingButton
                        buttonType="submit"
                        buttonVariant="contained"
                        id="submitCompany"
                        isLoading={isCreatingSubAccount || isUpdatingSubAccount}
                        color="primary.typoWhite"
                        backgroundColor="primary.green"
                      >
                        {labels.save}
                      </FormLoadingButton>
                    )}
                  </Box>
                </form>
              </FormProvider>
            </Fragment>
          </Grid>
        </Grid>
      </ContainerLayout>
    </Fragment>
  );
};

export default SubAccountDetail;
