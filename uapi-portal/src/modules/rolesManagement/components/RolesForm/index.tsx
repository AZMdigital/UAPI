import { Fragment, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import { useRouter } from "next/router";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQueryClient } from "@tanstack/react-query";

import { Status } from "~/config/appConfig";

import { handleSuccessMessage } from "~/utils/helper";

import { useAppSelector } from "~/state/hooks";

import {
  useGetAllPermissions,
  useGetAllRoles,
  usePermissionsByRole,
  useSaveRole,
  useUpdateRole,
} from "~/rest/apiHooks/roles/useRoles";
import { PermissionType, RoleType } from "~/rest/models/role";

import RolesPermissions from "~/modules/rolesManagement/components/RolesPermissions";
import { rolesFormFields } from "~/modules/rolesManagement/utils/helper";
import { labels } from "~/modules/rolesManagement/utils/labels";
import { rolesFormSchema } from "~/modules/rolesManagement/utils/rolesFormSchema";

import { AppHead } from "~/core/components/Apphead";
import FormLoadingButton from "~/core/components/Buttons/FormLoadingButton";
import ConfirmationDailog from "~/core/components/ConfirmationDialog";
import DropDownController from "~/core/components/FormComponents/DropDownComponent";
import FormTextFieldController from "~/core/components/FormComponents/FormTextField";
import SearchTextFieldComponent from "~/core/components/FormComponents/SearchTextFieldComponent";
import ContainerLayout from "~/core/components/Layouts/ContainerLayout";
import LoadingView from "~/core/components/LoadingView";
import { MenuItemStyle } from "~/core/components/style";
import UnAuthorizeView from "~/core/components/UnAuthorizesView";
import { Field, paths } from "~/core/utils/helper";

