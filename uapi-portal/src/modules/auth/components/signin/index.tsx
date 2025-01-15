import { Card } from "@mui/material";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import type { NextPage } from "next";
import Image from "next/image";

import { labels } from "~/utils/labels";

import SignInForm from "~/modules/auth/components/signin/components/SigninForm";

import ULogo from "~/public/assets/Uapi_logo.svg";

const SignIn: NextPage = () => {
  return (
    <Grid
      container
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      spacing={3}
    >
      {/* Left Column */}
      <Grid
        item
        container
        display="flex"
        direction="column"
        justifyContent="space-between"
        alignItems="center"
        xs={12}
        sm={12}
        md={6}
        lg={6}
      >
        {/* Image section */}
        <Grid
          item
          display="flex"
          direction="column"
          alignItems="center"
          sx={{ flexGrow: 1, marginBottom: { xs: 2, sm: 2, md: 0 } }}
        >
          <Image src={ULogo} alt="" width={230} height={230} />
          <Typography variant="h6" color="primary.blackishGray">
            {`Version : ${process.env.NEXT_PUBLIC_APP_VERSION}`}
          </Typography>
        </Grid>

        {/* Form section */}
        <Grid
          item
          display="flex"
          width="80%"
          justifyContent="center"
          sx={{ flexGrow: 1, marginBottom: { xs: 2, sm: 2, md: 0 } }}
        >
          <SignInForm />
        </Grid>
      </Grid>

      {/* Right Column */}
      <Grid
        item
        container
        display="flex"
        direction="column"
        justifyContent="center"
        alignItems="center"
        xs={12}
        sm={12}
        md={6}
        lg={6}
        sx={{
          backgroundImage: `url('/assets/Isolation_Mode.svg')`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          height: "100%",
        }}
      >
        {/* Video section */}
        <Grid
          item
          display="flex"
          width="80%"
          justifyContent="center"
          direction="column"
          sx={{ flexGrow: 1, marginTop: "15px", alignItems: "center" }}
        >
          {/* Heading section */}
          <Typography
            variant="h1"
            sx={{
              fontSize: {
                xs: "1.3rem",
                sm: "1.2rem",
                md: "1.95rem",
                large: "3rem",
              },
              fontWeight: 600,
              lineHeight: 1.2,
              textAlign: "center",
              padding: "20px 0",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            <span style={{ color: "#00BABE", display: "inline" }}>
              {labels.saudiAZMIntegration}
            </span>
            <span
              style={{
                color: "#123F6D",
                display: "inline",
                marginLeft: "10px",
              }}
            >
              {labels.videoDescription}
            </span>
          </Typography>

          <Card
            sx={{
              width: "100%",
              maxWidth: "750px",
              height: "auto",
              maxHeight: "450px",
              borderRadius: "15px",
              overflow: "hidden",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
            }}
          >
            <video
              controls
              autoPlay
              muted
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "15px",
              }}
              src="/videos/uapi.mp4"
            />
          </Card>
        </Grid>
      </Grid>
    </Grid>
  );
};
export default SignIn;
