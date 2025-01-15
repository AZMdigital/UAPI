import { Controller, useFormContext } from "react-hook-form";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import TextFieldErrorComponent from "~/core/components/FormComponents/TextFieldErrorComponent";
import { CustomRadioGroupControllerProps } from "~/core/components/interface";

const RadioGroupComponent = ({
  controllerName,
  label,
  headingColor,
  isRequired,
  disabled,
  onSelectChange,
  options,
  readonly,
  rowDirection,
}: CustomRadioGroupControllerProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Controller
      name={controllerName}
      control={control}
      defaultValue=""
      render={({ field: { onChange, value } }) => (
        <FormControl fullWidth>
          <Stack direction="column" width="100%" spacing={1.2}>
            <Typography
              color={headingColor ? headingColor : "black"}
              variant="h2"
            >
              {isRequired ? `${label} *` : label}
            </Typography>
            <RadioGroup
              id={controllerName}
              row={rowDirection}
              aria-label={label}
              name={controllerName}
              value={value}
              onChange={(event: any) => {
                if (!readonly) {
                  const newValue = event.target.value;
                  onChange(newValue);
                  if (onSelectChange) onSelectChange(newValue);
                }
              }}
            >
              {options?.map((option: any) => (
                <FormControlLabel
                  key={option.id}
                  value={option.value}
                  control={<Radio id={option.id} />}
                  label={option.label}
                  disabled={disabled}
                  sx={{
                    backgroundColor: "secondary.white",
                    "& .MuiInputBase-input.Mui-disabled": {
                      /* eslint-disable @typescript-eslint/naming-convention */
                      WebkitTextFillColor: "black",
                    },
                  }}
                />
              ))}
            </RadioGroup>

            {errors[controllerName]?.message && (
              <TextFieldErrorComponent
                controllerName={controllerName}
                errorMessage={errors[controllerName]?.message}
              />
            )}
          </Stack>
        </FormControl>
      )}
    />
  );
};

export default RadioGroupComponent;
