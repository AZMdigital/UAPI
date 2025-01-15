import { createTheme } from "@mui/material/styles";

import { defaultPalette } from "~/styles/palette";
import { typography } from "~/styles/typography";

export default function theme({ theme }: any) {
  const styles = {
    palette: defaultPalette(theme),
    typography,
  };
  return createTheme({ ...styles } as any);
}
