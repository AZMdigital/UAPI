import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

import { LoadingViewInterface } from "~/core/components/interface";

const LoadingView = ({ height }: LoadingViewInterface) => {
  return (
    <Box
      width="100%"
      height={height}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <CircularProgress size={40} />
    </Box>
  );
};

export default LoadingView;
