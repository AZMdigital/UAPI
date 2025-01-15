/* eslint-disable no-nested-ternary */
import { Fragment, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQueryClient } from "@tanstack/react-query";

import { handleSuccessMessage } from "~/utils/helper";
import { PERMISSION_CONNECTIVITY_EDIT } from "~/utils/permissionsConstants";

import { useAppSelector } from "~/state/hooks";

import { useSaveServiceCredentials } from "~/rest/apiHooks";
import {
  useGetServiceHeadCredentials,
  useGetServiceProviderCredentials,
  useUpdateUseMyCredentials,
} from "~/rest/apiHooks/services/useService";
import { CredentialsData, ServiceCredentials } from "~/rest/models/service";

import { ServiceAuthProps } from "~/modules/profile/interface/profile";
import {
  CredentailsMode,
  formatAuthTypeName,
} from "~/modules/profile/utils/helper";
import { labels } from "~/modules/profile/utils/labels";
import {
  apiKeyBasedServiceFormSchema,
  apiKeyWithUsernameFormSchema,
  basicCredentailFormSchema,
  bearerTokenFormSchema,
  credentailBasedServiceFormSchema,
} from "~/modules/profile/utils/serviceFormSchema";

import DropDownController from "~/core/components/FormComponents/DropDownComponent";
import TextFieldController from "~/core/components/FormComponents/TextFieldComponent";
import LoadingView from "~/core/components/LoadingView";
import { MenuItemStyle } from "~/core/components/style";
import ToggleSwitch from "~/core/components/Switch";

