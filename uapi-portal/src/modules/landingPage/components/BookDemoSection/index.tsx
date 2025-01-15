/* eslint-disable @typescript-eslint/naming-convention */
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Image from "next/image";

import CTASection from "~/public/assets/CTA_Section.svg";

export const BookDemoSection = () => {
  return (
    <Grid container justifyContent="center" alignItems="center" paddingTop={20}>
      <Grid item xs={10} justifyContent="center" alignItems="center">
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap={5}
          sx={{
            width: "100%",
            borderRadius: 3,

            background: `
      linear-gradient(
        0deg, 
        rgba(0,185,190,0.32) 0%, 
        rgba(0,185,190,0.16) 18.1%, 
        rgba(17,37,57,0.16) 75.1%, 
        #112539 100%
      ),
      #112539
    `,
            position: "relative",
          }}
        >
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            paddingTop={6}
            width="100%"
          >
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              width="100%"
              gap={2}
              paddingBottom={1}
            >
              <Typography
                color="white"
                textAlign="center"
                sx={{
                  fontFamily: "'Segoe UI Bold', Helvetica",
                  fontSize: 30,
                  fontWeight: 600,
                }}
              >
                Experience The Power Of Our APIs
              </Typography>
              <Typography
                variant="body1"
                color="white"
                textAlign="center"
                paragraph
                sx={{
                  fontFamily: "'Segoe UI Regular', Helvetica",
                  backgroundClip: "text",
                  fontSize: 16,
                }}
              >
                Ready to see how our API services can transform your business?{" "}
                <br />
                Book a personalized demo today and explore our powerful
                features, that will streamline your workflows &amp; enhance your
                development processes.
              </Typography>
              <Button
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  borderRadius: 50,
                  boxShadow: "inset 4px 4px 10px #ffffff40",
                  padding: "10px 24px",
                  fontSize: 14,
                  backgroundColor: "#4e6d8e33", // "primary.cyan",
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "primary.cyan",
                  },
                }}
              >
                <Typography
                  variant="body2"
                  color="white"
                  sx={{
                    fontFamily: "'Segoe UI Bold', Helvetica",
                    fontWeight: "bold",
                  }}
                >
                  Book a Demo
                </Typography>
              </Button>
            </Box>
          </Box>

          <Box
            sx={{
              width: "100%",
              // height: "500px",
              position: "relative",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Image
              src={CTASection}
              alt="CTASection"
              style={{ objectFit: "contain", width: "100%" }}
            />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};
