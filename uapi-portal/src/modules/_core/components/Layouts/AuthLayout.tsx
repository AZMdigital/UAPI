import Grid from "@mui/material/Grid";
import Image from "next/image";

import SideImage from "~/public/assets/Isolation_Mode.svg";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Grid
      container
      sx={{ backgroundColor: "secondary.main", overflow: "hidden" }}
    >
      <Grid
        container
        item
        xs={12}
        sm={12}
        md={6}
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
        alignItems="center"
      >
        {children}
      </Grid>
      <Grid
        item
        xs={0}
        sm={0}
        md={6}
        display={{ xs: "none", sm: "none", md: "flex" }}
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Image
          src={SideImage}
          alt=""
          style={{ height: "100vh", width: "100%" }}
        />
      </Grid>
    </Grid>
  );
};

export default AuthLayout;
