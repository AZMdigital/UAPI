import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";

import { ToggleSwitchProps } from "~/core/components/interface";

export default function ToggleSwitch({
  isChecked,
  handleChecked,
  label,
  disabled,
}: ToggleSwitchProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleChecked(event.target.checked);
  };

  const AntSwitch = styled(Switch)(({ theme }) => ({
    width: 41,
    height: 20,
    padding: 0,
    display: "flex",
    "&:active": {
      "& .MuiSwitch-thumb": {
        width: 41,
      },
      "& .MuiSwitch-switchBase.Mui-checked": {
        transform: "translateX(0px)",
      },
    },
    "& .MuiSwitch-switchBase": {
      padding: 2,
      "&.Mui-checked": {
        transform: "translateX(21px)",
        color: "#fff",
        "& + .MuiSwitch-track": {
          opacity: 1,
          backgroundColor: "#00BABE",
        },
      },
    },
    "& .MuiSwitch-thumb": {
      boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
      width: 16,
      height: 16,
      borderRadius: 10,
      transition: theme.transitions.create(["width"], {
        duration: 200,
      }),
    },
    "& .MuiSwitch-track": {
      borderRadius: 20 / 2,
      opacity: 1,
      backgroundColor:
        theme.palette.mode === "dark"
          ? "rgba(255,255,255,.35)"
          : "rgba(0,0,0,.25)",
      boxSizing: "border-box",
    },
  }));

  return (
    <Stack direction="row" width="100%" spacing={1}>
      <AntSwitch
        size="medium"
        defaultChecked={isChecked}
        onChange={handleChange}
        disabled={disabled}
        inputProps={{ "aria-label": "controlled" }}
      />
      {label && (
        <Typography color="black" variant="h2">
          {label}
        </Typography>
      )}
    </Stack>
  );
}
