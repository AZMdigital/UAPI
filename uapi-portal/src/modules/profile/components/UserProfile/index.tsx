import { useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useQuery } from "@tanstack/react-query";

import { Status } from "~/config/appConfig";

import { useAppDispatch, useAppSelector } from "~/state/hooks";

import { getProfile } from "~/rest/apiHooks/auth/useAuth";

import { labels } from "~/modules/profile/utils/labels";

import LoadingView from "~/core/components/LoadingView";
import { setUserInfo } from "~/core/state/coreSlice";

const UserProfile = () => {
  const dispatch = useAppDispatch();
  const { data, isLoading } = useQuery(["getProfile"], () => getProfile());
  const user = useAppSelector((state) => state.core.userInfo);

  useEffect(() => {
    if (data) {
      dispatch(setUserInfo({ userInfo: data }));
    }
  }, [dispatch, data]);

  return (
    <Box display="flex" alignItems="center" justifyContent="center">
      {isLoading ? (
        <LoadingView />
      ) : (
        <Grid container>
          <Grid
            item
            container
            display="flex"
            flexDirection="row"
            alignItems="center"
          >
            <Avatar sx={{ height: 78, width: 78 }} />
            <Stack marginLeft="30px">
              <Typography variant="h1">
                {`${user?.firstName} ${user?.lastName}`}
              </Typography>
              <Typography variant="h6" color="secondary.grayTextShade">
                {user?.userType === "COMPANY_USER"
                  ? labels.companyUser
                  : labels.azmSupportUser}
              </Typography>
            </Stack>
          </Grid>
          <Grid
            item
            container
            height="435px"
            sx={{ backgroundColor: "secondary.main" }}
            padding={5}
            marginTop="23px"
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <Grid
              item
              md={5}
              xs={12}
              sm={12}
              display="flex"
              flexDirection="column"
              paddingLeft={8.5}
            >
              <Typography
                variant="h2"
                color="secondary.grayTextShade"
                paddingBottom={0.5}
              >
                {labels.name}
              </Typography>
              <Typography variant="h2">
                {`${user?.firstName} ${user?.lastName}`}
              </Typography>
            </Grid>

            <Grid
              item
              md={5}
              xs={12}
              sm={12}
              display="flex"
              flexDirection="column"
              paddingLeft={8.5}
            >
              <Typography
                variant="h2"
                color="secondary.grayTextShade"
                paddingBottom={0.5}
              >
                {labels.email}
              </Typography>
              <Typography variant="h2">{user?.email}</Typography>
            </Grid>

            <Grid
              item
              md={5}
              xs={12}
              sm={12}
              display="flex"
              flexDirection="column"
              paddingLeft={8.5}
            >
              <Typography
                variant="h2"
                color="secondary.grayTextShade"
                paddingBottom={0.5}
              >
                {labels.address}
              </Typography>
              <Typography variant="h2">
                {`${user?.company?.address?.city?.name} , ${user?.company?.address?.country}`}
              </Typography>
            </Grid>

            <Grid
              item
              md={5}
              xs={12}
              sm={12}
              display="flex"
              flexDirection="column"
              paddingLeft={8.5}
            >
              <Typography
                variant="h2"
                color="secondary.grayTextShade"
                paddingBottom={0.5}
              >
                {labels.contact}
              </Typography>
              <Typography variant="h2">{user?.contactNo}</Typography>
            </Grid>
            <Grid
              item
              md={5}
              xs={12}
              sm={12}
              display="flex"
              flexDirection="column"
              paddingLeft={8.5}
            >
              <Typography
                variant="h2"
                color="secondary.grayTextShade"
                paddingBottom={0.5}
              >
                {labels.company}
              </Typography>
              <Typography variant="h2">{user?.company.companyName}</Typography>
            </Grid>

            <Grid
              item
              md={5}
              xs={12}
              sm={12}
              display="flex"
              flexDirection="column"
              paddingLeft={8.5}
            >
              <Typography
                variant="h2"
                color="secondary.grayTextShade"
                paddingBottom={0.5}
              >
                {labels.status}
              </Typography>
              <Typography
                variant="h2"
                color={user?.isActive ? "green" : "red"}
                textTransform="capitalize"
              >
                {user?.isActive ? Status.ACTIVE : Status.IN_ACTIVE}
              </Typography>
            </Grid>
            <Grid
              item
              md={5}
              xs={12}
              sm={12}
              display="flex"
              flexDirection="column"
              paddingLeft={8.5}
            >
              <Typography
                variant="h2"
                color="secondary.grayTextShade"
                paddingBottom={0.5}
              >
                {labels.role}
              </Typography>
              <Typography variant="h2">
                {user?.userType === "COMPANY_USER"
                  ? labels.companyUser
                  : labels.azmSupportUser}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default UserProfile;
