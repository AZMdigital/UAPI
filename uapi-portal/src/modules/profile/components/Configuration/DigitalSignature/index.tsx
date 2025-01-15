import { Fragment, MutableRefObject, useEffect, useRef, useState } from "react";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { useQueryClient } from "@tanstack/react-query";

import { handleSuccessMessage } from "~/utils/helper";
import { PERMISSION_CONFIGURATION_EDIT } from "~/utils/permissionsConstants";

import { useAppSelector } from "~/state/hooks";

import {
  useGetCompanyConfiguration,
  useSaveCompanyConfiguration,
} from "~/rest/apiHooks";
import {
  useDeleteCertificate,
  useGetPublicKey,
  useUploadPemFile,
} from "~/rest/apiHooks/configuration/useConfiguration";

import {
  CompanyConfiguration,
  DigitalSignatureProps,
  PublicKeyData,
  UploadPemProps,
} from "~/modules/profile/interface/profile";
import { labels } from "~/modules/profile/utils/labels";

import attachment from "~/public/assets/Attachment.svg";

import ConfirmationDailog from "~/core/components/ConfirmationDialog";
import FileBrowserButton from "~/core/components/FileBrowserButton";
import ToggleSwitch from "~/core/components/Switch";

export default function DigitalSignature({
  DigitalSignature,
}: DigitalSignatureProps) {
  const queryClient = useQueryClient();
  const user = useAppSelector((state) => state.core.userInfo);
  const [selectedPemFile, setPemFile] = useState<File | null>();
  const [isPublicKeyResult, setPublicKeyResult] = useState(false);
  const [isConfigurationResult, setConfigurationResult] = useState(false);
  const [isToggleChecked, setToggeleChecked] = useState(false);
  const [publicKey, setPublicKeyData] = useState<PublicKeyData | null>(null);
  const [shouldShowDialog, setShowDialog] = useState(false);
  const [isEnableBrowseButton, setBrowseButton] = useState(false);
  const [isEnableSaveButton, setSaveButton] = useState(false);
  const [isEnableDeleteButton, setDeleteButton] = useState(false);
  const { mutate: deleteCertificate } = useDeleteCertificate();
  const { mutate: uploadPemFile, isLoading: isFileUploading } =
    useUploadPemFile();
  const { data, isError, isSuccess } = useGetCompanyConfiguration(
    user?.company.id as number,
    "DIGITAL_SIGNATURE",
    {
      enabled: true,
    }
  );

  const userPermissions = useAppSelector(
    (state) => state.core.userRolePermissions
  );

  const userPermissionsStrings: string[] = userPermissions.map(
    (permission) => permission as unknown as string
  );

  const hasConfigurationEditPermission: boolean =
    userPermissionsStrings.includes(PERMISSION_CONFIGURATION_EDIT);

  const isSuperAdmin: any = user?.isSuperAdmin;

  const {
    data: publicKeyData,
    isError: isPublicKeyError,
    isSuccess: isPublicKeySuccess,
  } = useGetPublicKey(user?.company.id as number, {
    enabled: true,
  });

  const {
    mutate: saveCompanyConfiguration,
    data: saveCompanyConfigurationData,
  } = useSaveCompanyConfiguration();

  useEffect(() => {
    if (isPublicKeySuccess) {
      if (publicKeyData) {
        setPublicKeyData(publicKeyData);
        setBrowseButton(false);
        setSaveButton(false);
        setDeleteButton(true);
        setPublicKeyResult(true);
      }
    } else if (isPublicKeyError) {
      setBrowseButton(true);
      setSaveButton(false);
      setPublicKeyResult(true);
    }
  }, [publicKeyData, isPublicKeyError, isPublicKeySuccess]);

  useEffect(() => {
    if (isSuccess) {
      if (data) {
        setToggeleChecked(data.configValue.toLowerCase() === "true");
        setConfigurationResult(true);
      }
    } else if (isError) {
      setToggeleChecked(false);
      setConfigurationResult(true);
    }
  }, [data, isError, isSuccess]);

  useEffect(() => {
    if (saveCompanyConfigurationData) {
      setToggeleChecked(
        saveCompanyConfigurationData.configValue.toLowerCase() === "true"
      );

      if (!publicKey) {
        setBrowseButton(
          saveCompanyConfigurationData.configValue.toLowerCase() === "true"
        );
      }

      setDeleteButton(
        saveCompanyConfigurationData.configValue.toLowerCase() === "true"
      );
      handleSuccessMessage(
        labels.digitalSignatureEnabled,
        saveCompanyConfigurationData.configValue.toLowerCase() === "true"
          ? labels.enabled
          : labels.disabled
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saveCompanyConfigurationData, isError, isSuccess]);

  const saveConfiguration = (configuration: CompanyConfiguration) => {
    saveCompanyConfiguration({
      configuration,
    });
  };

  const OnToggle = (value: boolean) => {
    const configurationData = {} as CompanyConfiguration;
    configurationData.configurationId = DigitalSignature?.id;
    configurationData.configurationValue = value;
    saveConfiguration(configurationData);
  };

  const hiddenFileInput = useRef() as MutableRefObject<HTMLInputElement>;
  const openInput = () => {
    hiddenFileInput.current.click();
  };

  const onFileSelected = (file: File) => {
    setPemFile(file);
    const fileData = {} as PublicKeyData;
    fileData.id = -1;
    fileData.fileName = file.name;
    fileData.publicKey = "";
    fileData.createdAt = "";
    setPublicKeyData(fileData);
    setSaveButton(true);
    setDeleteButton(true);
  };

  const savePemFile = () => {
    const pemDatas = {
      pemFile: selectedPemFile,
    } as unknown as UploadPemProps;

    uploadPemFile(
      { pemData: pemDatas },
      {
        onSuccess: () => {
          hiddenFileInput.current.value = "";
          queryClient.invalidateQueries({
            queryKey: ["getCompanyPublicKey"],
          });
          handleSuccessMessage(labels.certificateUploaded, labels.uploaded);
          setBrowseButton(false);
          setSaveButton(false);
        },
        onError: () => {
          hiddenFileInput.current.value = "";
          setBrowseButton(false);
          setSaveButton(false);
          queryClient.invalidateQueries({
            queryKey: ["getCompanyPublicKey"],
          });
        },
      }
    );
  };

  const handleDeleteAction = (confirmationStatus: boolean) => {
    if (confirmationStatus) {
      if (publicKey!.id !== -1) {
        deleteCertificate(
          { id: publicKeyData.id },
          {
            onSuccess: () => {
              hiddenFileInput.current.value = "";
              queryClient.invalidateQueries(["getCompanyPublicKey"]);
              handleSuccessMessage("Certificate", "deleted");
              setPublicKeyData(null);
            },
          }
        );
      } else {
        setPublicKeyData(null);
        hiddenFileInput.current.value = "";
        setSaveButton(false);
      }
      setShowDialog(false);
    } else {
      setShowDialog(false);
    }
  };

  const deletePemFile = () => {
    setShowDialog(true);
  };

  return (
    <Fragment>
      <Grid item xs={12}>
        {!isPublicKeyResult && !isConfigurationResult ? (
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
                      isChecked={isToggleChecked}
                      handleChecked={OnToggle}
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
                        {labels.digitalSignatureEnabled}
                      </Typography>

                      <Typography
                        variant="h4"
                        color="primary.blackishGray"
                        marginBottom={2}
                      >
                        {labels.digitalSignationNormalPart1}
                        <Typography
                          display="inline"
                          variant="h1"
                          color="primary.typoBlack"
                        >
                          {labels.digitalSignationBoldPart1}
                        </Typography>
                        {labels.digitalSignationNormalPart2}
                        <Typography
                          display="inline"
                          variant="h1"
                          color="primary.typoBlack"
                        >
                          {labels.digitalSignationBoldPart2}
                        </Typography>
                      </Typography>

                      <Grid container xs={12}>
                        <Grid item xs={8}>
                          <Stack
                            direction="row"
                            spacing={4}
                            alignItems="center"
                          >
                            <FileBrowserButton
                              textTitle={labels.browse}
                              isloading={false}
                              enabled={
                                !(isEnableBrowseButton && isToggleChecked)
                              }
                              clickEvent={openInput}
                              inputRef={hiddenFileInput}
                              setFile={onFileSelected}
                              fileType=".crt, .cer, .cert, .pem, .csr"
                            />
                            {publicKey === null && isToggleChecked && (
                              <Typography
                                variant="h6"
                                color="red"
                                marginTop="auto"
                              >
                                {labels.noPemFileError}
                              </Typography>
                            )}
                            {publicKey && (
                              <Stack
                                direction="row"
                                display="flex"
                                alignItems="center"
                                spacing={0}
                              >
                                <Typography
                                  variant="h6"
                                  color="primary.blackishGray"
                                >
                                  {publicKey.fileName}
                                </Typography>
                                <Image
                                  src={attachment}
                                  alt=""
                                  width={20}
                                  height={15}
                                />

                                <IconButton
                                  onClick={deletePemFile}
                                  disabled={
                                    !(isEnableDeleteButton && isToggleChecked)
                                  }
                                >
                                  <DeleteOutlineOutlinedIcon
                                    sx={{
                                      marginBottom: "3px",
                                      width: "17px",
                                      height: "17px",
                                    }}
                                  />
                                </IconButton>
                              </Stack>
                            )}
                          </Stack>
                        </Grid>

                        <Grid item xs={4} display="flex" justifyContent="end">
                          {isEnableSaveButton && isToggleChecked && (
                            <LoadingButton
                              loading={isFileUploading}
                              onClick={savePemFile}
                              type="submit"
                              sx={{
                                height: 35,
                                width: 72,
                                paddingTop: 1,
                                color: "primary.typoWhite",
                                textTransform: "capitalize",
                                backgroundColor: "primary.green",
                                "&:hover": {
                                  backgroundColor: "primary.green",
                                },
                                "&.Mui-disabled": {
                                  backgroundColor: "primary.green",
                                  color: "primary.typoWhite",
                                  opacity: 0.4,
                                },
                              }}
                            >
                              {labels.save}
                            </LoadingButton>
                          )}
                        </Grid>
                      </Grid>
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
