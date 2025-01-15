import { Controller, useFormContext } from "react-hook-form";
import CheckIcon from "@mui/icons-material/Check";
import Autocomplete from "@mui/material/Autocomplete";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { get, isEmpty } from "lodash";

import TextFieldErrorComponent from "~/core/components/FormComponents/TextFieldErrorComponent";
import { CustomTextFieldControllerProps } from "~/core/components/interface";

const AutoCompleteMultiSelect = ({
  controllerName,
  isDisabled,
  showHeading,
  headingText,
  headingColor,
  marginTop,
  isRequired,
  options,
  size,
  showBottomHeading,
  bottomHeadingText,
  placeHolderText,
}: CustomTextFieldControllerProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Controller
      name={controllerName}
      control={control}
      defaultValue={null}
      render={({ field: { onChange, value, ref } }) => (
        <Stack direction="column" width="100%" spacing={1}>
          {showHeading && (
            <Typography
              color={headingColor ? headingColor : "black"}
              variant="h2"
              marginTop={marginTop}
            >
              {isRequired ? `${headingText} *` : headingText}
            </Typography>
          )}
          <Autocomplete
            // limitTags={3}
            value={value}
            multiple
            options={options!}
            size="small"
            onChange={(event: any, newValue) => {
              onChange(newValue ? newValue : null);
            }}
            sx={{
              fontSize: 16,
              overflow: "auto",
              maxHeight: 100,
            }}
            disableCloseOnSelect
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={(item) => item.name}
            disabled={isDisabled}
            renderInput={(params) => (
              <TextField
                {...params}
                inputRef={ref}
                InputProps={{
                  ...params.InputProps,
                  style: {
                    marginTop: 2,
                    overflow: "auto",
                    fontSize: 16,
                    fontWeight: 400,
                    backgroundColor: "secondary.white",
                  },
                }}
                size={size || "small"}
                fullWidth
                error={false}
                disabled={isDisabled}
                placeholder={isEmpty(value) ? placeHolderText || "" : ""}
              />
            )}
            renderOption={(props, option, { selected }) => (
              <MenuItem
                {...props}
                key={option.name}
                value={option.name}
                sx={{ justifyContent: "space-between" }}
              >
                {option.name}
                {selected ? <CheckIcon color="info" /> : null}
              </MenuItem>
            )}
          />
          {showBottomHeading && !get(errors, controllerName)?.message && (
            <Typography color="primary.main" variant="h2">
              {bottomHeadingText}
            </Typography>
          )}
          {get(errors, controllerName)?.message && (
            <Grid display="flex" flexDirection="row" justifyContent="flex-end">
              <TextFieldErrorComponent
                controllerName={controllerName}
                errorMessage={get(errors, controllerName)?.message}
              />
            </Grid>
          )}
        </Stack>
      )}
    />
  );
};

export default AutoCompleteMultiSelect;
