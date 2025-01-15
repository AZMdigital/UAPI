/* eslint-disable @typescript-eslint/naming-convention */
import { useState } from "react";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
import ArrowCircleRightOutlinedIcon from "@mui/icons-material/ArrowCircleRightOutlined";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import MailIcon from "@mui/icons-material/Mail";
import SecurityIcon from "@mui/icons-material/Security";
import StorageIcon from "@mui/icons-material/Storage";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import { styled } from "@mui/material/styles";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";

import { tabStyle } from "~/modules/landingPage/components/Services/components/utils/helper";

const CustomTabs = styled(Tabs)(() => ({
  "& .MuiTabs-indicator": {
    height: "1px",
    backgroundColor: "#00c6b7",
    borderRadius: "4px",
  },
}));

const CustomTab = styled(Tab)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: theme.spacing(1),
  typography: "inherit",
}));

const IconWrapper = styled("div", {
  shouldForwardProp: (prop) => prop !== "isSelected",
})<{ isSelected: boolean }>(({ isSelected }) => ({
  width: 40,
  height: 40,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: isSelected ? "#e6f7f9" : "#F8F9FC",
  color: isSelected ? "white" : "inherit", // Optional for better contrast
}));

// Dynamic data for tabs and cards
const tabsData = [
  {
    label: "Retrieve Data Services",
    icon: (isSelected: boolean) => (
      <StorageIcon
        fontSize="small"
        sx={{ color: isSelected ? "#00c6b7" : "#97A3B7" }}
      />
    ),
  },
  {
    label: "Financial Service",
    icon: (isSelected: boolean) => (
      <AccountBalanceIcon
        fontSize="small"
        sx={{ color: isSelected ? "#00c6b7" : "#97A3B7" }}
      />
    ),
  },
  {
    label: "Authentication Service",
    icon: (isSelected: boolean) => (
      <SecurityIcon
        fontSize="small"
        sx={{ color: isSelected ? "#00c6b7" : "#97A3B7" }}
      />
    ),
  },
  {
    label: "Messages Services",
    icon: (isSelected: boolean) => (
      <MailIcon
        fontSize="small"
        sx={{ color: isSelected ? "#00c6b7" : "#97A3B7" }}
      />
    ),
  },
];

const cardsData: { [key: number]: { title: string; description: string }[] } = {
  0: [
    {
      title: "Saudi Post | SPL",
      description:
        "UAPI connects users to Saudi Post’s postal and logistics services, providing seamless access to address verification and delivery management to enhance operational workflows.",
    },
    {
      title: "Masdar",
      description:
        "Through UAPI, users can access Masdar’s for clean-tech data, empowering organizations to align with sustainability goals and track innovative projects.",
    },
    {
      title: "Elm",
      description:
        "UAPI simplifies access to Elm’s data solutions, including vehicle history checks and employee verification, helping businesses make data-driven decisions effortlessly.",
    },
  ],
  1: [
    {
      title: "TCC",
      description:
        "UAPI integrates TCC to provide secure and reliable authentication, ensuring smooth user verification and protecting sensitive business systems.",
    },
    {
      title: "Yakeen",
      description:
        "Organizations use UAPI to access Yakeen’s robust identity verification services, enabling quick and secure validation processes to reduce fraud risks.",
    },
    {
      title: "Etimad",
      description:
        "UAPI facilitates seamless integration with Etimad, enabling automated authentication and approvals, reducing manual overhead for businesses and governments.",
    },
  ],
  2: [
    {
      title: "Edaat",
      description:
        "UAPI grants access to Edaat’s financial analytics and real-time insights, helping businesses enhance decision-making and operational efficiency.",
    },
    {
      title: "Simah",
      description:
        "Through UAPI, users can connect to Simah’s credit reporting services, obtaining essential financial data for risk assessment and informed decisions.",
    },
  ],
  3: [
    {
      title: "Deewan",
      description:
        "UAPI provides access to Deewan’s high-volume messaging services, enabling businesses to send timely and reliable communications at scale.",
    },
    {
      title: "Unifonic",
      description:
        "With UAPI, businesses can utilize Unifonic’s scalable communication solutions to stay connected with customers across multiple channels effectively.",
    },
    {
      title: "Massegat",
      description:
        "UAPI integrates Massegat’s messaging platform, offering flexible and efficient communication options for personalized notifications and updates.",
    },
  ],
};

