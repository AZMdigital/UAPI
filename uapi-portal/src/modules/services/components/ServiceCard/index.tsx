/* eslint-disable @typescript-eslint/naming-convention */
import { useState } from "react";
import { CircularProgress } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { useRouter } from "next/router";

import { handleErroMessage, handleToastMessage } from "~/utils/helper";
import { labels } from "~/utils/labels";
import {
  PERMISSION_SERVICE_EXPLORE,
  PERMISSION_SERVICE_SUBSCRIBE,
} from "~/utils/permissionsConstants";

import { useAppSelector } from "~/state/hooks";

import { useSubscribeCompanyService } from "~/rest/apiHooks/companies/useCompanies";

import { ServiceCardInterface } from "~/modules/services/utils/helper";

import ConfirmationDailog from "~/core/components/ConfirmationDialog";
import { paths } from "~/core/utils/helper";

export default function ServiceCard({
  serviceGroup,
  buttonText,
  // variant,
  heading,
  description,
  path,
  logo,
  logoName,
  serviceOperations,
  subscribed,
  serviceHeadId,
  setTriggerRefetch,
  logoLoading,
}: ServiceCardInterface) {
  const router = useRouter();
  const isSvg = logoName?.endsWith(".svg");
  localStorage.setItem("logo", logo);
  localStorage.setItem("logoName", logoName);

  const [shouldShowDialog, setShowDialog] = useState(false);

  const { mutateAsync: subscribeCompanyService } = useSubscribeCompanyService();

  const user = useAppSelector((state) => state.core.userInfo);

  const userPermissions = useAppSelector(
    (state) => state.core.userRolePermissions
  );

  const userPermissionsStrings: string[] = userPermissions.map(
    (permission) => permission as unknown as string
  );

  const hasServiceSubscribe: boolean = userPermissionsStrings.includes(
    PERMISSION_SERVICE_SUBSCRIBE
  );

  const hasServiceExplore: boolean = userPermissionsStrings.includes(
    PERMISSION_SERVICE_EXPLORE
  );

  const isSuperAdmin: any = user?.isSuperAdmin;

  const handleDeleteAction = (confirmationStatus: boolean) => {
    if (confirmationStatus) {
      subscribeCompanyService(
        {
          companyId: user?.company.id as number,
          serviceHeadId: serviceHeadId as number,
        },
        {
          onSuccess: () => {
            setTriggerRefetch((value: any) => !value);
            localStorage.setItem(
              "swaggerPath",
              JSON.stringify({
                path,
                serviceGroup,
                heading,
                description,
                serviceOperations,
              })
            );
            localStorage.setItem("isSubscribed", JSON.stringify(true));
            handleToastMessage(labels.serviceSubscribedSuccessfully);
            router.push(paths.swaggerPage);
          },
          onError: (error: any) => {
            const status =
              error?.error?.response?.status || error?.response?.status;
            if (status === 401) {
              handleErroMessage(labels.serviceSubscribedFailed);
            }
          },
        }
      );
    }
    setShowDialog(false);
  };

  const handleConfirmationDialog = () => {
    setShowDialog(true);
  };

  const setSwaggerPath = () => {
    localStorage.setItem("isSubscribed", JSON.stringify(subscribed));
    localStorage.setItem("serviceHeadId", JSON.stringify(serviceHeadId));
    localStorage.setItem(
      "swaggerPath",
      JSON.stringify({
        path,
        serviceGroup,
        heading,
        description,
        serviceOperations,
      })
    );
    router.push(paths.swaggerPage);
  };

  return (
    <Card
      sx={{
        borderRadius: "4px",
        border: "1px solid primary.layoutBg",
        boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.05)",
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
        <div>
          {logoLoading ? (
            <CircularProgress size={24} /> // Show loader while waiting for API response
          ) : (
            <Image
              src={`data:image/${isSvg ? "svg+xml" : "*"};base64,${logo}`}
              alt="No Uploaded Logo"
              width={160}
              height={80}
            />
          )}
        </div>

        <Typography
          height={30}
          gutterBottom
          component="div"
          variant="subtitle1"
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
          {heading}
        </Typography>
        {/* <Typography
          height={51}
          maxWidth={264}
          variant="h4"
          textAlign="center"
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
          {description}
        </Typography> */}

        <Stack direction="row">
          {(isSuperAdmin || hasServiceExplore) && (
            <Button
              variant="outlined"
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                textTransform: "capitalize",
                height: 41,
                width: 100,
                borderRadius: 1,
                whiteSpace: "nowrap",
                marginTop: 2,
                marginBottom: "26px",
                marginRight: "10px",
                borderColor: "primary.green",
                color: "primary.green",
                "&:hover": {
                  borderColor: "primary.green",
                  backgroundColor: "primary.green",
                  color: "primary.typoWhite",
                },
              }}
              onClick={setSwaggerPath}
            >
              <Typography variant="body2" fontWeight={500} fontSize={13.895}>
                {buttonText}
              </Typography>
            </Button>
          )}

          {!subscribed && (isSuperAdmin || hasServiceSubscribe) && (
            <Button
              variant="outlined"
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                textTransform: "capitalize",
                height: 41,
                width: 100,
                whiteSpace: "nowrap",
                borderRadius: 1,
                marginTop: 2,
                marginBottom: "26px",
                borderColor: "primary.green",
                color: "primary.green",
                "&:hover": {
                  borderColor: "primary.green",
                  backgroundColor: "primary.green",
                  color: "primary.typoWhite",
                },
              }}
              onClick={handleConfirmationDialog}
            >
              Subscribe
            </Button>
          )}
        </Stack>

        <ConfirmationDailog
          isOpen={shouldShowDialog}
          label={labels.subscribeService}
          handleAction={handleDeleteAction}
        />
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="center"
          sx={{
            height: 25,
            width: "110%",
            position: "absolute",
            paddingTop: 0.8,
            bottom: 0,
            backgroundColor: "primary.main",
            borderRadius: "50% 50% 0 0 / 2em 2em 0 0", // Adjust the values here
          }}
        >
          <Typography variant="h4" color="primary.typoWhite" marginTop={0.45}>
            {description.length > 35
              ? description.substring(0, 35).concat("...")
              : description}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
