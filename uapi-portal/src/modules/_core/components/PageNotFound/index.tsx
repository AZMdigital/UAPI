import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Image from "next/image";

import { PageNotFoundProps } from "~/modules/_core/components/interface";

import noServiceSVG from "~/public/assets/404Icon.svg";

const PageNotFound = ({ pageNotFoundText }: PageNotFoundProps) => {
  return (
    <Box
      display="flex"
      width="100%"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
    >
      <Image src={noServiceSVG} alt="" height={62} width={62} />
      <Typography paddingTop={2} variant="h2" color="primary.blackishGray">
        {pageNotFoundText}
      </Typography>
      {/* <Typography fontSize="20px" fontWeight={700} fontFamily="SegoeUI">
        {labels.pageNotFound}
        
      </Typography> */}
    </Box>
  );
};
export default PageNotFound;
