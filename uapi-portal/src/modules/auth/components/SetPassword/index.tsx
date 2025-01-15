/* eslint-disable @typescript-eslint/naming-convention */
import { Fragment, useEffect, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { FormProvider, useForm } from "react-hook-form";
import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";

import { handleToastMessage } from "~/utils/helper";

import {
  resetPasswordType,
  setPasswordLink,
  validateResetPasswordType,
  validateSetPasswordLink,
} from "~/rest/apiHooks/auth/useAuth";

import { labels } from "~/modules/auth/utils/labels";
import { ResetPasswordSchema } from "~/modules/auth/utils/signInSchema";

import ULogo from "~/public/assets/Uapi_logo.svg";

import TextFieldController from "~/core/components/FormComponents/TextFieldComponent";
import LoadingView from "~/core/components/LoadingView";
import { paths } from "~/core/utils/helper";

const SetPassword: NextPage = () => {
  const [captcha, setCaptcha] = useState<string | null>();
  const router = useRouter();
  const { token } = router.query;
  const tokenValue = Array.isArray(token) ? token[0] : token;
  const urlParams = new URLSearchParams(tokenValue);
  const webEmail = urlParams.get("email");
  const webtoken = urlParams.get("token");

  const {
    mutate: validateSetPassword,
    isLoading,
    isError,
  } = useMutation((input: validateResetPasswordType) =>
    validateSetPasswordLink(input)
  );

  const {
    mutate: setPassword,
    isLoading: setPasswordLoading,
    isSuccess: setPasswordSuccess,
  } = useMutation((input: resetPasswordType) => setPasswordLink(input));

  useEffect(() => {
    if (webEmail && webtoken) {
      validateSetPassword({ email: webEmail, token: webtoken });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [webEmail, webtoken]);

  useEffect(() => {
    if (isError) {
      // invalid token move to login
      router.push(paths.loginPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError]);

  useEffect(() => {
    if (setPasswordSuccess) {
      handleToastMessage(labels.passwordSetSuccess);
      router.push(paths.loginPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setPasswordSuccess]);

  const methods = useForm({
    reValidateMode: "onChange",
    mode: "onBlur",
    criteriaMode: "all",
    resolver: yupResolver(ResetPasswordSchema, {
      abortEarly: false,
    }),
  });
  const {
    getValues,
    handleSubmit,
    control,
    formState: { errors },
  } = methods;

  const onSubmitHandler = () => {
    const { password } = getValues();
    if (captcha) {
      setPassword({ email: webEmail!, password, token: webtoken! });
    }
  };
  const onSubmit = handleSubmit(onSubmitHandler);

  const handleClose = () => {
    // Just go to the login page
    router.push(paths.loginPage);
  };

  return (
    <Fragment>
      {isLoading ? (
        <LoadingView />
      ) : (
        <Grid
          container
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
          <Card
            sx={{
              border: "10px solid primary.layoutBg",
              boxShadow: "0px 50px 50px 0px rgba(0, 0, 0, 0.2)",
              width: 450,
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                paddingBottom: 3,
                position: "relative",
              }}
            >
              <Image src={ULogo} alt="" width={100} height={100} />
              <Typography
                height={28}
                variant="body1"
                color="primary.main"
                textAlign="center"
                marginY={3}
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  "-webkit-line-clamp": 1,
                  "-webkit-box-orient": "vertical",
                }}
              >
                {labels.setPassword}
              </Typography>
              <Typography
                variant="h2"
                textAlign="left"
                fontStyle="normal"
                lineHeight="normal"
                color="primary.blackishGray"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  "-webkit-line-clamp": 3,
                  "-webkit-box-orient": "vertical",
                }}
              >
                {labels.setPasswordDetail}
              </Typography>
              <FormProvider {...methods}>
                <form
                  style={{ minWidth: "90%", paddingTop: 30 }}
                  onSubmit={onSubmit}
                >
                  <TextFieldController
                    key="password"
                    control={control}
                    controllerName="password"
                    textFieldType="password"
                    headingText="Password"
                    showHeading
                    errorMessage={errors.password?.message}
                    inputPadding={1}
                    marginTop="10px"
                  />
                  <TextFieldController
                    key="confirmPassword"
                    control={control}
                    controllerName="confirmPassword"
                    textFieldType="password"
                    headingText="Confirm Password"
                    showHeading
                    errorMessage={errors.confirmPassword?.message}
                    inputPadding={1}
                    marginTop="10px"
                  />
                  <Box display="flex" justifyContent="center" paddingTop={1}>
                    <ReCAPTCHA
                      sitekey={
                        process.env.NEXT_PUBLIC_API_HUB_PORTAL_RECAPTCHA_KEY!
                      }
                      onChange={setCaptcha}
                    />
                  </Box>
                  <Stack
                    direction="row"
                    marginTop={5}
                    display="flex"
                    justifyContent="center"
                    spacing={2}
                  >
                    <LoadingButton
                      loading={setPasswordLoading}
                      type="submit"
                      sx={{
                        height: 35,
                        paddingTop: 1,
                        color: "primary.typoWhite",
                        textTransform: "capitalize",
                        backgroundColor: "primary.green",
                        "&:hover": {
                          backgroundColor: "primary.green",
                        },
                      }}
                    >
                      {labels.sendBtn}
                    </LoadingButton>
                    <Button
                      sx={{
                        height: 35,
                        color: "black",
                        border: "1px solid",
                        textTransform: "capitalize",
                        borderColor: "primary.textLightGray",
                        backgroundColor: "primary.white",
                        "&:hover": {
                          backgroundColor: "primary.white",
                        },
                      }}
                      onClick={handleClose}
                    >
                      {labels.cancel}
                    </Button>
                  </Stack>
                </form>
              </FormProvider>
            </CardContent>
          </Card>
        </Grid>
      )}
    </Fragment>
  );
};
export default SetPassword;
