import { Fragment, SetStateAction, useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import { useRouter } from "next/router";

import { handleSuccessMessage } from "~/utils/helper";
import {
  PERMISSION_USER_ADD,
  PERMISSION_USER_DELETE,
  PERMISSION_USER_EDIT,
} from "~/utils/permissionsConstants";

import { useAppDispatch, useAppSelector } from "~/state/hooks";

import { useDeleteUser } from "~/rest/apiHooks";
import { useGetAllAccountUsersWithPagination } from "~/rest/apiHooks/user/useUser";
import { UserInputType } from "~/rest/models/user";

import { userColumns } from "~/modules/users/utils/helper";
import { labels } from "~/modules/users/utils/labels";

import ConfirmationDailog from "~/core/components/ConfirmationDialog";
import SearchTextField from "~/core/components/FormComponents/SearchTextField";
import ContainerLayout from "~/core/components/Layouts/ContainerLayout";
import TableComponent from "~/core/components/Table";
import UnAuthorizeView from "~/core/components/UnAuthorizesView";
import { toggleModal } from "~/core/state/coreSlice";
import { setCurrentUser } from "~/core/state/userSlice";
import { convertToTitleCase, FormModes, paths } from "~/core/utils/helper";

const Users = () => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const router = useRouter();
  const dispatch = useAppDispatch();
  const { mutate: deleteOneUser, isLoading: isDeleting } = useDeleteUser();
  const [shouldShowDialog, setShowDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(0);
  const [usersData, setUserData] = useState<any[]>([]);
  const [totalRowCount, setTotalRowCount] = useState(0);
  const [searchUserStr, setSearchUserStr] = useState("");
  const [selectedUserData, setSelectedUserData] = useState<UserInputType>();
  const [isShowUnAuthView, setShowUnAuthView] = useState(false);
  const [shouldTriggerRefetch, setTriggerRefetch] = useState(false);

  const user = useAppSelector((state) => state.core.userInfo);

  const isSuperAdmin: any = user?.isSuperAdmin;

  const {
    mutateAsync: getAllAccountUsers,
    data: usersDataList,
    isLoading: isUserDataLoading,
  } = useGetAllAccountUsersWithPagination();

  const [isSearchLoading, setSearchLoading] = useState(false);

  const userPermissions = useAppSelector(
    (state) => state.core.userRolePermissions
  );

  const userPermissionsStrings: string[] = userPermissions.map(
    (permission) => permission as unknown as string
  );

  const hasUserAddPermission: boolean =
    userPermissionsStrings.includes(PERMISSION_USER_ADD);

  const hasUserDeletePermission: boolean = userPermissionsStrings.includes(
    PERMISSION_USER_DELETE
  );

  const hasUserEditPermission: boolean =
    userPermissionsStrings.includes(PERMISSION_USER_EDIT);

  useEffect(() => {
    dispatch(setCurrentUser(undefined));
  }, [dispatch]);

  const deleteSelectedUser = (userId: number) => {
    setSelectedUserId(userId);
    const selectedUser = usersData.filter(
      (user: UserInputType) => user.id === userId
    );
    setSelectedUserData(selectedUser[0]);
    setShowDialog(true);
  };

  const handleSearch = (query: SetStateAction<string>) => {
    // Set the query
    setSearchUserStr(query);

    // start the loader
    if (query) setSearchLoading(true);

    // Reset the Pagination
    setPaginationModel({ page: 0, pageSize: 10 });
  };

  const getUserName = () => {
    return `${selectedUserData?.firstName} ${selectedUserData?.lastName}` ?? "";
  };

  const handleDeleteAction = (confirmationStatus: boolean) => {
    if (confirmationStatus) {
      setShowDialog(false);
      deleteOneUser(
        { userId: selectedUserId, accountId: user?.company.id as number },
        {
          onSuccess: () => {
            setTriggerRefetch((value) => !value);
            handleSuccessMessage(`User '${getUserName()}'`, "deleted");
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

  useEffect(() => {
    setShowUnAuthView(false);
    getAllAccountUsers(
      {
        query: searchUserStr,
        pageNumber: paginationModel.page,
        pageSize: paginationModel.pageSize,
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
    // setTriggerRefetch(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationModel.page, searchUserStr, shouldTriggerRefetch]);

  const extractUserData: (array: any[]) => any[] = (array) => {
    return array.map((obj) => {
      const mergedObj: any = {
        ...obj,
        roleName: obj.role?.name,
      };
      return mergedObj;
    });
  };

  useEffect(() => {
    if (usersDataList) {
      setTotalRowCount(usersDataList.count);
      setSearchLoading(false);
      setUserData(extractUserData(usersDataList.users));
      setShowUnAuthView(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usersDataList]);

  const onEdit = (input: UserInputType) => {
    dispatch(
      toggleModal({
        title: labels.updateUser,
        formMode: FormModes.EDIT,
      })
    );
    dispatch(setCurrentUser(input));
    router.push(paths.createUserPage);
  };

  const onView = (input: UserInputType) => {
    dispatch(
      toggleModal({
        title: labels.viewUser,
        formMode: FormModes.VIEW,
      })
    );
    dispatch(setCurrentUser(input));
    router.push(paths.createUserPage);
  };

  const navigateToUserCreation = () => {
    router.push(paths.createUserPage);
  };
  return (
    <Fragment>
      {isShowUnAuthView ? (
        <UnAuthorizeView hideHomeBtn />
      ) : (
        <Fragment>
          <ContainerLayout
            buttonLabel={labels.addUser}
            buttonAction={navigateToUserCreation}
            breadCrumbs={[labels.manageUsers]}
            id={labels.addUser}
            showButton={isSuperAdmin || hasUserAddPermission}
          >
            <Grid item container>
              <Grid item xs={4}>
                <SearchTextField
                  searchPlaceHolder={labels.searchUsers}
                  onSearch={handleSearch}
                  interval={300}
                  isSearchLoading={isSearchLoading}
                />
              </Grid>
            </Grid>
            <Grid item marginTop={1}>
              <TableComponent
                columnHeaderHeight={48}
                columns={userColumns}
                rows={usersData}
                loading={isUserDataLoading}
                onDelete={deleteSelectedUser}
                onEdit={onEdit}
                showDeleteButton={isSuperAdmin || hasUserDeletePermission}
                showEditButton={isSuperAdmin || hasUserEditPermission}
                showViewButton
                onView={onView}
                deleting={isDeleting}
                actions
                rowCount={totalRowCount}
                paginationMode="server"
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
              />
            </Grid>
          </ContainerLayout>
          <ConfirmationDailog
            isOpen={shouldShowDialog}
            label={`${labels.userDeleteConfirmation}'${convertToTitleCase(
              getUserName()
            )}'?`}
            handleAction={handleDeleteAction}
          />
        </Fragment>
      )}
    </Fragment>
  );
};

export default Users;
