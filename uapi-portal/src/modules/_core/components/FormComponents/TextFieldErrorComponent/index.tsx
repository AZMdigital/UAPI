import Typography from "@mui/material/Typography";
import Stack from "@mui/system/Stack";

import { CustomTextFieldErrorProps } from "~/core/components/interface";

const TextFieldErrorComponent = ({
  errorMessage,
}: CustomTextFieldErrorProps) => {
  return (
    <Stack direction="row">
      <Typography variant="body2" color="error" marginLeft="5px">
        {errorMessage}
      </Typography>
    </Stack>
  );
};

export default TextFieldErrorComponent;
