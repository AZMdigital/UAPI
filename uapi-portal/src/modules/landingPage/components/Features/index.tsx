import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Image from "next/image";

import featureOne from "~/public/assets/feature1.svg";
import featureThreeSub from "~/public/assets/feature3Sub.svg";
import featureFour from "~/public/assets/feature4.svg";
import featureTwo from "~/public/assets/featureTwo.svg";

export const Features = () => {
  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      paddingTop={2}
      sx={{ backgroundColor: "white" }}
    >
      <Grid item xs={10} justifyContent="center" alignItems="center">
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          width="100%"
        >
          <Typography
            sx={{
              color: "gray",
              textAlign: "center",
              fontWeight: 600,
              fontSize: 14,
              marginTop: "3rem",
              marginBottom: "0.5rem",
            }}
          >
            OUR FEATURES
          </Typography>
          <Typography
            sx={{
              fontFamily: "'Segoe UI', Arial, Helvetica, sans-serif",
              fontWeight: 900,
              fontSize: 36,
            }}
            align="center"
          >
            <span style={{ color: "#111b29" }}>UAPI </span>
            <span style={{ color: "#00b9be" }}>Features</span>
          </Typography>
          <Typography
            sx={{
              paddingTop: 2,
              fontFamily: "'Segoe UI Regular', Helvetica",
              fontWeight: 400,
              fontSize: 16,
            }}
            color="black"
            align="center"
          >
            Providing connectivity services for APIs contributes to improving
            the quality and efficiency of the service provided in addition{" "}
            <br />
            to enabling flexible keeping pace with market requirements and
            stimulating it
          </Typography>
        </Box>

        <Grid
          container
          columnGap={5.5}
          rowGap={5.5}
          justifyContent="center"
          paddingTop={8}
          paddingBottom={2}
        >
          <Grid item>
            <Paper
              elevation={3}
              sx={{
                width: 290,
                height: 380,
                backgroundColor: "#f8f9fc66",
                border: "1px solid #d3d3d3",
                boxShadow: "4px 4px 10px #0000001a",
                borderRadius: 2,
                // padding: 1.5,
              }}
            >
              <Image
                src={featureOne}
                alt="featureOne"
                style={{ objectFit: "cover", paddingTop: 50 }}
              />
              <Box
                display="flex"
                flexDirection="column"
                // gap={1.5}
                position="relative"
                top={20}
                paddingX={2}
              >
                <Typography
                  sx={{
                    fontFamily: "'Segoe UI', Arial, Helvetica, sans-serif",
                    fontWeight: 600,
                    fontSize: 20,
                  }}
                  color="textPrimary"
                >
                  Full digital onboarding process for subscribers
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "'Segoe UI', Arial, Helvetica, sans-serif",
                    fontWeight: 400,
                    fontSize: 16,
                  }}
                  color="textSecondary"
                  align="left"
                >
                  Designed to be seamless and user-friendly, offering smooth
                  digital access and variety of online payment options to ensure
                  a hassle-free experience.
                </Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item>
            <Paper
              elevation={3}
              sx={{
                width: 290,
                height: 380,
                backgroundColor: "#f8f9fc66",
                border: "1px solid #d3d3d3",
                boxShadow: "4px 4px 10px #0000001a",
                borderRadius: 2,
                position: "relative",
                // padding: 1.5,
              }}
            >
              <Image
                src={featureTwo}
                alt="featureTwo"
                style={{ objectFit: "cover", paddingTop: 2 }}
              />
              <Box
                display="flex"
                flexDirection="column"
                gap={1.5}
                position="absolute"
                sx={{ top: "187px" }}
                paddingX={2}
              >
                <Typography
                  color="textPrimary"
                  align="left"
                  sx={{
                    fontFamily: "'Segoe UI', Arial, Helvetica, sans-serif",
                    fontWeight: 600,
                    fontSize: 20,
                  }}
                >
                  Account Management
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "'Segoe UI', Arial, Helvetica, sans-serif",
                    fontWeight: 400,
                    fontSize: 16,
                  }}
                  color="textSecondary"
                  align="left"
                >
                  Providing user-friendly developers portal with ability to
                  configure your business while providing full access to the
                  services marketplace.
                </Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item>
            <Paper
              elevation={3}
              sx={{
                width: 290,
                height: 380,
                paddingX: 3,
                boxShadow: "4px 4px 10px #0000001a",
                background: `
      linear-gradient(
        180deg, 
        rgba(0,185,190,0.32) 0%, 
        rgba(0,185,190,0.16) 18.1%, 
        rgba(17,37,57,0.16) 75.1%, 
        #112539 100%
      ),
      #112539
    `,
                borderRadius: 2,
                paddingBottom: 3,
              }}
            >
              <Box
                sx={{
                  position: "relative", // Positioning
                  paddingLeft: 8, // Padding around the image
                  display: "inline-block", // To keep the image within its bounds
                }}
              >
                <Image
                  src={featureThreeSub}
                  alt="featureThreeSub"
                  style={{ objectFit: "cover" }}
                />
              </Box>

              <Box
                display="flex"
                flexDirection="column"
                gap={1.5}
                position="relative"
                top={8}
              >
                <Typography
                  sx={{
                    fontFamily: "'Segoe UI', Arial, Helvetica, sans-serif",
                    fontWeight: 600,
                    fontSize: 20,
                  }}
                  color="white"
                  align="left"
                >
                  API Management
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "'Segoe UI', Arial, Helvetica, sans-serif",
                    fontWeight: 400,
                    fontSize: 16,
                  }}
                  color="white"
                  align="left"
                >
                  Implementing security best practices, API framework features
                  comprehensive API specifications & versioning, ensuring a
                  centralized location for all APIs.
                </Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item>
            <Paper
              elevation={3}
              sx={{
                width: 290,
                height: 380,
                backgroundColor: "#f8f9fc66",
                border: "1px solid #d3d3d3",
                boxShadow: "4px 4px 10px #0000001a",
                borderRadius: 2,
                // paddingY: 1.3,
              }}
            >
              <Image
                src={featureFour}
                alt="featureFour"
                style={{ objectFit: "cover", paddingTop: 2 }}
              />
              <Box
                display="flex"
                flexDirection="column"
                gap={1.5}
                position="relative"
                top={41}
                paddingX={2}
              >
                <Typography
                  sx={{
                    fontFamily: "'Segoe UI', Arial, Helvetica, sans-serif",
                    fontWeight: 600,
                    fontSize: 20,
                  }}
                  color="textPrimary"
                  align="left"
                >
                  Analytics & Reporting
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "'Segoe UI', Arial, Helvetica, sans-serif",
                    fontWeight: 400,
                    fontSize: 16,
                  }}
                  color="textSecondary"
                  align="left"
                >
                  Users can access detailed financial consumption reports and
                  benefit from customized dashboards that provide insightful
                  visualizations.
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
