import { Controller, useFormContext } from "react-hook-form";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import TextFieldErrorComponent from "~/core/components/FormComponents/TextFieldErrorComponent";
import { CustomDropDownControllerProps } from "~/core/components/interface";

const DropDownController = ({
  controllerName,
  label,
  headingColor,
  children,
  isRequired,
  disabled,
  onSelectChange,
  defaultSelectedValue,
  placeHolder,
  showToolTip,
}: CustomDropDownControllerProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  return (
    <Controller
      name={controllerName}
      control={control}
      render={({ field: { onChange, value } }) => (
        <FormControl fullWidth>
          <Stack direction="column" width="100%" spacing={1.2}>
            {label && (
              <Typography
                color={headingColor ? headingColor : "black"}
                variant="h2"
              >
                {isRequired ? `${label} *` : label}
              </Typography>
            )}
            <Tooltip
              title={placeHolder}
              placement="top-start"
              disableHoverListener={!showToolTip}
            >
              <Select
                fullWidth
                disabled={disabled}
                displayEmpty
                value={value}
                defaultValue={defaultSelectedValue}
                sx={{
                  // marginTop: 2,
                  height: 40,
                  fontSize: 16,
                  fontWeight: 400,
                  backgroundColor: "secondary.white",
                  "& .MuiInputBase-input.Mui-disabled": {
                    /* eslint-disable @typescript-eslint/naming-convention */
                    WebkitTextFillColor: "primary.greyText",
                  },
                  "& .MuiSelect-select .notranslate::after": placeHolder
                    ? {
                        content: `"${placeHolder}"`,
                        opacity: 0.42,
                      }
                    : {},
                }}
                size="small"
                onChange={(newValue) => {
                  onChange(newValue);
                  if (onSelectChange) onSelectChange(newValue);
                }}
              >
                {children}
              </Select>
            </Tooltip>

            {errors[controllerName]?.message && (
              <Grid
                display="flex"
                flexDirection="row"
                justifyContent="flex-end"
              >
                <TextFieldErrorComponent
                  controllerName={controllerName}
                  errorMessage={errors[controllerName]?.message}
                />
              </Grid>
            )}
          </Stack>
        </FormControl>
      )}
    />
  );
};

export default DropDownController;
