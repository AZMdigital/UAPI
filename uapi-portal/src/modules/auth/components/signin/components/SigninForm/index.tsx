import { useEffect, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { FormProvider, useForm } from "react-hook-form";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useMutation } from "@tanstack/react-query";

import { useAppDispatch } from "~/state/hooks";

import {
  getProfile,
  login,
  LoginInputType,
} from "~/rest/apiHooks/auth/useAuth";
import { usePermissionsByRole } from "~/rest/apiHooks/roles/useRoles";

import { signInFormFields } from "~/modules/auth/utils/helpers";
import { labels } from "~/modules/auth/utils/labels";
import { UserType } from "~/modules/profile/interface/profile";

import FormLoadingButton from "~/core/components/Buttons/FormLoadingButton";
import TextFieldController from "~/core/components/FormComponents/TextFieldComponent";
import { Field } from "~/core/components/interface";
import {
  saveSelection,
  setAuthUser,
  setMainAccountToken,
  setUserInfo,
  setUserRolePermissions,
} from "~/core/state/coreSlice";
import { paths } from "~/core/utils/helper";

const SignInForm: NextPage = () => {
  const [captcha, setCaptcha] = useState<string | null>();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    mutate: authenticate,
    data: response,
    isLoading,
    isSuccess,
  } = useMutation((input: LoginInputType) => login(input));

  const {
    mutateAsync: getPermissionByRole,
    data: rolesPermissionsData,
    isLoading: isRolePermissionLoading,
  } = usePermissionsByRole();

  const { mutate: getUserInfo, isLoading: isUserLoading } = useMutation(
    ["services"],
    () => getProfile(),
    {
      onSuccess: (data: UserType) => {
        dispatch(setUserInfo({ userInfo: data }));

        if (data.isSuperAdmin) {
          // If super admin by pass the flow because we don't have roles in it.
          dispatch(saveSelection(""));
          router.push(paths.homePage);
        } else {
          // Get user Roles here
          getPermissionByRole({ roleId: data.role.id as number });
        }
      },
    }
  );

  const methods = useForm();

  useEffect(() => {
    if (isSuccess) {
      const { token, refreshToken, validity, refreshValidity, tokenType } =
        response;
      dispatch(
        setAuthUser({
          token,
          refreshToken,
          validity,
          refreshValidity,
          tokenType,
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
      getUserInfo();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, dispatch]);

  useEffect(() => {
    if (rolesPermissionsData) {
      dispatch(
        setUserRolePermissions(
          rolesPermissionsData.map((role: any) => role.name)
        )
      );
      dispatch(saveSelection(""));

      router.push(paths.homePage);

      // if (checkPermission("services", rolesPermissionsData)) {
      //   router.push(paths.servicesPage);
      // } else if (checkPermission("packages-management", rolesPermissionsData)) {
      //   router.push(paths.packageManagement);
      // } else {
      //   router.push(paths.unAuthPage);
      // }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rolesPermissionsData]);

  const { getValues, handleSubmit, control } = methods;

  const onSubmitHandler = () => {
    const { username, password } = getValues();
    if (process.env.NEXT_PUBLIC_ENABLE_CAPCHA === "true") {
      if (captcha) {
        dispatch(setUserRolePermissions([]));
        authenticate({ username, password });
      }
    } else {
      authenticate({ username, password });
    }
  };

  const onSubmit = handleSubmit(onSubmitHandler);

  return (
    <FormProvider {...methods}>
      <form style={{ minWidth: "80%" }} onSubmit={onSubmit}>
        {signInFormFields.map((field: Field, index: number) => (
          <TextFieldController
            control={control}
            key={field.controllerName}
            controllerName={field.controllerName}
            label={field.label}
            isDisabled={false}
            errorMessage={`${field.label}is missing`}
            showHeading
            headingText={field.label}
            textFieldType={field?.textFieldType || "text"}
            marginTop={index === 0 ? "43px" : "27.5px"}
            inputPadding={1.5}
            height={49}
            labelColor="primary.blackishGray"
          />
        ))}

        <Box display="flex" flexDirection="row" justifyContent="space-between">
          <Stack
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="flex-start"
          >
            <FormControlLabel
              label={
                <Typography
                  variant="h4"
                  color="primary.blackishGray"
                  marginLeft={0.75}
                  marginTop={0.3}
                >
                  {labels.remember}
                </Typography>
              }
              sx={{
                paddingLeft: 1,
                marginTop: "3px",
                "& .Mui-checked": {
                  color: "rgba(0, 186, 190, 1) !important", // Apply your desired color here
                },
              }}
              control={
                <Checkbox
                  size="small"
                  sx={{
                    padding: 0,
                    paddingLeft: 0.1,
                    color: "primary.green",
                  }}
                />
              }
            />
          </Stack>
          <Link
            display="flex"
            justifyContent="right"
            href="/forget-password"
            underline="none"
            color="primary.blackishGray"
            marginLeft={1}
            variant="button"
            fontSize={14}
            fontWeight={400}
            textTransform="capitalize"
          >
            {labels.forgetPassword}
          </Link>
        </Box>
        {process.env.NEXT_PUBLIC_ENABLE_CAPCHA === "true" && (
          <Box display="flex" justifyContent="center" paddingTop={1}>
            <ReCAPTCHA
              size="normal"
              sitekey={process.env.NEXT_PUBLIC_API_HUB_PORTAL_RECAPTCHA_KEY!}
              onChange={setCaptcha}
            />
          </Box>
        )}

        <Box marginTop={2}>
          <FormLoadingButton
            buttonVariant="contained"
            id="signin"
            isLoading={isLoading || isUserLoading || isRolePermissionLoading}
            fullwidth
            color="primary.typoWhite"
            backgroundColor="primary.green"
            buttonType="submit"
            paddingY={1.5}
          >
            {labels.signIn}
          </FormLoadingButton>
        </Box>
      </form>
    </FormProvider>
  );
};
export default SignInForm;
