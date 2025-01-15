/* eslint-disable react/no-array-index-key */
import { Fragment, useState } from "react";
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
import ArrowCircleRightOutlinedIcon from "@mui/icons-material/ArrowCircleRightOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import { styled, useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

import { DividerSection } from "~/modules/landingPage/components/DividerSection";

import Etimad from "~/public/assets/etimad.svg";
import LeanGroup from "~/public/assets/LeanGroup.svg";
import Masdar from "~/public/assets/masdar-seeklogo.svg";
import MinistryOfCommerce from "~/public/assets/MinistryOfCommerceGroup.svg";
import NeoTeckGroup from "~/public/assets/Neoteck.webp";
import SaudiPaymentGroup from "~/public/assets/SaudiPaymentsGroup.svg";
import SaudiPostGroup from "~/public/assets/SaudiPostGroup.svg";
import TCC from "~/public/assets/tcc_logo.svg";
import ELM from "~/public/assets/yakeen.svg";

import { useBreakpoint } from "~/core/hooks/useBreakpoints";

// Define prop types for the Line component
interface LineProps {
  direction: "horizontal" | "vertical";
}

interface LineProps {
  direction: "horizontal" | "vertical";
}

const Line = styled(Box)<LineProps>(({ direction }) => ({
  position: "absolute",
  display: "block", // "none",
  backgroundColor: "#E0E0E0",
  zIndex: -1, // "-1,"
  ...(direction === "horizontal" && {
    top: "64%",
    left: "0",
    width: "100%",
    height: "1px",
    transform: "translateY(-50%)",
  }),
  ...(direction === "vertical" && {
    top: "0",
    left: "56%",
    height: "100%",
    width: "1px",
    transform: "translateX(-50%)",
  }),
}));

