import { Controller, useFormContext } from "react-hook-form";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";

import { CheckboxControllerProps } from "~/core/components/interface";

const CheckboxComponent = ({
  controllerName,
  label,
  toolTiptext,
  showToolTip,
  disabled,
}: CheckboxControllerProps) => {
  const { control } = useFormContext();
  return (
    <Controller
      name={controllerName}
      control={control}
      defaultValue={false}
      render={({ field: { onChange, value } }) => (
        <Stack direction="row">
          <FormControl fullWidth>
            <FormControlLabel
              control={
                <Checkbox
                  checked={value}
                  onChange={onChange}
                  disabled={disabled}
                />
              }
              label={label}
            />
          </FormControl>
          {showToolTip && (
            <Tooltip title={toolTiptext} sx={{ padding: 0 }} placement="top">
              <IconButton disableRipple color="primary">
                <InfoOutlinedIcon />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      )}
    />
  );
};

export default CheckboxComponent;
