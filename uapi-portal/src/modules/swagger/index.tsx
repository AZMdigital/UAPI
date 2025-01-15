import { Fragment, useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import dynamic from "next/dynamic";
import { API } from "@stoplight/elements";

import { labels } from "~/utils/labels";
import {
  PERMISSION_SERVICE_EXPLORE,
  PERMISSION_SERVICE_SUBSCRIBE,
} from "~/utils/permissionsConstants";

import { useAppDispatch, useAppSelector } from "~/state/hooks";

import { useGetCompanyConfiguration } from "~/rest/apiHooks/configuration/useConfiguration";
import { usePermissionsByRole } from "~/rest/apiHooks/roles/useRoles";
import { useGetSwaggerData } from "~/rest/apiHooks/swagger/useSwagger";
import { Services } from "~/rest/models/service";

import AugmentingLayout from "~/core/components/Layouts/AugmentingLayout";
import LoadingView from "~/core/components/LoadingView";
import UnAuthorizeView from "~/core/components/UnAuthorizesView";
import { setUserRolePermissions } from "~/core/state/coreSlice";
import { checkPermission } from "~/core/utils/helper";

import "swagger-ui-react/swagger-ui.css";

// Dynamically import SwaggerUI for client-side rendering
const SwaggerUI = dynamic(import("swagger-ui-react"), { ssr: false });

export default function ApiPage() {
  const user = useAppSelector((state) => state.core.userInfo);
  const dispatch = useAppDispatch();
  const [isShowUnAuthView, setShowUnAuthView] = useState(false);

  const {
    data: companyConfigData,
    isSuccess,
    isError,
  } = useGetCompanyConfiguration(
    user?.company.id as number,
    "ENABLE_STOPLIGHT_ELEMENTS",
    { enabled: true }
  );

  // Set the initial value of shouldUseSwagger based on the API response
  const [shouldUseSwagger, setShouldUseSwagger] = useState<boolean | undefined>(
    undefined
  );

  useEffect(() => {
    if (isSuccess && companyConfigData) {
      // Check if the configuration is enabled
      setShouldUseSwagger(
        companyConfigData.configValue.toLowerCase() === "false"
      );
    } else if ((isSuccess && !companyConfigData) || isError) {
      setShouldUseSwagger(true);
    }
  }, [companyConfigData, isSuccess, isError]);

  const {
    mutateAsync: getPermissionByRole,
    data: rolesPermissionsData,
    isLoading: isRolePermissionLoading,
  } = usePermissionsByRole();

  useEffect(() => {
    if (!user?.isSuperAdmin) {
      if (user?.role) {
        getPermissionByRole({ roleId: user?.role.id as number });
      }
    }
  }, [user?.isSuperAdmin, user?.role, getPermissionByRole]);

  useEffect(() => {
    if (rolesPermissionsData) {
      dispatch(
        setUserRolePermissions(
          rolesPermissionsData.map((role: any) => role.name)
        )
      );
      if (
        checkPermission(
          PERMISSION_SERVICE_EXPLORE,
          rolesPermissionsData.map((role: any) => role.name)
        ) ||
        checkPermission(
          PERMISSION_SERVICE_SUBSCRIBE,
          rolesPermissionsData.map((role: any) => role.name)
        )
      ) {
        setShowUnAuthView(false);
      } else {
        setShowUnAuthView(true);
      }
    }
  }, [rolesPermissionsData, dispatch]);

  const baseUrl = process.env.NEXT_PUBLIC_API_HUB_PORTAL_INTEGRATION_URL;
  const data = localStorage.getItem("swaggerPath")!;
  const isSubscribed = localStorage.getItem("isSubscribed") === "true";
  const { path, serviceOperations } = JSON.parse(data);
  const swaggerUrl = baseUrl + path;

  const { data: swaggerData, isLoading } = useGetSwaggerData(swaggerUrl);

  const getAlteredSwaggerData = (swaggerData: any) => {
    const newData = { ...swaggerData };
    const companyServices: any = {};
    for (const key of Object.keys(newData.paths)) {
      serviceOperations.forEach((item: Services) => {
        if (key.toString().indexOf(item.handle) !== -1) {
          companyServices[key] = newData.paths[key];
        }
      });
    }
    newData.paths = companyServices;
    return newData;
  };

  return (
    <Box>
      {isLoading || isRolePermissionLoading ? (
        <LoadingView height="100vh" />
      ) : (
        <Fragment>
          {!isSubscribed && (
            <Alert variant="filled" severity="error">
              {labels.subscriptionWarning}
            </Alert>
          )}
          {isShowUnAuthView ? (
            <UnAuthorizeView />
          ) : (
            <AugmentingLayout>
              <Box
                width={shouldUseSwagger ? "55%" : "100%"}
                marginX="auto"
                marginTop={0}
              >
                {shouldUseSwagger === undefined ? (
                  <LoadingView height="70vh" />
                ) : shouldUseSwagger ? (
                  <SwaggerUI spec={getAlteredSwaggerData(swaggerData)} />
                ) : (
                  // eslint-disable-next-line react/jsx-pascal-case
                  <API
                    apiDescriptionDocument={getAlteredSwaggerData(swaggerData)}
                    router="hash"
                  />
                )}
              </Box>
            </AugmentingLayout>
          )}
        </Fragment>
      )}
    </Box>
  );
}
