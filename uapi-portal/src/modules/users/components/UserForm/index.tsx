/* eslint-disable no-nested-ternary */
import { Fragment, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import { useRouter } from "next/router";
import { yupResolver } from "@hookform/resolvers/yup";

import { Status } from "~/config/appConfig";

import { handleErroMessage, handleSuccessMessage } from "~/utils/helper";
import { labels } from "~/utils/labels";

import { useAppSelector } from "~/state/hooks";

import { useCreateUser, useUpdateUser } from "~/rest/apiHooks";
import { useGetRoles } from "~/rest/apiHooks/roles/useRoles";
import { useGetIsUserExists } from "~/rest/apiHooks/user/useUser";
import { RoleType } from "~/rest/models/role";

import {
  userFormFields,
  userStatus,
  userTypes,
} from "~/modules/users/utils/helper";
import { labels as userLabels } from "~/modules/users/utils/labels";
import { userFormSchema } from "~/modules/users/utils/userFormSchema";

import { AppHead } from "~/core/components/Apphead";
import FormLoadingButton from "~/core/components/Buttons/FormLoadingButton";
import ConfirmationDailog from "~/core/components/ConfirmationDialog";
import DropDownController from "~/core/components/FormComponents/DropDownComponent";
import FormTextFieldController from "~/core/components/FormComponents/FormTextField";
import SearchTextFieldComponent from "~/core/components/FormComponents/SearchTextFieldComponent";
import { Field } from "~/core/components/interface";
import ContainerLayout from "~/core/components/Layouts/ContainerLayout";
import LoadingView from "~/core/components/LoadingView";
import UnAuthorizeView from "~/core/components/UnAuthorizesView";
import { paths } from "~/core/utils/helper";

const UserForm = () => {
  const router = useRouter();
  const user = useAppSelector((state) => state.core.userInfo);
  const pagetitle = useAppSelector((state) => state.core.modalTitle);
  const selectedUser = useAppSelector((state) => state.user.currentUser);
  const { mutateAsync: getAllUserNames, isLoading } = useGetIsUserExists();
  const { mutateAsync: getAllUserEmails, isLoading: isUserEmailLoading } =
    useGetIsUserExists();
  const [fields, setFields] = useState<any>([...userFormFields]);
  const [isUserValid, setUserValidity] = useState<boolean>(true);
  const [isUserEmailValid, setUserEmailValidity] = useState<boolean>(true);
  const dropDownKeys: string[] = ["roleId", "userType", "isActive"];
  const formMode = useAppSelector((state) => state.core.formMode);
  const {
    data: rolesData,
    isFetching: isRoleLoading,
    error,
    isError,
  } = useGetRoles();
  const [rolesList, setRoleList] = useState<RoleType[]>([]);
  const { mutate: addOneUser, isLoading: isAddingUser } = useCreateUser();
  const { mutate: updateOneUser, isLoading: isUpdatingUser } = useUpdateUser();
  const [isShowUnAuthView, setShowUnAuthView] = useState(false);
  const [shouldShowDialog, setShowDialog] = useState(false);
  const createUser = (userData: any) => {
    addOneUser(
      {
        userData,
      },
      {
        onSuccess: () => {
          handleSuccessMessage(
            `User '${`${userData.firstName} ${userData.lastName}`}'`,
            "created"
          );
          router.push(paths.user);
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

  const updateExistingUser = (userData: any, id: any) => {
    updateOneUser(
      {
        userData,
        id,
      },
      {
        onSuccess: () => {
          handleSuccessMessage(
            `User '${`${userData.firstName} ${userData.lastName}`}'`,
            "updated"
          );
          router.push(paths.user);
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

  const getRoleInfo = (user: any) => {
    if (user) {
      if (user.isSuperAdmin) {
        return -1;
      } else {
        return user?.role?.id || undefined;
      }
    } else {
      return undefined;
    }
  };

  const getDefaultValues = () => {
    if (formMode === "view" || formMode === "edit") {
      return {
        ...selectedUser!,
        id: selectedUser?.userCode,
        isActive: selectedUser?.isActive ? Status.ACTIVE : Status.IN_ACTIVE,
        roleId: getRoleInfo(selectedUser!),
      };
    } else {
      return {
        roleId: undefined,
        isActive: Status.ACTIVE,
      };
    }
  };

  const methods = useForm({
    defaultValues: {
      ...getDefaultValues(),
    },
    reValidateMode: "onBlur",
    mode: "onBlur",
    criteriaMode: "all",
    resolver: yupResolver(userFormSchema, {
      abortEarly: false,
    }),
  });
  const { getValues, handleSubmit, setValue } = methods;

  const alterSubmitValues = (existingValues: any) => {
    const alteredData = JSON.parse(JSON.stringify(existingValues));
    alteredData.isActive = alteredData.isActive === Status.ACTIVE;
    alteredData.companyId = user?.company.id;
    alteredData.userType = "COMPANY_USER";
    return alteredData;
  };

  const onSubmitHandler = () => {
    const values = getValues();
    if (isUserValid && isUserEmailValid) {
      if (formMode === "edit") {
        updateExistingUser(alterSubmitValues(values), selectedUser?.id);
      } else {
        createUser(alterSubmitValues(values));
      }
    }
  };

  useEffect(() => {
    if (rolesData) {
      setShowUnAuthView(false);
      setRoleList(rolesData);
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
  }, [rolesData, error, isError]);

  useEffect(() => {
    if (rolesList) {
      if (formMode !== "create") {
        if (!selectedUser?.isSuperAdmin && rolesList.length !== 0) {
          const checkRole = rolesList.filter(
            (role: RoleType) =>
              role.id === selectedUser?.role?.id && role.isActive === true
          );
          if (checkRole.length <= 0) {
            setValue("roleId", -101);
            handleErroMessage(labels.roleNotExist);
          } else {
            setValue("roleId", getRoleInfo(selectedUser!));
          }
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rolesList, selectedUser, setValue]);

  useEffect(() => {
    if (formMode === "create") {
      const newFields = fields.slice(1);
      setFields(newFields);
    } else if (selectedUser?.isSuperAdmin) {
      // We have to remove roleId in case of super admin
      const newArray = fields.filter(
        (obj: any) => obj.controllerName !== "roleId"
      );
      setFields(newArray);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formMode]);

  const onSubmit = handleSubmit(onSubmitHandler);
  const getDropDown = (controllerName: string) => {
    let element: any;
    switch (controllerName) {
      case "roleId":
        element = rolesList
          .filter((role: RoleType) => role.isActive === true)
          .map((role: RoleType) => (
            <MenuItem key={role.id} value={role.id} sx={{ fontSize: 12 }}>
              {role.name}
            </MenuItem>
          ));
        break;
      case "userType":
        element = userTypes?.map((type: any) => (
          <MenuItem key={type.value} value={type.value} sx={{ fontSize: 12 }}>
            {type.name}
          </MenuItem>
        ));
        break;
      case "isActive":
        element = userStatus?.map((type: any) => (
          <MenuItem key={type.value} value={type.value} sx={{ fontSize: 12 }}>
            {type.name}
          </MenuItem>
        ));
        break;
      default:
        element = <></>;
    }
    return element;
  };

  const searchUserName = async (name: string): Promise<boolean> => {
    try {
      const nameStr = name.replace(/\s/g, "");
      const resultUserName = await getAllUserNames({ query: nameStr });
      if (resultUserName) {
        if (!resultUserName.exist) {
          setUserValidity(true);
          return true;
        } else {
          setUserValidity(false);
          return false;
        }
      } else {
        setUserValidity(false);
        return false;
      }
    } catch (error) {
      setUserValidity(false);
      return false;
    }
  };

  const searchUserEmail = async (name: string): Promise<boolean> => {
    try {
      const nameStr = name.replace(/\s/g, "");
      const resultUserEmail = await getAllUserEmails({ query: nameStr });
      if (resultUserEmail) {
        if (!resultUserEmail.exist) {
          setUserEmailValidity(true);
          return true;
        } else {
          setUserEmailValidity(false);
          return false;
        }
      } else {
        setUserEmailValidity(false);
        return false;
      }
    } catch (error) {
      setUserEmailValidity(false);
      return false;
    }
  };

  const handleCancelEvent = () => {
    if (formMode === "view") {
      router.push(paths.user);
    } else {
      // show dialog
      setShowDialog(true);
    }
  };

  const handleConfirmationAction = (confirmationStatus: boolean) => {
    if (confirmationStatus) {
      setShowDialog(false);
      router.push(paths.user);
    } else {
      setShowDialog(false);
    }
  };

  return (
    <Fragment>
      <AppHead title={pagetitle} />
      {isRoleLoading ? (
        <LoadingView height="50vh" />
      ) : (
        <Fragment>
          {isShowUnAuthView ? (
            <UnAuthorizeView hideHomeBtn />
          ) : (
            <ContainerLayout breadCrumbs={[userLabels.manageUsers, pagetitle]}>
              <Grid item container sx={{ justifyContent: "center" }}>
                <Grid item xs={12}>
                  <FormProvider {...methods}>
                    <form onSubmit={onSubmit}>
                      <Box
                        width="100%"
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <FormControl fullWidth>
                          <Grid
                            container
                            xs={12}
                            rowSpacing={4}
                            columnGap={8}
                            direction="row"
                            sx={{
                              paddingTop: 6,
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            {fields.map((formField: Field, index: number) => {
                              return (
                                <Fragment key={formField.controllerName}>
                                  <Grid
                                    key={formField.controllerName}
                                    item
                                    sm={5}
                                    xs={10}
                                    container
                                    direction="row"
                                  >
                                    {dropDownKeys.includes(
                                      formField.controllerName
                                    ) ? (
                                      <DropDownController
                                        controllerName={
                                          formField.controllerName
                                        }
                                        label={formField.label}
                                        isRequired={formField.isRequired!}
                                        disabled={formMode === "view"}
                                        placeHolder={formField.headingText}
                                      >
                                        {getDropDown(formField.controllerName)}
                                      </DropDownController>
                                    ) : formField.controllerName ===
                                        "username" ||
                                      formField.controllerName === "email" ? (
                                      <SearchTextFieldComponent
                                        key={formField.controllerName}
                                        controllerName={
                                          formField.controllerName
                                        }
                                        label={formField.label}
                                        isDisabled={formMode !== "create"}
                                        errorMessage={
                                          formField.controllerName ===
                                          "username"
                                            ? userLabels.userExists
                                            : userLabels.userEmailExists
                                        }
                                        showHeading
                                        isRequired
                                        isLoading={
                                          formField.controllerName ===
                                          "username"
                                            ? isLoading
                                            : isUserEmailLoading
                                        }
                                        headingText={formField.label}
                                        textFieldType={
                                          formField?.textFieldType || "text"
                                        }
                                        searchName={
                                          formField.controllerName ===
                                          "username"
                                            ? searchUserName
                                            : searchUserEmail
                                        }
                                      />
                                    ) : (
                                      <FormTextFieldController
                                        key={formField.controllerName}
                                        controllerName={
                                          formField.controllerName
                                        }
                                        label={formField.label}
                                        isDisabled={
                                          formMode === "view" ||
                                          (formMode === "edit" &&
                                            formField.controllerName === "id")
                                        }
                                        errorMessage={`${formField.label} is missing`}
                                        showHeading
                                        headingText={formField.label}
                                        textFieldType={
                                          formField?.textFieldType || "text"
                                        }
                                        isRequired={formField.isRequired!}
                                      />
                                    )}
                                  </Grid>
                                  {index === fields.length - 1 && (
                                    <Grid
                                      item
                                      sm={5}
                                      xs={10}
                                      container
                                      direction="column"
                                    >
                                      <Box width={1} />
                                    </Grid>
                                  )}
                                </Fragment>
                              );
                            })}
                          </Grid>
                        </FormControl>
                      </Box>

                      <Stack
                        direction="row"
                        spacing={4}
                        width="100%"
                        paddingY={4}
                        justifyContent="center"
                      >
                        {formMode === "view" ? (
                          <FormLoadingButton
                            buttonVariant="contained"
                            isLoading={false}
                            id="cancel"
                            paddingY={0}
                            backgroundColor="primary.green"
                            onClickEvent={handleCancelEvent}
                          >
                            {userLabels.cancel}
                          </FormLoadingButton>
                        ) : (
                          <>
                            <FormLoadingButton
                              buttonVariant="contained"
                              isLoading={false}
                              id="cancel"
                              paddingY={0}
                              backgroundColor="primary.green"
                              onClickEvent={handleCancelEvent}
                            >
                              {userLabels.cancel}
                            </FormLoadingButton>
                            <FormLoadingButton
                              buttonType="submit"
                              buttonVariant="contained"
                              isLoading={isAddingUser || isUpdatingUser}
                              id="save"
                              paddingY={0}
                              backgroundColor="primary.green"
                            >
                              {userLabels.save}
                            </FormLoadingButton>
                          </>
                        )}
                      </Stack>
                    </form>
                  </FormProvider>
                </Grid>
              </Grid>
            </ContainerLayout>
          )}
          <ConfirmationDailog
            isOpen={shouldShowDialog}
            label={labels.cancelUserConfirmation}
            handleAction={handleConfirmationAction}
          />
        </Fragment>
      )}
    </Fragment>
  );
};

export default UserForm;
