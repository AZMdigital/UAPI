/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/naming-convention */
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Image from "next/image";

import baladyLogo from "~/public/assets/baladyLogo.svg";
import ejarLogo from "~/public/assets/ejarLogo.svg";
import ibtar from "~/public/assets/ibtar.svg";
import leeanLogo from "~/public/assets/leeanLogo.svg";
import muqeem from "~/public/assets/muqeem.svg";
import nafathsLogo from "~/public/assets/nafathsLogo.svg";
import taqatLogo from "~/public/assets/taqatLogo.svg";

const logos = [
  { src: baladyLogo, alt: "Balady logo" },
  { src: taqatLogo, alt: "Taqat logo" },
  { src: leeanLogo, alt: "Leean logo" },
  { src: nafathsLogo, alt: "Nafaths logo" },
  { src: ejarLogo, alt: "Ejar logo" },
  { src: muqeem, alt: "Muqeem logo" },
  { src: ibtar, alt: "Ibtar logo" },
  { src: baladyLogo, alt: "Balady logo" },
  { src: taqatLogo, alt: "Taqat logo" },
  { src: leeanLogo, alt: "Leean logo" },
  { src: nafathsLogo, alt: "Nafaths logo" },
  { src: ejarLogo, alt: "Ejar logo" },
  { src: muqeem, alt: "Muqeem logo" },
  { src: ibtar, alt: "Ibtar logo" },
];

const AnimatedLogos = styled(Box)({
  display: "flex",
  paddingX: 20,
  height: "100px",
  whiteSpace: "nowrap",
  animation: "moveLeft 50s linear infinite",
  width: "max-content", // Automatically adjusts to the content width
  "@keyframes moveLeft": {
    "0%": {
      transform: "translateX(0)",
    },
    "25%": {
      transform: "translateX(-25%)",
    },
    "50%": {
      transform: "translateX(-50%)",
    },
    "100%": {
      transform: "translateX(-100%)",
    },
  },
});

const SocialProof = () => {
  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{ backgroundColor: "white", paddingTop: 4 }}
    >
      <Grid item xs={8} justifyContent="center" sx={{ overflow: "hidden" }}>
        <Typography
          sx={{
            color: "gray",
            textAlign: "center",
            fontWeight: 600,
            fontSize: 14,
            marginTop: "3rem",
            marginBottom: "1rem",
          }}
        >
          TRUSTED BY
        </Typography>
        <AnimatedLogos>
          {/* Repeat logos to ensure seamless scroll */}
          {logos.concat(logos).map((logo, index) => (
            <Box
              key={index}
              sx={{
                marginRight: "4rem",
                boxSizing: "border-box",
                display: "inline-block",
              }}
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                style={{
                  height: "50px",
                  width: "80px",
                  objectFit: "contain",
                }}
              />
            </Box>
          ))}
          {logos.concat(logos).map((logo, index) => (
            <Box
              key={index}
              sx={{
                marginRight: "4rem",
                boxSizing: "border-box",
                display: "inline-block",
              }}
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                style={{
                  height: "50px",
                  width: "80px",
                  objectFit: "contain",
                }}
              />
            </Box>
          ))}
        </AnimatedLogos>
      </Grid>
    </Grid>
  );
};

export default SocialProof;
