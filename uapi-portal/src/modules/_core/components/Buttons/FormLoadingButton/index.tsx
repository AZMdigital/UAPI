import { FC } from "react";
import LoadingButton from "@mui/lab/LoadingButton";

interface FormLoadingButtonProps {
  buttonType?: "submit" | "reset" | "button" | undefined;
  isLoading?: boolean;
  children: React.ReactNode;
  onClickEvent?: any;
  backgroundColor?: string;
  fullwidth?: boolean;
  color?: string;
  paddingY?: string | number;
  height?: number;
  buttonVariant?: "outlined" | "contained";
  disabled?: boolean;
  id?: string;
}

const FormLoadingButton: FC<FormLoadingButtonProps> = ({
  children,
  isLoading,
  onClickEvent,
  buttonType,
  buttonVariant,
  disabled,
  fullwidth,
  backgroundColor,
  color,
  paddingY,
  height,
  id,
}) => {
  return (
    <LoadingButton
      disableElevation
      type={buttonType}
      variant={buttonVariant}
      loading={isLoading}
      onClick={onClickEvent}
      fullWidth={fullwidth}
      disabled={disabled}
      id={id}
      sx={{
        color: color || "",
        fontSize: 16,
        fontWeight: 400,
        fontFamily: "SegoeUI",
        paddingY: paddingY || "10.5",
        height,
        textTransform: "capitalize",
        backgroundColor: backgroundColor || "primary.main",
        "&:hover": {
          backgroundColor: backgroundColor || "primary.main",
        },
      }}
    >
      {children}
    </LoadingButton>
  );
};

export default FormLoadingButton;
