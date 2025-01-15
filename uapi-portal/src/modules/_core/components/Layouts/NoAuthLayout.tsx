import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Image from "next/image";

import appBarULogo from "~/public/assets/header_uapi.svg";

interface MainlayoutProps {
  children: React.ReactElement;
}
export default function NoAuthlayout({ children }: MainlayoutProps) {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "primary.background",
      }}
    >
      <AppBar sx={{ paddingX: "10px", backgroundColor: "secondary.main" }}>
        <Toolbar sx={{ height: "77px" }}>
          <Box width="40%">
            <Stack
              width="15%"
              display="flex"
              flexDirection="row"
              alignItems="center"
              paddingLeft="19px"
            >
              <Image src={appBarULogo} alt="" height={56} width={66} />
            </Stack>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          width: "100%",
          marginTop: "77px",
          backgroundColor: "primary.background",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
