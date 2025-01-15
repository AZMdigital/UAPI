/* eslint-disable no-nested-ternary */
import { useCallback, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { debounce, get } from "lodash";

import TextFieldErrorComponent from "~/core/components/FormComponents/TextFieldErrorComponent";
import { SearchTextFieldControllerProps } from "~/core/components/interface";
import { textfieldStyle } from "~/core/components/style";

const debounceDelayDuration = 600;
const SearchTextFieldComponent = ({
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
  searchName,
  isLoading,
  errorMessage,
}: SearchTextFieldControllerProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const classes = textfieldStyle();

  const [isValidationStarted, setValidationStarted] = useState(false);
  const [isValidationFinished, setValidationFinished] = useState(false);
  const [isSearchStatus, setStatus] = useState<boolean>();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const delayedSearch = useCallback(
    debounce(async (searchValue) => {
      if (searchValue.length >= 1) {
        setValidationStarted(true);
        setStatus(await searchName(searchValue));
        setValidationFinished(true);
      } else {
        setValidationStarted(false);
        setValidationFinished(false);
      }
    }, debounceDelayDuration),
    []
  );

  const onKeywordChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const searchValue = event.target.value;
    delayedSearch(searchValue);
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
            sx={{ backgroundColor: "secondry.white" }}
            onChange={(...params) => {
              onChange(...params);
              onKeywordChange(...params);
              if (handleChange) handleChange();
            }}
            onBlur={onBlur}
            type={textFieldType}
            inputRef={ref}
            error={!!get(errors, controllerName)?.message}
            InputProps={{
              style: {
                fontStyle: "normal",
                fontWeight: 400,
                fontSize: "16px",
                lineHeight: "26px",
              },
              endAdornment: showIcon && (
                <InputAdornment position="end">{showIcon}</InputAdornment>
              ),
              startAdornment: isValidationStarted && (
                <InputAdornment
                  position="start"
                  sx={{
                    position: "absolute",
                    right: 5,
                    cursor: "pointer",
                  }}
                >
                  {isLoading ? (
                    <CircularProgress color="inherit" size={15} />
                  ) : isSearchStatus && isValidationFinished ? (
                    <CheckIcon
                      fontSize="small"
                      sx={{
                        color: "green",
                      }}
                    />
                  ) : (
                    <CloseIcon
                      fontSize="small"
                      sx={{
                        color: "red",
                      }}
                    />
                  )}
                </InputAdornment>
              ),
            }}
            disabled={isDisabled}
          />
          {!isSearchStatus &&
            isValidationFinished &&
            !get(errors, controllerName)?.message && (
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

export default SearchTextFieldComponent;
