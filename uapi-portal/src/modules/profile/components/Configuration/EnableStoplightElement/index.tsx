import { Fragment, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { handleSuccessMessage } from "~/utils/helper";
import { PERMISSION_CONFIGURATION_EDIT } from "~/utils/permissionsConstants";

import { useAppSelector } from "~/state/hooks";

import {
  useGetCompanyConfiguration,
  useSaveCompanyConfiguration,
} from "~/rest/apiHooks";

import {
  CompanyConfiguration,
  EnableStoplightElementsProps,
} from "~/modules/profile/interface/profile";
import { labels } from "~/modules/profile/utils/labels";

import ToggleSwitch from "~/core/components/Switch";

export default function EnableStoplightElement({
  EnableStoplightElements,
}: EnableStoplightElementsProps) {
  const user = useAppSelector((state) => state.core.userInfo);
  const userPermissions = useAppSelector(
    (state) => state.core.userRolePermissions
  );

  const [isToggleChecked, setToggleChecked] = useState(false);
  const [isConfigurationResult, setConfigurationResult] = useState(false);

  const userPermissionsStrings: string[] = userPermissions.map(
    (permission) => permission as unknown as string
  );

  const hasConfigurationEditPermission: boolean =
    userPermissionsStrings.includes(PERMISSION_CONFIGURATION_EDIT);
  const isSuperAdmin: any = user?.isSuperAdmin;

  const { data, isSuccess, isError } = useGetCompanyConfiguration(
    user?.company.id as number,
    "ENABLE_STOPLIGHT_ELEMENTS",
    { enabled: true }
  );

  const {
    mutate: saveCompanyConfiguration,
    data: saveCompanyConfigurationData,
  } = useSaveCompanyConfiguration();

  useEffect(() => {
    if (isSuccess) {
      if (data) {
        setToggleChecked(data.configValue.toLowerCase() === "true");
        setConfigurationResult(true);
      } else {
        setToggleChecked(false);
        setConfigurationResult(true);
      }
    } else if (isError) {
      setToggleChecked(false);
      setConfigurationResult(true);
    }
  }, [data, isSuccess, isError]);

  useEffect(() => {
    if (saveCompanyConfigurationData) {
      setToggleChecked(
        saveCompanyConfigurationData.configValue.toLowerCase() === "true"
      );
      handleSuccessMessage(
        labels.enableStoplightElements,
        saveCompanyConfigurationData.configValue.toLowerCase() === "true"
          ? labels.enabled
          : labels.disabled
      );
    }
  }, [saveCompanyConfigurationData]);

  const saveConfiguration = (configuration: CompanyConfiguration) => {
    saveCompanyConfiguration({
      configuration,
    });
  };

  const handleToggle = (value: boolean) => {
    const configurationData = {} as CompanyConfiguration;
    configurationData.configurationId = EnableStoplightElements?.id;
    configurationData.configurationValue = value;
    saveConfiguration(configurationData);
  };

  return (
    <Fragment>
      <Grid item xs={12}>
        {!isConfigurationResult ? (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            paddingTop={7}
          >
            <CircularProgress size={40} />
          </Box>
        ) : (
          <Card elevation={0}>
            <CardContent>
              <Grid container xs={12} direction="row">
                <Grid item xs={0.4} minWidth={60} height="auto">
                  <ToggleSwitch
                    isChecked={isToggleChecked}
                    handleChecked={handleToggle}
                    disabled={!(isSuperAdmin || hasConfigurationEditPermission)}
                  />
                </Grid>
                <Grid item xs={11}>
                  <Stack direction="column">
                    <Typography
                      variant="h1"
                      color="primary.main"
                      marginBottom={2}
                    >
                      {EnableStoplightElements?.name}
                    </Typography>
                    <Typography
                      variant="h4"
                      color="primary.blackishGray"
                      marginBottom={2}
                    >
                      {labels.enableStoplightElementsDescription}
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}
      </Grid>
    </Fragment>
  );
}
