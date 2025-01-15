import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQueryClient } from "@tanstack/react-query";

import { handleSuccessMessage } from "~/utils/helper";

import { useAddUpdateHeaders } from "~/rest/apiHooks/customHeaders";

import { CustomeHeaderFormProps } from "~/modules/profile/interface/profile";
import { customHeaderFormSchema } from "~/modules/profile/utils/headerFormSchema";
import { labels } from "~/modules/profile/utils/labels";

import TextFieldController from "~/core/components/FormComponents/TextFieldComponent";

const HeaderForm = ({
  isEditMode,
  headersList,
  selectedHeader,
  handleCancel,
  handleUpdate,
}: CustomeHeaderFormProps) => {
  const queryClient = useQueryClient();
  const { mutateAsync: updateHeader, isLoading } = useAddUpdateHeaders();
  const methods = useForm({
    defaultValues: {
      key: "",
      value: "",
    },
    reValidateMode: "onChange",
    mode: "all",
    criteriaMode: "all",
    resolver: yupResolver(customHeaderFormSchema, {
      abortEarly: false,
    }),
  });
  const {
    setValue,
    getValues,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = methods;

  const onSubmitHandler = () => {
    const formValue = getValues();
    const currentHeaders = [...headersList];
    if (isEditMode) {
      // In edit mode we will update values at selected index
      const index = currentHeaders.findIndex(
        (item: any) => item.id === selectedHeader.id
      );
      if (index !== -1) {
        currentHeaders[index] = { key: formValue.key, value: formValue.value };
      }
    } else {
      // In create mode just add the value
      currentHeaders.push(formValue);
    }

    // Do API call to update or create new Header
    updateHeader(
      { list: currentHeaders },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(["getAllCustomHeaders"]);
          handleUpdate();
          handleSuccessMessage(
            `${labels.headertext} '${
              `${formValue.key} : ${formValue.value}` ?? ""
            }'`,
            isEditMode ? labels.updated : labels.added
          );
          handleCancel(false);
        },
        onError: (error: any) => {
          const status =
            error?.error?.response?.status || error?.response?.status;

          if (status === 403) {
            // handleErroMessage(labels.forbiddenText);
          }
          handleCancel(false);
        },
      }
    );
  };

  const onSubmit = handleSubmit(onSubmitHandler);

  const handleCloseAction = () => {
    reset();
    handleCancel(false);
  };

  useEffect(() => {
    if (selectedHeader !== undefined) {
      setValue("key", selectedHeader.key);
      setValue("value", selectedHeader.value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit}>
        <Box padding={2}>
          <Typography variant="h3" sx={{ paddingTop: 2, paddingBottom: 1 }}>
            {labels.keyText}
          </Typography>
          <TextFieldController
            key="key"
            control={control}
            controllerName="key"
            label={labels.keyText}
            textFieldType="text"
            errorMessage={errors.key?.message as string}
            inputPadding={1}
          />

          <Typography variant="h3" sx={{ paddingTop: 2, paddingBottom: 1 }}>
            {labels.valueText}
          </Typography>
          <TextFieldController
            key="value"
            control={control}
            controllerName="value"
            label={labels.valueText}
            textFieldType="text"
            errorMessage={errors.value?.message as string}
            inputPadding={1}
          />
        </Box>

        <Stack
          direction="row"
          display="flex"
          justifyContent="center"
          paddingBottom={2}
          spacing={2}
        >
          <LoadingButton
            loading={isLoading}
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

export default HeaderForm;
