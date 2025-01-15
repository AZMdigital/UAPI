import { Fragment, useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";

import { useGetConfiguration } from "~/rest/apiHooks/configuration/useConfiguration";

import DigitalSignature from "~/modules/profile/components/Configuration/DigitalSignature";
import EnableStoplightElement from "~/modules/profile/components/Configuration/EnableStoplightElement";
import MutualAuthentication from "~/modules/profile/components/Configuration/MutualAuthentication";
import { configurationList } from "~/modules/profile/utils/helper";

import LoadingView from "~/core/components/LoadingView";
import UnAuthorizeView from "~/core/components/UnAuthorizesView";

export default function Configuration() {
  const { data, isFetching, error, isError } = useGetConfiguration();
  const [configurationLists, setConfigurationList] =
    useState(configurationList);
  const [isShowConfiguration, setShowConfiguration] = useState(false);
  const [isShowUnAuthView, setShowUnAuthView] = useState(false);

  useEffect(() => {
    if (data) {
      const configurations = configurationLists;
      setConfigurationList(configurations);
      setShowConfiguration(true);
      setShowUnAuthView(false);
    }
  }, [configurationLists, data, isFetching]);

  useEffect(() => {
    if (isError) {
      const errorObj: any = error;
      const status =
        errorObj?.error?.response?.status || errorObj?.response?.status;
      if (status === 403) {
        setShowConfiguration(true);
        setShowUnAuthView(true);
      }
    }
  }, [error, isError]);

  const getConfigValue = (handle: string) => {
    return data?.find((item: any) => item.handle === handle);
  };

  return (
    <Fragment>
      {isFetching && !isShowConfiguration ? (
        <LoadingView height="100vh" />
      ) : (
        <Fragment>
          {isShowUnAuthView && isShowConfiguration ? (
            <UnAuthorizeView />
          ) : (
            <Stack direction="row" spacing={4}>
              <Grid container xs={12}>
                {data && (
                  <Fragment>
                    <MutualAuthentication />
                    <DigitalSignature
                      DigitalSignature={getConfigValue("DIGITAL_SIGNATURE")}
                    />
                    <EnableStoplightElement
                      EnableStoplightElements={getConfigValue(
                        "ENABLE_STOPLIGHT_ELEMENTS"
                      )}
                    />
                  </Fragment>
                )}
              </Grid>
            </Stack>
          )}
        </Fragment>
      )}
    </Fragment>
  );
}
