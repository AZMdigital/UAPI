import { Fragment, SetStateAction, useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import { useRouter } from "next/router";
import { useQueryClient } from "@tanstack/react-query";

import { handleSuccessMessage } from "~/utils/helper";
import {
  PERMISSION_ROLE_ADD,
  PERMISSION_ROLE_DELETE,
  PERMISSION_ROLE_EDIT,
} from "~/utils/permissionsConstants";

import { useAppDispatch, useAppSelector } from "~/state/hooks";

import {
  useDeleteRole,
  useGetRolesWithSearch,
} from "~/rest/apiHooks/roles/useRoles";
import { RoleType } from "~/rest/models/role";

import { rolesColumns } from "~/modules/rolesManagement/utils/helper";
import { labels } from "~/modules/rolesManagement/utils/labels";

import ConfirmationDailog from "~/core/components/ConfirmationDialog";
import SearchTextField from "~/core/components/FormComponents/SearchTextField";
import ContainerLayout from "~/core/components/Layouts/ContainerLayout";
import TableComponent from "~/core/components/Table";
import UnAuthorizeView from "~/core/components/UnAuthorizesView";
import { toggleModal } from "~/core/state/coreSlice";
import { setCurrentRole } from "~/core/state/rolesSlice";
import { FormModes, paths } from "~/core/utils/helper";

const RolesManagement = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const { mutate: deleteOneRole, isLoading: isDeleting } = useDeleteRole();
  const [shouldShowDialog, setShowDialog] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState(0);
  const [selectedRoleData, setSelectedRoleData] = useState<RoleType>();
  const [isShowUnAuthView, setShowUnAuthView] = useState(false);
  const [roleNameStr, setRoleNameStr] = useState("");
  const [isSearchLoading, setSearchLoading] = useState(false);
  const [shouldTriggerRefetch, setTriggerRefetch] = useState(false);
  const user = useAppSelector((state) => state.core.userInfo);
  const isSuperAdmin: any = user?.isSuperAdmin;

  const userPermissions = useAppSelector(
    (state) => state.core.userRolePermissions
  );

  const userPermissionsStrings: string[] = userPermissions.map(
    (permission) => permission as unknown as string
  );

  const hasRoleAddPermission: boolean =
    userPermissionsStrings.includes(PERMISSION_ROLE_ADD);

  const hasRoleEditPermission: boolean =
    userPermissionsStrings.includes(PERMISSION_ROLE_EDIT);

  const hasRoleDeletePermission: boolean = userPermissionsStrings.includes(
    PERMISSION_ROLE_DELETE
  );

  const {
    mutateAsync: getRoleData,
    data: data,
    isLoading: isRoleLoading,
  } = useGetRolesWithSearch();

  useEffect(() => {
    getRoleData(
      { roleName: roleNameStr },
      {
        onSuccess: () => {
          setSearchLoading(false);
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
  }, [roleNameStr, shouldTriggerRefetch]);

  useEffect(() => {
    if (data) {
      setSearchLoading(false);
      setShowUnAuthView(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const navigateToRolesForm = () => {
    // Clear Selected Role
    dispatch(setCurrentRole(undefined));
    router.push(paths.createRole);
  };

  const deleteSelectedRole = (roleId: number) => {
    setSelectedRoleId(roleId);
    const selectedRoleData = data.filter(
      (role: RoleType) => role.id === roleId
    );
    setSelectedRoleData(selectedRoleData[0]);
    setShowDialog(true);
  };

  const onEdit = (input: RoleType) => {
    dispatch(
      toggleModal({
        title: labels.editRole,
        formMode: FormModes.EDIT,
      })
    );
    dispatch(setCurrentRole(input));
    router.push(paths.createRole);
  };

  const onView = (input: RoleType) => {
    dispatch(
      toggleModal({
        title: labels.viewRole,
        formMode: FormModes.VIEW,
      })
    );
    dispatch(setCurrentRole(input));
    router.push(paths.createRole);
  };

  const handleDeleteAction = (confirmationStatus: boolean) => {
    if (confirmationStatus) {
      setShowDialog(false);
      deleteOneRole(
        { roleId: selectedRoleId },
        {
          onSuccess: () => {
            queryClient.invalidateQueries(["getRoles"]);
            setTriggerRefetch((value) => !value);
            handleSuccessMessage(
              `Role '${selectedRoleData?.name ?? ""}'`,
              "deleted"
            );
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
    } else {
      setShowDialog(false);
    }
  };

  const handleSearch = (query: SetStateAction<string>) => {
    // Set the query
    setRoleNameStr(query);
    // start the loader
    if (query) setSearchLoading(true);
  };

  return (
    <Fragment>
      {isShowUnAuthView ? (
        <UnAuthorizeView hideHomeBtn />
      ) : (
        <Fragment>
          <ContainerLayout
            buttonLabel={labels.addRole}
            buttonAction={navigateToRolesForm}
            breadCrumbs={[labels.rolesPermissions]}
            showButton={hasRoleAddPermission || isSuperAdmin}
          >
            <Grid item container xs={8}>
              <Grid item xs={4}>
                <SearchTextField
                  searchPlaceHolder={labels.searchRole}
                  onSearch={handleSearch}
                  interval={300}
                  isSearchLoading={isSearchLoading}
                />
              </Grid>
            </Grid>
            <Grid item container xs={12} columnGap={2}>
              <Grid item xs={12}>
                <TableComponent
                  columns={rolesColumns}
                  rows={data}
                  columnHeaderHeight={48}
                  loading={isRoleLoading}
                  deleting={isDeleting}
                  showDeleteButton={hasRoleDeletePermission || isSuperAdmin}
                  onDelete={deleteSelectedRole}
                  showEditButton={hasRoleEditPermission || isSuperAdmin}
                  onEdit={onEdit}
                  showViewButton
                  onView={onView}
                  actions
                  showActionTitle
                />
              </Grid>
            </Grid>
          </ContainerLayout>
          <ConfirmationDailog
            isOpen={shouldShowDialog}
            label={`${labels.roleDeleteConfirmation}'${
              selectedRoleData?.name ?? ""
            }'?`}
            handleAction={handleDeleteAction}
          />
        </Fragment>
      )}
    </Fragment>
  );
};

export default RolesManagement;
