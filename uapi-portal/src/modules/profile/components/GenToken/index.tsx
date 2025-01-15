/* eslint-disable @typescript-eslint/no-unused-vars */
import { Fragment, useEffect, useState } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Image from "next/image";

import { handleSuccessMessage } from "~/utils/helper";
import { PERMISSION_API_KEY_EDIT } from "~/utils/permissionsConstants";

import { useAppSelector } from "~/state/hooks";

import {
  useGetCompanyApiKey,
  useSaveCompanyApiKey,
} from "~/rest/apiHooks/companies/useCompanies";
import {
  getCompanyApiKey,
  saveCompanyApiKey,
} from "~/rest/repositories/companies";

import { labels } from "~/modules/profile/utils/labels";

import CopyIcon from "~/public/assets/Copy.svg";

import ConfirmationDailog from "~/core/components/ConfirmationDialog";
import LoadingView from "~/core/components/LoadingView";
import UnAuthorizeView from "~/core/components/UnAuthorizesView";

const GenerateToken = () => {
  const user = useAppSelector((state) => state.core.userInfo);
  const [shouldShowDialog, setShowDialog] = useState(false);
  const [isCompanyApiKeyEnable, setEnableCompanyApiKey] = useState(false);
  const [companyApiKey, setCompanyApiKey] = useState("");
  const { data, isFetching, refetch, error, isError } = useGetCompanyApiKey();
  const userPermissions = useAppSelector(
    (state) => state.core.userRolePermissions
  );

  const userPermissionsStrings: string[] = userPermissions.map(
    (permission) => permission as unknown as string
  );

  const isSuperAdmin: any = user?.isSuperAdmin;
  const { data: companyApiKeyData, isFetching: isSavingCompanyApiKey } =
    useSaveCompanyApiKey({
      enabled: isCompanyApiKeyEnable,
    });

  const hasAPIKeyEditPermission: boolean = userPermissionsStrings.includes(
    PERMISSION_API_KEY_EDIT
  );

  const handleCopytext = () => {
    navigator.clipboard.writeText(companyApiKey);
    handleSuccessMessage(labels.apiKeyCopied, labels.clipBoard);
  };
  const [isShowUnAuthView, setShowUnAuthView] = useState(false);

  useEffect(() => {
    if (data?.apiKey) {
      setCompanyApiKey(data?.apiKey.apiKey);
      setShowUnAuthView(false);
    } else {
      setCompanyApiKey("");
      setShowUnAuthView(false);
    }
  }, [data]);

  useEffect(() => {
    if (isError) {
      const errorObj: any = error;
      const status =
        errorObj?.error?.response?.status || errorObj?.response?.status;
      if (status === 403) {
        setShowUnAuthView(true);
      }
    }
  }, [error, isError]);

  const HandleConfirmation = (confirmationStatus: boolean) => {
    if (confirmationStatus) {
      generateApiKey();
      setShowDialog(false);
    } else {
      setShowDialog(false);
    }
  };

  const GetApiKeyConfirmation = async () => {
    if (companyApiKey !== "") {
      setShowDialog(true);
    } else {
      generateApiKey();
    }
  };

  const generateApiKey = async () => {
    const data = await saveCompanyApiKey();
    setCompanyApiKey(data?.apiKey);
    refetch();
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="center">
      {isFetching ? (
        <LoadingView />
      ) : (
        <Fragment>
          {isShowUnAuthView ? (
            <UnAuthorizeView />
          ) : (
            <Fragment>
              <Stack direction="column" spacing={2} width="100%">
                <Card elevation={0}>
                  <CardContent>
                    <Stack direction="column">
                      <Typography
                        variant="h1"
                        color="primary.main"
                        marginBottom={2}
                      >
                        {labels.apiKey}
                      </Typography>
                      <Typography
                        variant="h4"
                        color="primary.blackishGray"
                        marginBottom={2}
                      >
                        {labels.apiKeyDescriptionText}
                      </Typography>

                      {companyApiKey !== "" && (
                        <Stack direction="row" spacing={1} marginBottom={2}>
                          <Chip
                            label={
                              <Typography variant="h5">
                                {companyApiKey}
                              </Typography>
                            }
                            sx={{
                              borderRadius: 0.75,
                              width: 410,
                              height: 50,
                              padding: 2,
                              backgroundColor: "primary.layoutBg",
                            }}
                          />
                          <Box
                            display="flex"
                            flexDirection="row"
                            justifyContent="center"
                            alignItems="center"
                            onClick={handleCopytext}
                            sx={{
                              height: 50,
                              width: 36,
                              borderRadius: 0.75,
                              backgroundColor: "secondary.main",
                              cursor: "pointer",
                            }}
                          >
                            <Image
                              src={CopyIcon}
                              height={17}
                              width={17}
                              alt=""
                            />
                          </Box>
                        </Stack>
                      )}
                      {(isSuperAdmin || hasAPIKeyEditPermission) && (
                        <LoadingButton
                          variant="contained"
                          onClick={GetApiKeyConfirmation}
                          sx={{
                            textTransform: "capitalize",
                            width: 180,
                            height: 35,
                            padding: 2,
                            paddingBottom: 2.5,
                            borderRadius: 1.25,
                            fontSize: "1.1rem",
                            fontFamily: "SegoeUI",
                            whiteSpace: "nowrap",

                            backgroundColor: "primary.green",
                            "&:hover": {
                              backgroundColor: "primary.green",
                            },
                          }}
                        >
                          {companyApiKey !== ""
                            ? labels.reGenerateApiKey
                            : labels.generateApiKey}
                        </LoadingButton>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              </Stack>
              <ConfirmationDailog
                isOpen={shouldShowDialog}
                label={labels.confirmationDialogGenerateApiKey}
                handleAction={HandleConfirmation}
              />
            </Fragment>
          )}
        </Fragment>
      )}
    </Box>
  );
};

export default GenerateToken;
