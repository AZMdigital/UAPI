import Grid from "@mui/material/Grid";
import Image from "next/image";

import SideImage from "~/public/assets/Isolation_Mode.svg";

const CenteredLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Grid
      container
      sx={{
        backgroundColor: "secondary.main",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Grid
        item
        xs={6}
        display="flex"
        flexDirection="column"
        justifyContent="left"
        alignItems="center"
      />
      <Grid
        item
        xs={6}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="right"
      >
        <Image
          src={SideImage}
          alt=""
          style={{ height: "100vh", width: "100%" }}
        />
      </Grid>

      <Grid container item xs={12} flexDirection="column" position="absolute">
        {children}
      </Grid>
    </Grid>
  );
};

export default CenteredLayout;
