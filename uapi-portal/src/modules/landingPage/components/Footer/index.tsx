/* eslint-disable react/no-unescaped-entities */
import { Fragment } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Image from "next/image";

import appBarULogo from "~/public/assets/header_uapi.svg";

const Footer = () => {
  const FooterBottom = styled(Box)(() => ({
    width: "100%",
    height: "77px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  }));

  return (
    <Fragment>
      <Grid container justifyContent="center" alignItems="center" paddingY={10}>
        <Grid item xs={10} justifyContent="center" alignItems="center">
          <Grid item>
            <Divider sx={{ marginBottom: 5 }} />
          </Grid>
          <Grid
            display="flex"
            container
            xs={12}
            direction="row"
            justifyContent="space-between"
          >
            <Grid item xs={7}>
              <Box>
                <Image src={appBarULogo} alt="" height={150} width={102.74} />
                <Typography
                  sx={{
                    width: "296px",
                    fontFamily: "'Segoe UI Regular', Helvetica",
                    fontWeight: 400,
                    fontSize: 14,
                    color: "primary.textDarkGrey",
                  }}
                  color="textSecondary"
                  paddingY={3}
                >
                  UAPI is more than a product. It's a vision for a seamlessly
                  integrated digital future, tailored to unique needs and
                  aspirations of the region.
                </Typography>
              </Box>

              <Button
                variant="contained"
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
                  Get Started
                </Typography>
              </Button>
            </Grid>

            <Grid item xs={5} container>
              <Grid item xs={4}>
                <Typography
                  fontFamily="'Segoe UI Bold', Helvetica"
                  color="black"
                  fontWeight="bold"
                  sx={{ paddingBottom: 1 }}
                >
                  Services Providers
                </Typography>
                <List>
                  {[
                    "Ministry of justice",
                    "Ministry of commerce",
                    "SDAIA",
                    "ELM",
                    "NCGR",
                    "GOSI",
                    "Digital Signature",
                    "Lean",
                    "SPL",
                    "CST",
                    "Saudi Payment",
                    "Compliance",
                  ].map((item) => (
                    <ListItem key={item} disableGutters sx={{ paddingTop: 0 }}>
                      <Typography
                        sx={{
                          fontFamily: "'Segoe UI Regular', Helvetica",
                          fontWeight: 400,
                          fontSize: 14,
                          color: "primary.textDarkGrey",
                        }}
                        color="textSecondary"
                      >
                        {item}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              </Grid>

              <Grid item xs={4}>
                <Typography
                  fontFamily="'Segoe UI Bold', Helvetica"
                  color="black"
                  fontWeight="bold"
                  sx={{ paddingBottom: 1 }}
                >
                  Developers
                </Typography>
                <List>
                  {[
                    "Documentation",
                    "API Reference",
                    "Change log",
                    "For Developers",
                  ].map((item) => (
                    <ListItem key={item} disableGutters sx={{ paddingTop: 0 }}>
                      <Typography
                        sx={{
                          fontFamily: "'Segoe UI Regular', Helvetica",
                          fontWeight: 400,
                          fontSize: 14,
                          color: "primary.textDarkGrey",
                        }}
                        color="textSecondary"
                      >
                        {item}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              </Grid>

              <Grid item xs={4}>
                <Typography
                  fontFamily="'Segoe UI Bold', Helvetica"
                  color="black"
                  fontWeight="600"
                  sx={{ paddingBottom: 1 }}
                >
                  About UAPI
                </Typography>
                <List>
                  {["Pricing", "Contact us", "About us"].map((item) => (
                    <ListItem key={item} disableGutters sx={{ paddingTop: 0 }}>
                      <Typography
                        sx={{
                          fontFamily: "'Segoe UI Regular', Helvetica",
                          fontWeight: 400,
                          fontSize: 14,
                          color: "primary.textDarkGrey",
                        }}
                        color="textSecondary"
                      >
                        {item}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{ backgroundColor: "#112539" }}
      >
        <Grid item xs={10}>
          <FooterBottom>
            <Typography
              sx={{
                fontFamily: "'Segoe UI Regular', Helvetica",
                fontWeight: 400,
                fontSize: 14,
              }}
              color="common.white"
            >
              Copyright © 2024 Unified Application Programming Interface. All
              rights reserved
            </Typography>
            <Box display="flex" gap={6}>
              {["Support", "Privacy Policy", "Security"].map((item) => (
                <Link
                  key={item}
                  href="#"
                  underline="hover"
                  color="common.white"
                  sx={{
                    fontFamily: "'Segoe UI Regular', Helvetica",
                    fontWeight: 400,
                    fontSize: 14,
                  }}
                >
                  {item}
                </Link>
              ))}
            </Box>
          </FooterBottom>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default Footer;
