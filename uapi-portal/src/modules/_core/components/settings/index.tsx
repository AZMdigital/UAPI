import { Fragment, useEffect, useState } from "react";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import LogoutOutlined from "@mui/icons-material/LogoutOutlined";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";
import { useMutation } from "@tanstack/react-query";

import { resetAll } from "~/state/actions";
import { useAppDispatch, useAppSelector } from "~/state/hooks";

import { getProfile, logout } from "~/rest/apiHooks/auth/useAuth";
import { usePermissionsByRole } from "~/rest/apiHooks/roles/useRoles";

import { UserType } from "~/modules/profile/interface/profile";

import ConfirmationDailog from "~/core/components/ConfirmationDialog";
import { SettingListItemsInterface } from "~/core/components/interface";
import {
  saveSelection,
  setAuthUser,
  setMainAccountToken,
  setUserInfo,
  setUserRolePermissions,
} from "~/core/state/coreSlice";
import { iconStyle, paths } from "~/core/utils/helper";
import { labels } from "~/core/utils/labels";

const SettingsComponent = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const refreshToken = useAppSelector((state) => state.core.refreshToken);
  const user = useAppSelector((state) => state.core.userInfo);
  const [shouldShowSwitchAccountDialog, setShowSwitchAccountDialog] =
    useState(false);
  const {
    mutateAsync: getPermissionByRole,
    data: rolesPermissionsData,
    isLoading: isRolePermissionLoading,
  } = usePermissionsByRole();

  useEffect(() => {
    if (rolesPermissionsData) {
      dispatch(
        setUserRolePermissions(
          rolesPermissionsData.map((role: any) => role.name)
        )
      );
      dispatch(saveSelection(""));
      setShowSwitchAccountDialog(false);
      router.push(paths.homePage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rolesPermissionsData]);

  const { mutate: getUserInfo, isLoading: isUserInfoLoading } = useMutation(
    ["services"],
    () => getProfile(),
    {
      onSuccess: (data: UserType) => {
        dispatch(setUserInfo({ userInfo: data }));

        if (data.isSuperAdmin) {
          // If super admin by pass the flow because we don't have roles in it.
          dispatch(saveSelection(""));
          setShowSwitchAccountDialog(false);
          router.push(paths.homePage);
        } else {
          // Get user Roles here
          getPermissionByRole({ roleId: data.role.id as number });
        }
      },

      onError: () => {
        setShowSwitchAccountDialog(false);
      },
    }
  );

  const mainAccountToken = useAppSelector(
    (state) => state.core.mainAccountToken
  );
  const mainAccountRefreshToken = useAppSelector(
    (state) => state.core.mainAccountRefreshToken
  );
  const mainAccountValidity = useAppSelector(
    (state) => state.core.mainAccountValidity
  );
  const mainAccountRefreshValidity = useAppSelector(
    (state) => state.core.mainAccountRefreshValidity
  );
  const mainAccountTokenType = useAppSelector(
    (state) => state.core.mainAccountTokenType
  );

  const { mutate: userlogout, isSuccess } = useMutation(
    (refreshToken: string) => logout(refreshToken)
  );
  const logoutHandler = () => {
    if (refreshToken) userlogout(refreshToken);
  };
  const navigationHandler = (path: string) => {
    router.push(path);
  };

  const switchAccountHandler = () => {
    setShowSwitchAccountDialog(true);
  };

  const handleSwitchToMainAction = (confirmationStatus: boolean) => {
    if (confirmationStatus) {
      // Extract Main Account Credentails and replace them
      dispatch(
        setAuthUser({
          token: mainAccountToken,
          refreshToken: mainAccountRefreshToken,
          validity: mainAccountValidity,
          refreshValidity: mainAccountRefreshValidity,
          tokenType: mainAccountTokenType,
        })
      );
      dispatch(
        setMainAccountToken({
          mainAccountToken: null,
          mainAccountRefreshToken: null,
          mainAccountValidity: null,
          mainAccountRefreshValidity: null,
          mainAccountTokenType: null,
        })
      );
      // call Profile API
      getUserInfo();
    } else {
      setShowSwitchAccountDialog(false);
    }
  };

  const profileItem = {
    name: "Profile",
    icon: <Avatar sx={iconStyle} />,
    action: () => navigationHandler(paths.profilePage),
  };

  const switchAccountItem = {
    name: "Switch To Main Account",
    icon: <AssignmentIndIcon sx={iconStyle} />,
    action: () => switchAccountHandler(),
  };

  const checkSwitchAccount = (): SettingListItemsInterface | undefined => {
    if (mainAccountToken !== null) {
      return switchAccountItem;
    }
  };
  // const checkSwitchAccount = (): SettingListItemsInterface | undefined => {
  //   if (user?.company.accountType === AccountType.SUB) {
  //     return switchAccountItem;
  //   }
  //   console.log("user : ", user);
  // };

  const SETTING_LIST_ITEMS: SettingListItemsInterface[] = [
    {
      name: user ? `${user?.firstName} ${user?.lastName}` : "",
      email: user?.email,
      icon: <Avatar sx={{ height: 40, width: 40 }} />,
      action: null,
    },
    profileItem,
    ...(checkSwitchAccount()
      ? [checkSwitchAccount() as SettingListItemsInterface]
      : []),
    {
      name: "Signout",
      icon: <LogoutOutlined sx={iconStyle} />,
      action: () => logoutHandler(),
    },
  ];

  useEffect(() => {
    if (isSuccess) {
      dispatch(resetAll());
    }
  }, [isSuccess, dispatch, user]);
  return (
    <Fragment>
      <List
        sx={{
          width: 222,
          bgcolor: "secondary.main",
          padding: 0,
        }}
        component="nav"
      >
        {SETTING_LIST_ITEMS.map((item: any, index: number) => (
          <>
            <ListItemButton
              key={item.name}
              sx={{
                color: "primary.blackishGray",
                paddingY: 0.48,
                paddingX: index === 0 ? "5px" : "16px",
              }}
              onClick={item.action && item.action}
            >
              <ListItemIcon
                sx={{ color: "primary.blackishGray", minWidth: "30px" }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                sx={{ marginLeft: index === 0 ? "10px" : 0 }}
                primary={
                  <Box display="flex" flexDirection="column">
                    <Typography
                      fontSize="14px"
                      fontWeight={400}
                      fontFamily="SegoeUI"
                      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
                      lineHeight={index === 0 ? 0.6 : 1.5}
                    >
                      {item.name}
                    </Typography>
                    {index === 0 && (
                      <Typography
                        fontSize="8px"
                        fontWeight={400}
                        fontFamily="SegoeUI"
                        color="secondary.textGray"
                      >
                        {item.email}
                      </Typography>
                    )}
                  </Box>
                }
              />
            </ListItemButton>
            <Divider sx={{ display: !item?.divider ? "none" : "block" }} />
          </>
        ))}
      </List>
      <ConfirmationDailog
        isOpen={shouldShowSwitchAccountDialog}
        label={labels.accountSwitchConfirmation}
        showLoading={isRolePermissionLoading || isUserInfoLoading}
        handleAction={handleSwitchToMainAction}
      />
    </Fragment>
  );
};

export default SettingsComponent;
