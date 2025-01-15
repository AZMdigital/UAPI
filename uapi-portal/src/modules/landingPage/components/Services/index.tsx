import { Fragment } from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import ServiceGroups from "~/modules/landingPage/components/Services/components/ServiceGroups";

export const Service = () => {
  return (
    <Fragment>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        paddingTop={2}
        sx={{ backgroundColor: "white" }}
      >
        <Grid item xs={10} justifyContent="center" alignItems="center">
          {/* Top Section */}
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            width="100%"
            position="relative"
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
              OUR SERVICE
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
              <span style={{ color: "#00b9be" }}>Services</span>
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
                View All Service
              </Typography>
            </Button>
          </Box>
          {/* Services Tab Section */}
          <Box>
            <Box display="flex" justifyContent="center" gap={2} marginTop={4}>
              <ServiceGroups />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Fragment>
  );
};
