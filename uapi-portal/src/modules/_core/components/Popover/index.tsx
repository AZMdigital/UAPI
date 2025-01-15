import Popover from "@mui/material/Popover";

import { PopOverComponentInterface } from "~/core/components/interface";

const PopoverComponent = ({
  children,
  open,
  anchorEL,
  handleTogglePopOver,
  key,
}: PopOverComponentInterface) => {
  const id = open ? "logout-popover" : undefined;
  return (
    <Popover
      key={key}
      id={id}
      open={open}
      onClose={() => handleTogglePopOver(null)}
      anchorEl={anchorEL}
      transformOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
    >
      {children}
    </Popover>
  );
};
export default PopoverComponent;