const ServiceAuthForm = ({
  serviceProvider,
  credentailsMode,
  serviceHeadId,
}: ServiceAuthProps) => {
  const queryClient = useQueryClient();
  const user = useAppSelector((state) => state.core.userInfo);

  const getFirstAuthType = () => {
    if (serviceProvider.authTypes.length > 0) {
      return serviceProvider.authTypes[0].authType.name;
    } else {
      return "";
    }
  };
  const [selectedAuthType, setSelectedAuthType] = useState(getFirstAuthType());
  const isSuperAdmin: any = user?.isSuperAdmin;

  const userPermissions = useAppSelector(
    (state) => state.core.userRolePermissions
  );

  const userPermissionsStrings: string[] = userPermissions.map(
    (permission) => permission as unknown as string
  );

  const hasConnectivityEditPermission: boolean =
    userPermissionsStrings.includes(PERMISSION_CONNECTIVITY_EDIT);

  const [credentialsData, setCredentialsData] = useState<CredentialsData>();
  const [shouldUseClientCredenatials, setUseClientCredenatials] =
    useState(false);
  const [shouldShowForm, setShouldShowForm] = useState(false);

  const getFormSchema: any = (authType: string) => {
    if (authType === "API_KEY") {
      return apiKeyBasedServiceFormSchema;
    } else if (authType === "CREDENTIALS_WITH_APP_SECRETS") {
      return credentailBasedServiceFormSchema;
    } else if (authType === "API_KEY_WITH_USERNAME") {
      return apiKeyWithUsernameFormSchema;
    } else if (authType === "BEARER_TOKEN") {
      return bearerTokenFormSchema;
    } else {
      return basicCredentailFormSchema;
    }
  };

  const methods = useForm({
    reValidateMode: "onChange",
    mode: "all",
    criteriaMode: "all",
    resolver: yupResolver(getFormSchema(selectedAuthType), {
      abortEarly: false,
    }),
  });
  const {
    getValues,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors },
  } = methods;

  const {
    mutate: getServiceProviderCredentails,
    isLoading: isGettingServiceProviderCredentials,
  } = useGetServiceProviderCredentials();

  const getServiceProviderModeCredentails = () => {
    // reset all values
    reset();
    getServiceProviderCredentails(
      {
        id: serviceProvider.id!,
        companyId: user?.company.id as number,
      },
      {
        onSuccess: (data) => {
          setCredentialsData(data);
        },
        onError: (error: any) => {
          const status =
            error?.error?.response?.status || error?.response?.status;
          if (status === 403) {
            // handleErroMessage(labels.forbiddenText);
          }
          setCredentialsData(undefined);
          setUseClientCredenatials(false);
          setShouldShowForm(false);
        },
      }
    );
  };

  const {
    mutate: getServiceHeadCredentails,
    isLoading: isGettingServiceHeadCredentials,
  } = useGetServiceHeadCredentials();

  const getServiceHeadModeCredentails = () => {
    // reset all values
    reset();
    getServiceHeadCredentails(
      {
        providerId: serviceProvider.id!,
        headId: serviceHeadId!,
        companyId: user?.company.id as number,
      },
      {
        onSuccess: (data) => {
          setCredentialsData(data);
        },
        onError: (error: any) => {
          const status =
            error?.error?.response?.status || error?.response?.status;
          if (status === 403) {
            // handleErroMessage(labels.forbiddenText);
          }
          setCredentialsData(undefined);
          setUseClientCredenatials(false);
          setShouldShowForm(false);
        },
      }
    );
  };

  useEffect(() => {
    if (serviceProvider) {
      if (credentailsMode === CredentailsMode.SERVICEPROVIDER) {
        getServiceProviderModeCredentails();
      } else if (credentailsMode === CredentailsMode.SERVICEHEAD) {
        getServiceHeadModeCredentails();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceProvider, serviceHeadId]);

  useEffect(() => {
    if (selectedAuthType) {
      setCredentialFormValue();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAuthType, credentialsData]);

  const setCredentialFormValue = () => {
    // reset all values
    reset();
    setUseClientCredenatials(
      credentialsData?.useClientCredentials ?? shouldShowForm
    );
    setShouldShowForm(credentialsData?.useClientCredentials ?? shouldShowForm);

    if (credentialsData?.serviceAuthType.authType.name === "API_KEY") {
      setValue("apikey", credentialsData?.apiKey);
    } else if (
      credentialsData?.serviceAuthType.authType.name ===
      "CREDENTIALS_WITH_APP_SECRETS"
    ) {
      setValue("apikey", credentialsData?.apiKey);
      setValue("appId", credentialsData?.appId);
      setValue("username", credentialsData?.username);
      setValue("password", credentialsData?.password);
    } else if (
      credentialsData?.serviceAuthType.authType.name === "API_KEY_WITH_USERNAME"
    ) {
      setValue("apikey", credentialsData?.apiKey);
      setValue("username", credentialsData?.username);
    } else if (
      credentialsData?.serviceAuthType.authType.name === "BEARER_TOKEN"
    ) {
      setValue("token", credentialsData?.token);
    } else {
      // Basic Credentails
      setValue("username", credentialsData?.username);
      setValue("password", credentialsData?.password);
    }
  };

  const { mutate: saveCredentails, isLoading: isSavingCredentials } =
    useSaveServiceCredentials();

  const saveServiceCredentails = (credentials: ServiceCredentials) => {
    saveCredentails(
      {
        credentials,
      },
      {
        onSuccess: (data) => {
          setCredentialsData(data);
          queryClient.invalidateQueries(["services", "getServiceCredentails"]);
          handleSuccessMessage(labels.serviceCredentials, labels.saved);
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
  };

  const { mutate: updateMyCredentails } = useUpdateUseMyCredentials();

  const updateUseMyServiceCredentails = (toggleValue: boolean) => {
    if (credentialsData) {
      // Only Call this API if the credential Data Exits
      updateMyCredentails(
        {
          id: credentialsData!.id,
          value: toggleValue,
        },
        {
          onSuccess: (data) => {
            setCredentialsData(data);
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
      // Just Enable the form
      setUseClientCredenatials(toggleValue);
      setShouldShowForm(toggleValue);
    }
  };

  const getSelectedAuthId = () => {
    const result = serviceProvider.authTypes.filter((obj) => {
      return obj.authType.name === selectedAuthType;
    });

    return result[0].authType.id;
  };

  const onSubmitHandler = () => {
    const { apikey, appId, username, password, token } = getValues();

    const credentailData = {} as ServiceCredentials;
    credentailData.apiKey = apikey;
    credentailData.appId = appId!;
    credentailData.username = username!;
    credentailData.password = password!;
    credentailData.id = serviceProvider.id;
    credentailData.companyId = user?.company.id as number;
    credentailData.authTypeId = getSelectedAuthId();
    credentailData.useClientCredentials = shouldUseClientCredenatials;
    credentailData.token = token;

    // check of credential mode
    if (credentailsMode === CredentailsMode.SERVICEHEAD) {
      // Attach Service Head Id here
      credentailData.serviceHeadId = serviceHeadId;
    }

    // Hit API
    saveServiceCredentails(credentailData);
  };

  const onSubmit = handleSubmit(onSubmitHandler);

  const OnToggle = (value: boolean) => {
    setUseClientCredenatials(value);
    updateUseMyServiceCredentails(value);
  };

  return (
    <Fragment>
      {isGettingServiceHeadCredentials ||
      isGettingServiceProviderCredentials ? (
        <LoadingView />
      ) : (
        <FormProvider {...methods}>
          <form onSubmit={onSubmit}>
            <Box
              flexDirection="column"
              sx={{
                with: "100%",
                borderRadius: "4px",
                backgroundColor: "secondary.main",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  backgroundColor: "primary.green",
                  borderTopLeftRadius: "4px",
                  borderTopRightRadius: "4px",
                }}
              >
                <Typography
                  sx={{
                    with: "100%",
                    paddingX: 2.5,
                    paddingY: 2,
                    variant: "h1",
                    color: "white",
                  }}
                >
                  {serviceProvider.name}
                </Typography>
              </Box>

              <Box
                padding={2.5}
                display="flex"
                justifyContent="center"
                flexDirection="column"
                alignContent="center"
              >
                <Box
                  sx={{
                    paddingTop: 1,
                    paddingBottom: 2,
                    display: "flex",
                    justifyContent: "start",
                  }}
                >
                  <ToggleSwitch
                    isChecked={shouldUseClientCredenatials}
                    handleChecked={OnToggle}
                    label={labels.useMyCredentailsText}
                    disabled={!(isSuperAdmin || hasConnectivityEditPermission)}
                  />
                </Box>

                {shouldShowForm && (
                  <Fragment>
                    <DropDownController
                      controllerName="AuthType"
                      isRequired={false}
                      disabled={
                        serviceProvider.authTypes.length === 0 ||
                        (!isSuperAdmin && !hasConnectivityEditPermission)
                      }
                      defaultSelectedValue={getFirstAuthType()}
                      onSelectChange={(selectedValue) =>
                        setSelectedAuthType(selectedValue.target.value)
                      }
                    >
                      {serviceProvider.authTypes.map((data) => {
                        return (
                          <MenuItem
                            key={data.authType.name}
                            value={data.authType.name}
                            sx={MenuItemStyle}
                          >
                            {formatAuthTypeName(data.authType.name)}
                          </MenuItem>
                        );
                      })}
                    </DropDownController>

                    {selectedAuthType === "API_KEY" && (
                      <Fragment>
                        <Typography
                          variant="h5"
                          color="primary.main"
                          textTransform="capitalize"
                          textAlign="center"
                          sx={{ paddingTop: 2 }}
                        >
                          {labels.apiKey}
                        </Typography>
                        <TextFieldController
                          key="apikey"
                          control={control}
                          controllerName="apikey"
                          label={labels.apiKey}
                          textFieldType="password"
                          isDisabled={
                            !(isSuperAdmin || hasConnectivityEditPermission)
                          }
                          errorMessage={errors.apikey?.message as string}
                          inputPadding={1}
                        />
                      </Fragment>
                    )}
                    {selectedAuthType === "API_KEY_WITH_USERNAME" && (
                      <Fragment>
                        <Typography
                          variant="h5"
                          color="primary.main"
                          textTransform="capitalize"
                          textAlign="center"
                          sx={{ paddingTop: 2 }}
                        >
                          {labels.apiKey}
                        </Typography>
                        <TextFieldController
                          key="apikey"
                          control={control}
                          controllerName="apikey"
                          label={labels.apiKey}
                          isDisabled={
                            !(isSuperAdmin || hasConnectivityEditPermission)
                          }
                          textFieldType="password"
                          errorMessage={errors.apikey?.message as string}
                          inputPadding={1}
                        />
                        <Typography
                          variant="h5"
                          color="primary.main"
                          textTransform="capitalize"
                          textAlign="center"
                          sx={{ paddingTop: 2 }}
                        >
                          {labels.username}
                        </Typography>
                        <TextFieldController
                          key="username"
                          control={control}
                          controllerName="username"
                          label={labels.username}
                          isDisabled={
                            !(isSuperAdmin || hasConnectivityEditPermission)
                          }
                          textFieldType="password"
                          errorMessage={errors.username?.message as string}
                          inputPadding={1}
                        />
                      </Fragment>
                    )}
                    {selectedAuthType === "CREDENTIALS_WITH_APP_SECRETS" && (
                      <Fragment>
                        <Typography
                          variant="h5"
                          color="primary.main"
                          textTransform="capitalize"
                          textAlign="center"
                          sx={{ paddingTop: 2 }}
                        >
                          {labels.apiKey}
                        </Typography>
                        <TextFieldController
                          key="apikey"
                          control={control}
                          controllerName="apikey"
                          label={labels.apiKey}
                          isDisabled={
                            !(isSuperAdmin || hasConnectivityEditPermission)
                          }
                          textFieldType="password"
                          errorMessage={errors.apikey?.message as string}
                          inputPadding={1}
                        />
                        <Typography
                          variant="h5"
                          color="primary.main"
                          textAlign="center"
                          textTransform="capitalize"
                        >
                          {labels.appId}
                        </Typography>
                        <TextFieldController
                          key="appId"
                          control={control}
                          controllerName="appId"
                          isDisabled={
                            !(isSuperAdmin || hasConnectivityEditPermission)
                          }
                          label={labels.appId}
                          textFieldType="password"
                          errorMessage={errors.appId?.message as string}
                          inputPadding={1}
                        />
                        <Typography
                          variant="h5"
                          color="primary.main"
                          textAlign="center"
                          textTransform="capitalize"
                        >
                          {labels.username}
                        </Typography>
                        <TextFieldController
                          key="username"
                          control={control}
                          controllerName="username"
                          label={labels.username}
                          textFieldType="password"
                          isDisabled={
                            !(isSuperAdmin || hasConnectivityEditPermission)
                          }
                          errorMessage={errors.username?.message as string}
                          inputPadding={1}
                        />

                        <Typography
                          variant="h5"
                          color="primary.main"
                          textAlign="center"
                          textTransform="capitalize"
                        >
                          {labels.password}
                        </Typography>
                        <TextFieldController
                          key="password"
                          control={control}
                          controllerName="password"
                          isDisabled={
                            !(isSuperAdmin || hasConnectivityEditPermission)
                          }
                          label={labels.password}
                          textFieldType="password"
                          errorMessage={errors.password?.message as string}
                          inputPadding={1}
                        />
                      </Fragment>
                    )}
                    {selectedAuthType === "BASIC_CREDENTIALS" && (
                      <Fragment>
                        <Typography
                          variant="h6"
                          color="primary.main"
                          textTransform="capitalize"
                          textAlign="center"
                          sx={{ paddingTop: 2 }}
                        >
                          {labels.username}
                        </Typography>
                        <TextFieldController
                          key="username"
                          control={control}
                          controllerName="username"
                          label={labels.username}
                          isDisabled={
                            !(isSuperAdmin || hasConnectivityEditPermission)
                          }
                          textFieldType="password"
                          errorMessage={errors.username?.message as string}
                          inputPadding={1}
                        />

                        <Typography
                          variant="h6"
                          color="primary.main"
                          textAlign="center"
                          textTransform="capitalize"
                        >
                          {labels.password}
                        </Typography>
                        <TextFieldController
                          key="password"
                          control={control}
                          controllerName="password"
                          label={labels.password}
                          isDisabled={
                            !(isSuperAdmin || hasConnectivityEditPermission)
                          }
                          textFieldType="password"
                          errorMessage={errors.password?.message as string}
                          inputPadding={1}
                        />
                      </Fragment>
                    )}
                    {selectedAuthType === "BEARER_TOKEN" && (
                      <Fragment>
                        <Typography
                          variant="h5"
                          color="primary.main"
                          textTransform="capitalize"
                          textAlign="center"
                          sx={{ paddingTop: 2 }}
                        >
                          {labels.bearerToken}
                        </Typography>
                        <TextFieldController
                          key="token"
                          control={control}
                          controllerName="token"
                          label={labels.bearerToken}
                          textFieldType="password"
                          isDisabled={
                            !(isSuperAdmin || hasConnectivityEditPermission)
                          }
                          errorMessage={errors.token?.message as string}
                          inputPadding={1}
                        />
                      </Fragment>
                    )}
                    <Box
                      marginTop="10px"
                      width="center"
                      display="flex"
                      justifyContent="center"
                    >
                      {(isSuperAdmin || hasConnectivityEditPermission) && (
                        <LoadingButton
                          loading={isSavingCredentials}
                          disabled={
                            serviceProvider.authTypes.length === 0 ||
                            (!isSuperAdmin && !hasConnectivityEditPermission)
                          }
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
                          }}
                        >
                          {labels.save}
                        </LoadingButton>
                      )}
                    </Box>
                  </Fragment>
                )}
              </Box>
            </Box>
          </form>
        </FormProvider>
      )}
    </Fragment>
  );
};
export default ServiceAuthForm;
