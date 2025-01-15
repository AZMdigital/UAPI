import { useState } from "react";
import { Controller } from "react-hook-form";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import TextFieldErrorComponent from "~/core/components/FormComponents/TextFieldErrorComponent";
import { CustomTextFieldControllerProps } from "~/core/components/interface";

const TextFieldController = ({
  control,
  controllerName,
  isDisabled = false,
  showHeading,
  headingText,
  handleChange,
  showIcon,
  textFieldType,
  marginTop,
  size,
  borderRadius,
  errorMessage,
  labelColor,
  inputPadding,
  height,
}: CustomTextFieldControllerProps) => {
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
      render={({ field: { onChange, onBlur, value, ref }, fieldState }) => (
        <>
          {showHeading && (
            <Typography
              color={labelColor || "primary.main"}
              variant="h5"
              marginTop={marginTop}
            >
              {headingText}
            </Typography>
          )}
          <Stack padding={0} direction="column" width="100%">
            <TextField
              size={size}
              fullWidth
              margin="dense"
              value={value}
              onChange={(...params) => {
                onChange(...params);
                if (handleChange) handleChange(...params);
              }}
              // // sx={{
              // //   "& .MuiOutlinedInput-root": {
              // //     "& input": {
              // //       padding: inputPadding,
              // //     },
              // //   },
              // }}
              onBlur={onBlur}
              type={showPassword}
              inputRef={ref}
              error={!!fieldState.invalid}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "primary.layoutBg",
                  "&:has(> input:-webkit-autofill)": {
                    backgroundColor: "primary.autofillbackground",
                  },
                },
                "& .MuiOutlinedInput-input": {
                  padding: inputPadding,
                  borderRadius: "4px",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
              }}
              InputProps={{
                sx: {
                  textAlign: "center",
                  fontStyle: "normal",
                  fontWeight: 400,
                  fontSize: 16,
                  lineHeight: "26px",
                  height,
                  borderRadius,
                  backgroundColor: "secondary.main",
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
                          <Visibility />
                        ) : (
                          <VisibilityOff />
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

            {fieldState.invalid && (
              <Grid
                display="flex"
                flexDirection="row"
                justifyContent="flex-end"
              >
                <TextFieldErrorComponent
                  controllerName={controllerName}
                  errorMessage={errorMessage}
                />
              </Grid>
            )}
          </Stack>
        </>
      )}
    />
  );
};

export default TextFieldController;