const RolesForm = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: permissionsData, isLoading: isPermissionsLoading } =
    useGetAllPermissions();
  const { mutateAsync: getAllRolesData, isLoading: isAllRolesLoading } =
    useGetAllRoles();
  const {
    mutateAsync: getPermissionByRole,
    data: rolesPermissionsData,
    isLoading: isRolePermissionLoading,
    error,
    isError,
  } = usePermissionsByRole();
  const { mutate: addRole, isLoading: isAddingRole } = useSaveRole();
  const { mutate: updateRole, isLoading: isUpdatingRole } = useUpdateRole();
  const [allPermissions, setAllPermissions] = useState<PermissionType[]>([]);
  const formMode = useAppSelector((state) => state.core.formMode);
  const pagetitle = useAppSelector((state) => state.core.modalTitle);
  const selectedRole: any = useAppSelector((state) => state.roles.currentRole);
  const [fields] = useState([...rolesFormFields]);
  const [isRoleNameValid, setRoleNameValidity] = useState(false);
  const [isShowUnAuthView, setShowUnAuthView] = useState(false);
  const [shouldShowDialog, setShowDialog] = useState(false);
  const [permissions, setPermissions]: any = useState([]);
  const [checked, setChecked]: any = useState({});
  const [groupChecked, setGroupChecked]: any = useState({});
  const [rolePermissions, setRolePermissions]: any = useState([]);
  const [hasAllChecked, setAllChecked] = useState(false);

  useEffect(() => {
    if (rolesPermissionsData) {
      setRolePermissions(rolesPermissionsData);
    }
  }, [rolesPermissionsData]);

  useEffect(() => {
    if (allPermissions) {
      setPermissions(allPermissions);
    }

    const areAllPermissionsChecked = (initialChecked: any) => {
      return Object.values(initialChecked).every(
        (isChecked) => isChecked === true
      );
    };

    if (formMode === "edit" || formMode === "view") {
      const initialChecked: any = {};
      const initialGroupChecked: any = {};
      permissions.forEach((perm: any) => {
        const isChecked = rolePermissions.some(
          (rolePerm: any) => rolePerm.handle === perm.handle
        );
        initialChecked[perm.id] = isChecked;
        const groupName = perm?.permissionGroup?.name;
        if (!initialGroupChecked[groupName]) {
          initialGroupChecked[groupName] = {
            checked: false,
            indeterminate: false,
            total: 0,
            checkedCount: 0,
          };
        }

        initialGroupChecked[groupName].total += 1;
        if (isChecked) {
          initialGroupChecked[groupName].checkedCount += 1;
        }
      });
      Object.keys(initialGroupChecked).forEach((groupName) => {
        const group = initialGroupChecked[groupName];
        if (group.checkedCount === group.total) {
          group.checked = true;
          group.indeterminate = false;
        } else if (group.checkedCount > 0) {
          group.checked = false;
          group.indeterminate = true;
        } else {
          group.checked = false;
          group.indeterminate = false;
        }
        delete group.total;
        delete group.checkedCount;
      });
      setChecked(initialChecked);
      setGroupChecked(initialGroupChecked);
      const hasAllCheckedValues = areAllPermissionsChecked(initialChecked);
      setAllChecked(hasAllCheckedValues);
    } else {
      const initialChecked: any = {};
      const initialGroupChecked: any = {};
      permissions.forEach((perm: any) => {
        initialChecked[perm.id] = false;
        const groupName = perm?.permissionGroup?.name;
        if (!initialGroupChecked[groupName]) {
          initialGroupChecked[groupName] = {
            checked: false,
            indeterminate: false,
          };
        }
      });
      setChecked(initialChecked);
      setGroupChecked(initialGroupChecked);
    }
  }, [allPermissions, formMode, permissions, rolePermissions]);

  const getDefaultValues = () => {
    if (formMode === "view" || formMode === "edit") {
      return {
        ...selectedRole!,
        id: selectedRole.roleCode,
        isActive: selectedRole?.isActive ? Status.ACTIVE : Status.IN_ACTIVE,
        permissions: [],
        permissionOptions: "",
      };
    } else {
      return {
        permissions: [],
        isActive: Status.ACTIVE,
        permissionOptions: "",
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
    resolver: yupResolver(rolesFormSchema, {
      abortEarly: false,
    }),
  });

  const searchRole = async (name: string): Promise<boolean> => {
    try {
      const nameStr = name.replace(/\s/g, "");
      const allRoles = await getAllRolesData({ roleName: name });
      const filteredArray = allRoles?.filter(
        (key: RoleType) =>
          key.name.toLowerCase().trim() === nameStr.toLowerCase().trim()
      );
      if (filteredArray!.length > 0) {
        setRoleNameValidity(false);
        return false;
      } else {
        setRoleNameValidity(true);
        return true;
      }
    } catch (error) {
      setRoleNameValidity(false);
      return false;
    }
  };

  useEffect(() => {
    if (formMode === "view" || formMode === "edit") {
      setRoleNameValidity(true);
      getPermissionByRole({ roleId: selectedRole?.id as number });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (rolesPermissionsData) {
      setShowUnAuthView(false);
    }
    if (error) {
      const errorObj: any = error;
      const status =
        errorObj?.error?.response?.status || errorObj?.response?.status;
      if (status === 403) {
        setShowUnAuthView(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rolesPermissionsData, error, isError]);

  useEffect(() => {
    if (permissionsData) {
      setAllPermissions(permissionsData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permissionsData]);

  const { getValues, handleSubmit } = methods;

  const createRole = (rolesData: any) => {
    addRole(
      {
        rolesData,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(["getRoles", "getRolesWithSearch"]);
          handleSuccessMessage(`Role '${rolesData.name}'`, "created");
          router.push(paths.roles);
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

  const updateSpecificRole = (rolesData: any, id: any) => {
    updateRole(
      {
        rolesData,
        id,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(["getRoles", "getRolesWithSearch"]);
          handleSuccessMessage(`Role '${rolesData.name}'`, "Updated");
          router.push(paths.roles);
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

  const alterSubmitValues = (existingValues: any) => {
    const alteredData = JSON.parse(JSON.stringify(existingValues));
    alteredData.active = alteredData.isActive === Status.ACTIVE;
    delete alteredData.isActive;
    delete alteredData.permissionOptions;
    alteredData.permissions = getCheckedPermissions(permissions);
    return alteredData;
  };

  const onSubmitHandler = () => {
    const values = getValues();

    if (isRoleNameValid) {
      if (formMode === "edit") {
        updateSpecificRole(alterSubmitValues(values), selectedRole?.id);
      } else {
        createRole(alterSubmitValues(values));
      }
    }
  };

  const handleCancelEvent = () => {
    if (formMode === "view") {
      router.push(paths.roles);
    } else {
      // show dialog
      setShowDialog(true);
    }
  };

  const handleConfirmationAction = (confirmationStatus: boolean) => {
    if (confirmationStatus) {
      setShowDialog(false);
      router.push(paths.roles);
    } else {
      setShowDialog(false);
    }
  };

  const getCheckedPermissions = (permissions: any) => {
    return permissions
      .filter((perm: any) => checked[perm.id])
      .map((perm: any) => perm.handle);
  };

  const onSubmit = handleSubmit(onSubmitHandler);

  const renderFormComponent = (field: Field) => {
    const { controllerName, label, type, isRequired } = field;
    switch (controllerName) {
      case "id":
        return (
          formMode !== "create" && (
            <Grid item sm={5} xs={10} container direction="column">
              <FormTextFieldController
                key={controllerName}
                controllerName={controllerName}
                label={label}
                isDisabled
                errorMessage={`${label}is missing`}
                isRequired={isRequired}
                textFieldType={type}
                showHeading
                headingText={label}
              />
            </Grid>
          )
        );

      case "permissions":
        return (
          <Grid item sm={5} xs={10} container direction="column">
            <RolesPermissions
              permissions={permissions}
              checked={checked}
              setPermissions={setPermissions}
              setChecked={setChecked}
              groupChecked={groupChecked}
              setGroupChecked={setGroupChecked}
              getCheckedPermissions={getCheckedPermissions}
              formMode={formMode}
              hasAllChecked={hasAllChecked}
              setAllChecked={setAllChecked}
            />
          </Grid>
        );

      // Move "isActive" case before "permissions"
      case "isActive":
        return (
          <Grid item sm={5} xs={10} container direction="column">
            <DropDownController
              controllerName={controllerName}
              label={label}
              disabled={formMode === "view"}
              isRequired={isRequired!}
            >
              <MenuItem value={Status.ACTIVE} sx={MenuItemStyle}>
                {labels.active}
              </MenuItem>
              <MenuItem value={Status.IN_ACTIVE} sx={MenuItemStyle}>
                {labels.inActive}
              </MenuItem>
            </DropDownController>
          </Grid>
        );

      default:
        return (
          <Grid item sm={5} xs={10} container direction="column">
            <SearchTextFieldComponent
              key={controllerName}
              controllerName={controllerName}
              label={label}
              isDisabled={formMode === "view"}
              errorMessage={labels.roleAlreadyExist}
              isRequired={isRequired!}
              textFieldType={type}
              showHeading
              isLoading={isAllRolesLoading}
              headingText={label}
              searchName={searchRole}
            />
          </Grid>
        );
    }
  };

  return (
    <Fragment>
      <AppHead title={pagetitle} />
      {isPermissionsLoading || isRolePermissionLoading ? (
        <LoadingView height="50vh" />
      ) : (
        <Fragment>
          {isShowUnAuthView ? (
            <UnAuthorizeView hideHomeBtn />
          ) : (
            <ContainerLayout breadCrumbs={[labels.rolesPermissions, pagetitle]}>
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
                                  {renderFormComponent(formField)}

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
                            {labels.cancel}
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
                              {labels.cancel}
                            </FormLoadingButton>
                            <FormLoadingButton
                              buttonType="submit"
                              buttonVariant="contained"
                              isLoading={isAddingRole || isUpdatingRole}
                              id="save"
                              paddingY={0}
                              backgroundColor="primary.green"
                            >
                              {labels.save}
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
        </Fragment>
      )}
      <ConfirmationDailog
        isOpen={shouldShowDialog}
        label={labels.cancelRoleConfirmation}
        handleAction={handleConfirmationAction}
      />
    </Fragment>
  );
};
export default RolesForm;
