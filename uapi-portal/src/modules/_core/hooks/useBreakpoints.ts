import { useEffect } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Theme } from "@mui/system";

export const useBreakpoint = (
  theme: Theme,
  setBreakpoint: (breakpoint: string) => void
) => {
  const isXl = useMediaQuery(theme.breakpoints.up("xl"));
  const isLg = useMediaQuery(theme.breakpoints.between("lg", "xl"));
  const isMd = useMediaQuery(theme.breakpoints.between("md", "lg"));
  const isSm = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isXs = useMediaQuery(theme.breakpoints.between("xs", "sm"));

  useEffect(() => {
    let currentBreakpoint = "xs";

    if (isXl) {
      currentBreakpoint = "xl";
    } else if (isLg) {
      currentBreakpoint = "lg";
    } else if (isMd) {
      currentBreakpoint = "md";
    } else if (isSm) {
      currentBreakpoint = "sm";
    }

    setBreakpoint(currentBreakpoint);
  }, [isXl, isLg, isMd, isSm, isXs, setBreakpoint]);
};
