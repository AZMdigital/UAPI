import { Fragment, MutableRefObject, useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useQueryClient } from "@tanstack/react-query";

import { handleSuccessMessage } from "~/utils/helper";
import { PERMISSION_CONFIGURATION_EDIT } from "~/utils/permissionsConstants";

import { useAppSelector } from "~/state/hooks";

import {
  useDeleteClientCertificate,
  useGetClientCertificate,
} from "~/rest/apiHooks/configuration/useConfiguration";

import { ClientCertificateData } from "~/modules/profile/interface/profile";
import { labels } from "~/modules/profile/utils/labels";

import ConfirmationDailog from "~/core/components/ConfirmationDialog";
import ToggleSwitch from "~/core/components/Switch";

export default function MutualAuthentication() {
  const queryClient = useQueryClient();
  const [ClientCertificate, setCertificateData] =
    useState<ClientCertificateData | null>(null);
  const [shouldShowCard, setShowCard] = useState(false);
  const [shouldShowDialog, setShowDialog] = useState(false);

  const userPermissions = useAppSelector(
    (state) => state.core.userRolePermissions
  );

  const userPermissionsStrings: string[] = userPermissions.map(
    (permission) => permission as unknown as string
  );

  const user = useAppSelector((state) => state.core.userInfo);

  const hasConfigurationEditPermission: boolean =
    userPermissionsStrings.includes(PERMISSION_CONFIGURATION_EDIT);

  const isSuperAdmin: any = user?.isSuperAdmin;

  const {
    data: ClientCertificateData,
    isError: isClientCertificateError,
    isSuccess: isClientCertificateSuccess,
  } = useGetClientCertificate(user?.company.id as number, {
    enabled: true,
  });

  const { mutate: deleteClientCertificate } = useDeleteClientCertificate();

  useEffect(() => {
    if (isClientCertificateSuccess) {
      if (ClientCertificateData) {
        setCertificateData(ClientCertificateData);
        setShowCard(true);
      }
    } else if (isClientCertificateError) {
      setShowCard(true);
    }
  }, [
    isClientCertificateSuccess,
    isClientCertificateError,
    ClientCertificateData,
  ]);

  const handleDeleteAction = (confirmationStatus: boolean) => {
    if (confirmationStatus) {
      if (ClientCertificate!.id !== -1) {
        deleteClientCertificate(
          { id: ClientCertificate!.id },
          {
            onSuccess: () => {
              hiddenFileInput.current.value = "";
              queryClient.invalidateQueries(["getClientCertificate"]);
              handleSuccessMessage("Certificate", "deleted");
              setCertificateData(null);
            },
          }
        );
      } else {
        setCertificateData(null);
        hiddenFileInput.current.value = "";
      }
      setShowDialog(false);
    } else {
      setShowDialog(false);
    }
  };

  const hiddenFileInput = useRef() as MutableRefObject<HTMLInputElement>;
  const onToggle = () => {
    return;
  };

  return (
    <Fragment>
      <Grid item xs={12}>
        {!shouldShowCard ? (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            paddingTop={7}
          >
            <CircularProgress size={40} />
          </Box>
        ) : (
          <Fragment>
            <Card elevation={0}>
              <CardContent>
                <Grid container xs={12} direction="row">
                  <Grid item xs={0.4} minWidth={60} height="auto">
                    <ToggleSwitch
                      isChecked={false}
                      handleChecked={onToggle}
                      disabled={
                        !(isSuperAdmin || hasConfigurationEditPermission)
                      }
                    />
                  </Grid>
                  <Grid item xs={11}>
                    <Stack direction="column">
                      <Typography
                        variant="h1"
                        color="primary.main"
                        marginBottom={2}
                      >
                        {labels.mutualAuthentication}
                      </Typography>
                      <Typography
                        variant="h4"
                        color="primary.blackishGray"
                        marginBottom={2}
                      >
                        {labels.mutualAuthenticationText}
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            <ConfirmationDailog
              isOpen={shouldShowDialog}
              label={labels.confirmationDialogText}
              handleAction={handleDeleteAction}
            />
          </Fragment>
        )}
      </Grid>
    </Fragment>
  );
}