const ServiceGroups = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const cardsPerPage = 4;
  const classes = tabStyle();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
    setCurrentPage(0); // Reset to the first page when switching tabs
  };

  const handleNextPage = () => {
    const totalCards = cardsData[selectedTab]?.length || 0;
    if ((currentPage + 1) * cardsPerPage < totalCards) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const displayedCards =
    cardsData[selectedTab]?.slice(
      currentPage * cardsPerPage,
      (currentPage + 1) * cardsPerPage
    ) || [];

  return (
    <Box sx={{ width: "100%", padding: "16px" }}>
      {/* Tabs Section */}
      <Box
        sx={{
          width: "100%",
          borderBottom: "1px solid #e0e0e0",
          justifyContent: "center",
        }}
      >
        <CustomTabs
          value={selectedTab}
          onChange={handleChange}
          scrollButtons="auto"
          centered
        >
          {tabsData.map((tab, index) => (
            <CustomTab
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              icon={
                <IconWrapper isSelected={selectedTab === index}>
                  {tab.icon(selectedTab === index)}
                </IconWrapper>
              }
              className={classes.customStyleOnTab}
              //  label={tab.label}
              label={
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: selectedTab === index ? "bold" : "normal",
                  }}
                >
                  {tab.label}
                </Typography>
              }
            />
          ))}
        </CustomTabs>
      </Box>

      {/* Cards Section */}
      <Grid container spacing={6} justifyContent="center" sx={{ marginTop: 1 }}>
        {displayedCards.map((card: any, index: number) => (
          // eslint-disable-next-line react/no-array-index-key
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                height: 190,
                borderRadius: 2,
                border: "1px solid #d3d3d3",
                backgroundColor: "#f8f9fc66",
                boxShadow: "4px 4px 10px #0000001a",
                minheight: 200,
                overflow: "auto",
              }}
            >
              <CardContent>
                <Typography
                  sx={{
                    marginTop: 1,
                    fontFamily: "'Segoe UI', Arial, Helvetica, sans-serif",
                    fontWeight: 600,
                    fontSize: 20,
                  }}
                  color="textPrimary"
                  align="left"
                >
                  {card.title}
                </Typography>
                <Typography
                  color="textSecondary"
                  align="left"
                  sx={{
                    margin: "8px 0",
                    fontFamily: "'Segoe UI', Arial, Helvetica, sans-serif",
                    fontWeight: 400,
                    fontSize: 16,
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 2,
                  }}
                >
                  {card.description}
                </Typography>
                <Box
                  sx={{ display: "flex", alignItems: "center", marginTop: 2 }}
                >
                  <Link
                    sx={{
                      fontFamily: "'Segoe UI', Arial, Helvetica, sans-serif",
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
          </Grid>
        ))}
      </Grid>

      {/* Bottom Button Section */}
      <Box display="flex" justifyContent="right" gap={2} marginTop={4}>
        <IconButton onClick={handlePreviousPage} disabled={currentPage === 0}>
          <ArrowCircleLeftOutlinedIcon fontSize="large" />
        </IconButton>
        <IconButton
          onClick={handleNextPage}
          disabled={
            (currentPage + 1) * cardsPerPage >=
            (cardsData[selectedTab]?.length || 0)
          }
        >
          <ArrowCircleRightOutlinedIcon fontSize="large" />
        </IconButton>
      </Box>
    </Box>
  );
};

// export default ServiceGroups;

export default ServiceGroups;
