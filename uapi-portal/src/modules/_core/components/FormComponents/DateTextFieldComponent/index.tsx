/* eslint-disable @typescript-eslint/naming-convention */
import { Controller, useFormContext } from "react-hook-form";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";

import TextFieldErrorComponent from "~/core/components/FormComponents/TextFieldErrorComponent";
import { CustomTextFieldControllerProps } from "~/core/components/interface";

const DateTextFieldController = ({
  controllerName,
  isDisabled = false,
  showHeading,
  headingText,
  headingColor,
  marginTop,
  isRequired,
  dateFormat,
  minDate,
  maxDate,
  dateViews,
  defaultDate,
  handleChange,
  placeHolderText,
  showToolTip,
}: CustomTextFieldControllerProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Controller
      name={controllerName}
      control={control}
      defaultValue={defaultDate ? defaultDate : null}
      render={({ field: { onChange, value, ref } }) => (
        <Stack direction="column" width="100%" spacing={1.2}>
          {showHeading && (
            <Typography
              color={headingColor ? headingColor : "black"}
              variant="h2"
              marginTop={marginTop}
            >
              {isRequired ? `${headingText} *` : headingText}
            </Typography>
          )}
          <Tooltip
            title={placeHolderText}
            placement="top-start"
            disableHoverListener={!showToolTip}
          >
            <Box sx={{ width: "100%", backgroundColor: "yellow" }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  views={dateViews ? dateViews : ["year", "month", "day"]}
                  defaultValue={dayjs(value)}
                  value={dayjs(value)}
                  format={dateFormat}
                  minDate={minDate}
                  maxDate={maxDate}
                  reduceAnimations
                  slotProps={{
                    monthButton: {
                      sx: {
                        fontSize: "1rem",
                        fontWeight: 400,
                      },
                    },

                    yearButton: {
                      sx: {
                        fontSize: "1rem",
                        fontWeight: 400,
                      },
                    },
                    calendarHeader: {
                      sx: {
                        "& .MuiPickersCalendarHeader-label": {
                          fontSize: "1rem",
                          fontWeight: 400,
                          color: "#202124",
                        },
                      },
                    },
                    day: {
                      sx: {
                        "&.MuiPickersDay-root": {
                          fontSize: "1rem",
                          fontWeight: 400,
                        },
                        "&.MuiDayCalendar-weekDayLabel": {
                          fontSize: "1rem",
                          fontWeight: 400,
                        },
                      },
                    },
                    layout: {
                      sx: {
                        "& .MuiDayCalendar-weekDayLabel": {
                          fontSize: "1rem",
                          fontWeight: 600,
                        },
                      },
                    },
                    actionBar: {
                      actions: ["clear"],
                    },
                    field: {
                      readOnly: true,
                      id: controllerName,
                    },
                    popper: {
                      placement: "top-end",
                    },
                    textField: {
                      fullWidth: true,
                      size: "small",
                      error: false,
                      inputProps: {
                        style: {
                          fontStyle: "normal",
                          fontWeight: 400,
                          fontSize: "16px",
                          lineHeight: "26px",
                        },
                      },
                    },
                  }}
                  onChange={(event: any) => {
                    onChange(event);
                    if (handleChange) handleChange(event);
                  }}
                  inputRef={ref}
                  disabled={isDisabled}
                  sx={{
                    "& .MuiTypography-root-MuiDayCalendar-weekDayLabel": {
                      fontSize: "1rem",
                      fontWeight: 400,
                    },
                    backgroundColor: "secondary.white",
                  }}
                />
              </LocalizationProvider>
            </Box>
          </Tooltip>
          {errors[controllerName]?.message && (
            <Grid display="flex" flexDirection="row" justifyContent="flex-end">
              <TextFieldErrorComponent
                controllerName={controllerName}
                errorMessage={errors[controllerName]?.message}
              />
            </Grid>
          )}
        </Stack>
      )}
    />
  );
};

export default DateTextFieldController;
