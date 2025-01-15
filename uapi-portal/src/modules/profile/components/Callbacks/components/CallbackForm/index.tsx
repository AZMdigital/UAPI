import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQueryClient } from "@tanstack/react-query";

import { Status } from "~/config/appConfig";

import { handleSuccessMessage } from "~/utils/helper";

import {
  useSaveCallback,
  useUpdateCallback,
} from "~/rest/apiHooks/callbacks/useCallbacks";

import { CallbackFormProps } from "~/modules/profile/interface/profile";
import { callbackFormSchema } from "~/modules/profile/utils/callbackFromSchema";
import { labels } from "~/modules/profile/utils/labels";
import { userStatus } from "~/modules/users/utils/helper";

import DropDownController from "~/core/components/FormComponents/DropDownComponent";
import TextFieldController from "~/core/components/FormComponents/TextFieldComponent";
import { MenuItemStyle } from "~/core/components/style";

const CallbackForm = ({
  isEditMode,
  isSaveBtnEnabled,
  servicesList,
  selectedCallback,
  handleCancel,
}: CallbackFormProps) => {
  const queryClient = useQueryClient();
  const { mutate: addCallBack, isLoading: isAddingRole } = useSaveCallback();
  const { mutate: updateCallBack, isLoading: isEditingRole } =
    useUpdateCallback();

  const getDefaultValues = () => {
    if (isEditMode) {
      return {
        ...selectedCallback!,
        isActive: selectedCallback?.isActive ? Status.ACTIVE : Status.IN_ACTIVE,
      };
    } else {
      return {
        isActive: Status.ACTIVE,
      };
    }
  };
  const methods = useForm({
    defaultValues: {
      ...getDefaultValues(),
    },
    reValidateMode: "onChange",
    mode: "all",
    criteriaMode: "all",
    resolver: yupResolver(callbackFormSchema, {
      abortEarly: false,
    }),
  });
  const {
    getValues,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = methods;

  const alterSubmitValues = (existingValues: any) => {
    const alteredData = JSON.parse(JSON.stringify(existingValues));
    alteredData.isActive = alteredData.isActive === Status.ACTIVE;
    delete alteredData.serviceName;
    delete alteredData.id;
    return alteredData;
  };

  const onSubmitHandler = () => {
    const formValue = getValues();
    if (isEditMode) {
      updateCallback(alterSubmitValues(formValue), selectedCallback?.id);
    } else {
      createCallback(alterSubmitValues(formValue));
    }
  };

  const onSubmit = handleSubmit(onSubmitHandler);

  const handleCloseAction = () => {
    reset();
    handleCancel(false);
  };

  useEffect(() => {
    if (selectedCallback !== undefined) {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createCallback = (data: any) => {
    addCallBack(
      {
        data,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(["getAllCallbacks"]);
          handleSuccessMessage(`Callback '${data.callbackUrl}'`, "created");
          handleCancel(false);
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

  const updateCallback = (data: any, id: any) => {
    updateCallBack(
      {
        data,
        id,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(["getAllCallbacks"]);
          handleSuccessMessage(`Callback '${data.callbackUrl}'`, "Updated");
          handleCancel(false);
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

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit}>
        <Box padding={2}>
          <Typography variant="h3" sx={{ paddingTop: 2, paddingBottom: 1 }}>
            {labels.serviceText} <span style={{ color: "black" }}>*</span>
          </Typography>
          <DropDownController
            controllerName="serviceId"
            isRequired
            placeHolder={labels.selectService}
            disabled={isEditMode}
          >
            {servicesList.map((data) => {
              return (
                <MenuItem
                  key={data.service.id}
                  value={data.service.id}
                  sx={MenuItemStyle}
                >
                  {data.service.name}
                </MenuItem>
              );
            })}
          </DropDownController>
          <Typography variant="h3" sx={{ paddingTop: 2, paddingBottom: 1 }}>
            {labels.callbackUrlText} <span style={{ color: "black" }}>*</span>
          </Typography>
          <TextFieldController
            key="callbackUrl"
            control={control}
            controllerName="callbackUrl"
            label={labels.callbackUrlText}
            textFieldType="text"
            errorMessage={errors.callbackUrl?.message as string}
            inputPadding={1}
            isRequired
          />

          <Typography variant="h3" sx={{ paddingTop: 2, paddingBottom: 1 }}>
            {labels.authHeaderKeyText}
            <span style={{ color: "black" }}>*</span>
          </Typography>
          <TextFieldController
            key="authHeaderKey"
            control={control}
            controllerName="authHeaderKey"
            label={labels.authHeaderKeyText}
            textFieldType="text"
            errorMessage={errors.authHeaderKey?.message as string}
            inputPadding={1}
            isRequired
          />

          <Typography variant="h3" sx={{ paddingTop: 2, paddingBottom: 1 }}>
            {labels.authHeaderValueText}
            <span style={{ color: "black" }}>*</span>
          </Typography>
          <TextFieldController
            key="authHeaderValue"
            control={control}
            controllerName="authHeaderValue"
            label={labels.authHeaderValueText}
            textFieldType="text"
            errorMessage={errors.authHeaderValue?.message as string}
            inputPadding={1}
            isRequired
          />
          <Typography variant="h3" sx={{ paddingTop: 2, paddingBottom: 1 }}>
            {labels.descriptionText}
          </Typography>
          <TextFieldController
            key="description"
            control={control}
            controllerName="description"
            label={labels.descriptionText}
            textFieldType="text"
            errorMessage={errors.description?.message as string}
            inputPadding={1}
          />
          <Typography variant="h3" sx={{ paddingTop: 2, paddingBottom: 1 }}>
            {labels.status}
          </Typography>
          <DropDownController controllerName="isActive" isRequired>
            {userStatus.map((data) => {
              return (
                <MenuItem
                  key={data.value}
                  value={data.value}
                  sx={MenuItemStyle}
                >
                  {data.name}
                </MenuItem>
              );
            })}
          </DropDownController>
        </Box>

        <Stack
          direction="row"
          display="flex"
          justifyContent="center"
          paddingBottom={2}
          spacing={2}
        >
          <LoadingButton
            loading={isAddingRole || isEditingRole}
            disabled={isSaveBtnEnabled}
            type="submit"
            sx={{
              maxWidth: 50,
              color: "white",
              fontFamily: "SegoeUI",
              textTransform: "capitalize",
              backgroundColor: "primary.cyan",
              "&:hover": {
                backgroundColor: "primary.cyan",
              },
            }}
          >
            {labels.save}
          </LoadingButton>
          <Button
            sx={{
              color: "black",
              border: "1px solid",
              borderColor: "primary.textLightGray",
              textTransform: "capitalize",
              backgroundColor: "primary.white",
              "&:hover": {
                backgroundColor: "primary.white",
              },
            }}
            onClick={handleCloseAction}
          >
            {labels.cancel}
          </Button>
        </Stack>
      </form>
    </FormProvider>
  );
};

export default CallbackForm;