export const ServiceProviders = () => {
  interface EntityCardProps {
    title: string;
    description: string;
    linkText: string;
    logoUrl: string;
    lgLines: string[];
    mdLines: string[];
    smLines: string[];
    xsLines: string[];
  }

  const entities: EntityCardProps[] = [
    {
      title: "Saudi Post | SPL",
      description:
        "Saudi Post | SPL offers a comprehensive package of postal and logistics services, playing a crucial role in the Kingdom's commercial sector.",
      linkText: "https://splonline.com.sa/ar/",
      logoUrl: SaudiPostGroup.src, // Replace with actual logo URL
      lgLines: [],
      mdLines: [],
      smLines: [],
      xsLines: [],
    },
    {
      title: "LEAN",
      description:
        "Lean simplifies the process for developers to connect to user bank accounts, making it easier to integrate financial services into applications.",
      linkText: "https://www.leantech.me/",
      logoUrl: LeanGroup.src, // Replace with actual logo URL
      lgLines: ["horizontal"],
      mdLines: ["horizontal"],
      smLines: ["horizontal"],
      xsLines: ["vertical"],
    },
    {
      title: "ELM",
      description:
        "ELM provides a wide range of ready-made and customized digital solutions across various sectors, helping businesses and individuals leverage technology.",
      linkText: "https://www.elm.sa/en/pages/default.aspx",
      logoUrl: ELM.src, // Replace with actual logo URL
      lgLines: ["horizontal"],
      mdLines: ["horizontal"],
      smLines: ["vertical"],
      xsLines: ["vertical"],
    },
    {
      title: "Ministry Of Commerce",
      description:
        "The Ministry of Commerce plays a pivotal role in the growth and sustainability of the Kingdom's commercial sector, promoting economic development and trade.",
      linkText: "https://mc.gov.sa/en/Pages/default.aspx",
      logoUrl: MinistryOfCommerce.src, // Replace with actual logo URL
      lgLines: ["vertical"],
      mdLines: ["vertical"],
      smLines: ["vertical", "horizontal"],
      xsLines: ["vertical"],
    },
    {
      title: "Saudi Payments",
      description:
        "Established by the Saudi Central Bank (SAMA), Saudi Payments connects all ATM and point-of-sale (POS) terminals, facilitating seamless transactions across the country.",
      linkText: "https://saudipedia.com/en/",
      logoUrl: SaudiPaymentGroup.src, // Replace with actual logo URL
      lgLines: ["horizontal", "vertical"],
      mdLines: ["horizontal", "vertical"],
      smLines: ["vertical"],
      xsLines: ["vertical"],
    },
    {
      title: "Neotek",
      description:
        "Neotek drives digital and financial transformation and enhancing business performance and user experience by connecting enterprises with banks easily and securely.",
      linkText: "https://www.neotek.sa/ar",
      logoUrl: NeoTeckGroup.src, // Replace with actual logo URL
      lgLines: ["horizontal", "vertical"],
      mdLines: ["horizontal", "vertical"],
      smLines: ["horizontal", "vertical"],
      xsLines: ["vertical"],
    },
    {
      title: "Masdar",
      description:
        "Masdar is committed to advancing clean-tech innovation, which is integral to the continued expansion and commercial viability of the renewables sector.",
      linkText: "https://masdar.ae/en/global-office-locations/saudi-arabia",
      logoUrl: Masdar.src, // Replace with actual logo URL
      lgLines: [],
      mdLines: [],
      smLines: [],
      xsLines: [],
    },
    {
      title: "TCC",
      description:
        "TCC provides a wide range of digital products that aims to provide our customers with the best business solutions",
      linkText: "https://www.tcc-ict.com/en",
      logoUrl: TCC.src, // Replace with actual logo URL
      lgLines: ["horizontal"],
      mdLines: ["horizontal"],
      smLines: ["horizontal"],
      xsLines: ["vertical"],
    },
    {
      title: "Yakeen",
      description:
        "Aiming to deliver innovative and high-quality technological solutions, our services span a wide range, from mobile and web applications to more complex technological projects.",
      linkText: "https://www.yaqeen.dev/en",
      logoUrl: Etimad.src, // Replace with actual logo URL
      lgLines: ["horizontal"],
      mdLines: ["horizontal"],
      smLines: ["vertical"],
      xsLines: ["vertical"],
    },
    {
      title: "Etimad",
      description:
        "The platform provides many services to various government agencies, the private sector, and individuals, which enhances the partnership between them to achieve the goals of development projects in the Kingdom. To enable the digital transformation of these services, increase transparency and efficiency, and facilitate the conduct of services",
      linkText: "https://portal.etimad.sa/en-us",
      logoUrl: Etimad.src, // Replace with actual logo URL
      lgLines: ["vertical"],
      mdLines: ["vertical"],
      smLines: ["vertical", "horizontal"],
      xsLines: ["vertical"],
    },
  ];

  const ITEMS_PER_PAGE = 6;
  const [currentPage, setCurrentPage] = useState(0);

  const theme = useTheme();
  const [breakpoint, setBreakpoint] = useState("xs"); // State to store the current breakpoint

  useBreakpoint(theme, setBreakpoint);

  const handleNext = () => {
    if ((currentPage + 1) * ITEMS_PER_PAGE < entities.length) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const paginatedEntities = entities.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      paddingTop={10}
      marginBottom={20}
      sx={{ backgroundColor: "white", position: "relative" }}
    >
      <Grid
        item
        xs={10}
        justifyContent="center"
        alignItems="center"
        position="relative"
      >
        {/* Divider */}
        <DividerSection />

        {/* Top Part */}
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
            OUR SERVICE PROVIDERS
          </Typography>
          <Typography
            sx={{
              fontFamily: "'Segoe UI Black', Helvetica",
              fontWeight: 900,
              fontSize: 36,
            }}
            align="center"
          >
            <span style={{ color: "#111b29" }}>UAPI </span>
            <span style={{ color: "#00b9be" }}>Service Providers</span>
          </Typography>
          <Typography
            sx={{
              width: "50%",
              paddingTop: 2,
              fontFamily: "'Segoe UI Regular', Helvetica",
              fontWeight: 400,
              fontSize: 16,
              marginBottom: 4,
            }}
            color="black"
            align="center"
          >
            The platform works as an intermediary that connects connectivity
            service providers (APIs) with beneficiaries of public and private
            sector entities to meet their needs
          </Typography>

          <Button
            variant="contained"
            endIcon={<ArrowForwardIcon />}
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
              View All Service Providers
            </Typography>
          </Button>
        </Box>

        {/* cards Grid */}
        <Box sx={{ flexGrow: 1, position: "relative", padding: 6 }}>
          <Grid
            item
            xs={12}
            container
            paddingTop={5}
            position="relative"
            paddingBottom={10}
          >
            {/* Arrow Buttons */}
            <Grid
              item
              display="flex"
              container
              xs={12}
              justifyContent="space-between"
              position="absolute"
              zIndex={1000}
              sx={{
                top: "49%",
                left: 0,
                right: 0,
                transform: "translateY(-75%)",
              }}
            >
              <Grid item>
                <IconButton onClick={handleBack} disabled={currentPage === 0}>
                  <ArrowCircleLeftOutlinedIcon fontSize="large" />
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton
                  onClick={handleNext}
                  disabled={
                    (currentPage + 1) * ITEMS_PER_PAGE >= entities.length
                  }
                >
                  <ArrowCircleRightOutlinedIcon fontSize="large" />
                </IconButton>
              </Grid>
            </Grid>

            {/* Main Item Grid */}
            <Grid
              item
              container
              spacing={{ xs: 8, md: 10 }}
              columns={{ xs: 2, sm: 8, md: 12 }}
              paddingX={10}
              position="relative"
              justifyContent="center"
            >
              {paginatedEntities.map((entity: EntityCardProps, index) => {
                return (
                  <Grid
                    item
                    xs={2}
                    sm={4}
                    lg={6}
                    key={index}
                    sx={{
                      position: "relative",
                      // backgroundColor: "yellow",
                      // border: "1px solid black",
                      zIndex: 1000,
                    }}
                  >
                    <Card
                      sx={{
                        height: 210,
                        borderRadius: 2,
                        boxShadow: "4px 4px 10px #0000001a",
                        backgroundColor: "#FCFDFE",
                        border: "1px solid #d3d3d3",
                      }}
                    >
                      <CardContent>
                        <CardMedia
                          component="img"
                          image={entity.logoUrl}
                          alt="Logo"
                          sx={{ width: 60, height: 60 }}
                        />
                        <Typography
                          sx={{
                            marginTop: 1,
                            fontFamily:
                              "'Segoe UI', Arial, Helvetica, sans-serif",
                            fontWeight: 600,
                            fontSize: 20,
                          }}
                          color="textPrimary"
                          align="left"
                        >
                          {entity.title}
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily:
                              "'Segoe UI', Arial, Helvetica, sans-serif",
                            fontWeight: 400,
                            fontSize: 16,
                            overflow: "hidden",
                            display: "-webkit-box", // Required for WebkitLineClamp
                            // eslint-disable-next-line @typescript-eslint/naming-convention
                            WebkitBoxOrient: "vertical", // Set box orientation to vertical
                            // eslint-disable-next-line @typescript-eslint/naming-convention
                            WebkitLineClamp: 2, // Limit to 2 lines
                          }}
                          color="textSecondary"
                          align="left"
                        >
                          {entity.description}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            marginTop: 2,
                          }}
                        >
                          <Link
                            href={entity.linkText}
                            sx={{
                              fontFamily:
                                "'Segoe UI', Arial, Helvetica, sans-serif",
                              fontWeight: 600,
                              fontSize: 16,
                              textDecoration: "none",
                              "&:hover": {
                                textDecoration: "underline",
                              },
                            }}
                            color="#00b9be"
                            align="left"
                          >
                            Learn More
                          </Link>
                          <KeyboardArrowRightIcon sx={{ color: "#00b9be" }} />
                        </Box>
                      </CardContent>
                    </Card>

                    {/* LG and XL checks */}

                    {(breakpoint === "lg" || breakpoint === "xl") && (
                      <Fragment>
                        {breakpoint === "lg" && (
                          <>
                            {entity.lgLines.includes("horizontal") && (
                              <Line direction="horizontal" />
                            )}
                            {entity.lgLines.includes("vertical") && (
                              <Line direction="vertical" />
                            )}
                          </>
                        )}

                        {breakpoint === "xl" && (
                          <>
                            {entity.lgLines.includes("horizontal") && (
                              <Line direction="horizontal" />
                            )}
                            {entity.lgLines.includes("vertical") && (
                              <Line direction="vertical" />
                            )}
                          </>
                        )}
                      </Fragment>
                    )}

                    {/* md checks */}

                    {breakpoint === "md" && (
                      <Fragment>
                        {entity.mdLines.includes("horizontal") && (
                          <Line direction="horizontal" />
                        )}
                        {entity.mdLines.includes("vertical") && (
                          <Line direction="vertical" />
                        )}
                      </Fragment>
                    )}

                    {/* sm checks */}

                    {breakpoint === "sm" && (
                      <Fragment>
                        {entity.smLines.includes("horizontal") && (
                          <Line direction="horizontal" />
                        )}
                        {entity.smLines.includes("vertical") && (
                          <Line direction="vertical" />
                        )}
                      </Fragment>
                    )}

                    {/* xs checks */}

                    {breakpoint === "xs" && (
                      <Fragment>
                        {entity.xsLines.includes("horizontal") && (
                          <Line direction="horizontal" />
                        )}
                        {entity.xsLines.includes("vertical") && (
                          <Line direction="vertical" />
                        )}
                      </Fragment>
                    )}
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
        </Box>
        {/* Divider */}
        <DividerSection />
      </Grid>
    </Grid>
  );
};
