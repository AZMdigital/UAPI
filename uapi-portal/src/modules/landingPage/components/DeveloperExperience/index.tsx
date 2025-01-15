/* eslint-disable @typescript-eslint/naming-convention */
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Image from "next/image";

import CodeBold from "~/public/assets/codeBold.svg";
import developerExperience from "~/public/assets/developerExperience.svg";

export const DeveloperExperience = () => {
  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      // paddingTop={20}
      // marginTop={20}
      sx={{
        animation: `slideUp 1s forwards`,
        animationDelay: `2s`,
        opacity: "0",
      }}
    >
      <style>
        {`
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(300px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
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
            paddingTop={8}
            width="100%"
          >
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              width="100%"
              gap={1.5}
              paddingBottom={1}
            >
              <Typography
                color="white"
                textAlign="center"
                sx={{
                  fontFamily: "'Segoe UI Semibold', Helvetica",
                  fontSize: 14,
                  fontWeight: 400,
                }}
              >
                OUR DEVELOPER EXPERIENCE
              </Typography>
              <Typography
                variant="h4"
                textAlign="center"
                sx={{
                  fontFamily: "'Segoe UI Black', Helvetica",
                  fontWeight: 600,
                  fontSize: 36,
                  textAlign: "center",
                  color: "transparent",
                  backgroundClip: "text",
                  backgroundColor: "white",
                }}
              >
                <span>UAPI </span>
                <span style={{ color: "#00b9be" }}>Developer Experience</span>
              </Typography>
            </Box>
            <Typography
              variant="body1"
              color="white"
              textAlign="center"
              sx={{
                fontFamily: "'Segoe UI Regular', Helvetica",
                backgroundClip: "text",
                fontSize: 14,
              }}
            >
              Our platform is designed with developers in mind, offering a
              seamless & intuitive experience.
              <br /> With comprehensive documentation & user-friendly APIs, you
              can easily integrate and innovate.
            </Typography>
          </Box>
          <Button
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            sx={{
              borderRadius: 50,
              boxShadow: "inset 4px 4px 10px #ffffff40",
              paddingX: 4,
              paddingY: 1.5,
              backgroundColor: "primary.cyan",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#08aaae",
                boxShadow:
                  "inset 4px 4px 6.7px #ffffff40, inset -4px -4px 10px #e3e7ef1a",
              },
            }}
          >
            <Typography
              variant="body2"
              color="white"
              sx={{
                fontFamily: "'Segoe UI Bold', Helvetica",
                fontWeight: "bold",
                textTransform: "none",
              }}
            >
              Developer Experience
            </Typography>
          </Button>
          <Box sx={{ width: "100%", paddingBottom: 8, marginTop: -10 }}>
            <Image
              src={developerExperience}
              alt="developerExperience"
              style={{ objectFit: "contain", width: "100%" }}
            />
          </Box>

          <Box
            position="absolute"
            width={60}
            height={60}
            top={-30}
            bgcolor="primary.cyan"
            borderRadius={1}
            boxShadow="0px 8px 10px #00b9be66"
          >
            <IconButton
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: 60,
                height: 60,
                color: "white",
              }}
            >
              <Image src={CodeBold} alt="developerExperience" />
            </IconButton>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};
