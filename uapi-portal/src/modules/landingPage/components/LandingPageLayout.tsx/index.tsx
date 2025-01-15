import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

// import Footer from "~/modules/landingPage/components/Footer";
import Header from "~/modules/landingPage/components/Header";

interface LandingPageLayoutProps {
  children: React.ReactElement;
}
export default function LandingPageLayout({
  children,
}: LandingPageLayoutProps) {
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#112539",
      }}
    >
      <Header />
      <Grid container marginTop="77px" spacing={2}>
        {children}
      </Grid>
      {/* <Footer /> */}
    </Box>
  );
}
