import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Box, Button, Stack, Typography } from "@mui/material";
import Image from "next/image";

import heroSection from "~/public/assets/heroSection.svg";

export const HeroSection = () => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "700px",
        backgroundColor: "#112539",
        position: "relative",
      }}
    >
      <Image
        src={heroSection}
        alt="Hero Section"
        fill
        style={{ objectFit: "cover" }}
      />
      <Box
        sx={{
          width: "100%",
          height: "600px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            position: "absolute",
            top: 100,
          }}
        >
          <Typography
            sx={{
              fontFamily: "'Segoe UI Black', Helvetica",
              fontWeight: 900,
              fontSize: 50,
              textAlign: "center",
              color: "transparent",
              backgroundClip: "text",
              backgroundColor: "white",
            }}
          >
            UAPI Where Integration Meets{" "}
            <span style={{ color: "#00b9be" }}>Innovation</span>
          </Typography>
          <Typography
            sx={{
              fontFamily: "'Segoe UI Regular', Helvetica",
              color: "transparent",
              backgroundClip: "text",
              fontSize: 14,
              textAlign: "center",
              backgroundColor: "white",
            }}
          >
            Providing Connectivity Services For APIs To Improve The Quality And
            Efficiency
          </Typography>

          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              paddingTop: 1,
              gap: 2,
            }}
          >
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#00b9be",
                borderRadius: "50px",
                boxShadow: "inset 4px 4px 10px #ffffff40",
                paddingX: 4,
                paddingY: 1.5,
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
                Book A Demo
              </Typography>
            </Button>
            <Stack direction="row" spacing={1}>
              <Typography
                variant="body1"
                sx={{
                  fontFamily: "'Segoe UI Bold', Helvetica",
                  fontWeight: "600",
                  color: "white",
                  fontSize: 14,
                  top: 0,
                  left: 0,
                }}
              >
                Read Our Docs
              </Typography>
              <KeyboardArrowRightIcon
                sx={{
                  top: 0,
                  color: "white",
                }}
              />
            </Stack>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default HeroSection;
