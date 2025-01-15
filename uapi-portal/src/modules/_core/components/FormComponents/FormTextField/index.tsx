import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { get } from "lodash";

import TextFieldErrorComponent from "~/core/components/FormComponents/TextFieldErrorComponent";
import { CustomTextFieldControllerProps } from "~/core/components/interface";
import { textfieldStyle } from "~/core/components/style";

const FormTextFieldController = ({
  controllerName,
  isDisabled,
  showHeading,
  headingText,
  headingColor,
  handleChange,
  showIcon,
  textFieldType,
  size,
  marginTop,
  isRequired,
  showBottomHeading,
  bottomHeadingText,
  hideErrorMessage,
}: CustomTextFieldControllerProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const classes = textfieldStyle();
  const [showPassword, setShowPassword] = useState(textFieldType);

  const handleClickShowPassword = () => {
    if (showPassword === "text") {
      setShowPassword("password");
    } else {
      setShowPassword("text");
    }
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <Controller
      name={controllerName}
      control={control}
      defaultValue=""
      render={({ field: { onChange, onBlur, value, ref } }) => (
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
          <TextField
            id={controllerName}
            className={classes.customNumberField}
            size={size || "small"}
            fullWidth
            value={value}
            sx={{
              backgroundColor: "secondary.white",
              "& .MuiOutlinedInput-root": {
                "&:has(> input:-webkit-autofill)": {
                  backgroundColor: "primary.autofillbackground",
                },
              },

              "& .MuiInputBase-input.Mui-disabled": {
                /* eslint-disable @typescript-eslint/naming-convention */
                WebkitTextFillColor: "primary.greyText",
              },
            }}
            onChange={(...params) => {
              onChange(...params);
              if (handleChange) handleChange(...params);
            }}
            onBlur={onBlur}
            type={showPassword}
            inputRef={ref}
            error={!!get(errors, controllerName)?.message}
            InputProps={{
              autoComplete: textFieldType === "password" ? "false" : "true",
              style: {
                fontFamily: "SegoeUI",
                fontStyle: "normal",
                fontWeight: 400,
                fontSize: "16px",
                lineHeight: "26px",
              },
              endAdornment:
                textFieldType === "password" ? (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword === "text" ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ) : (
                  showIcon && (
                    <InputAdornment position="end">{showIcon}</InputAdornment>
                  )
                ),
            }}
            disabled={isDisabled}
          />
          {showBottomHeading && !get(errors, controllerName)?.message && (
            <Typography color="primary.main" variant="h2">
              {bottomHeadingText}
            </Typography>
          )}
          {get(errors, controllerName)?.message && !hideErrorMessage && (
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

export default FormTextFieldController;
