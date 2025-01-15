import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Paper from "@mui/material/Paper";

import { FooterProps } from "~/core/interfaces/app.interface";

const Footer = ({ currentCompany }: FooterProps) => {
  const currentYear = new Date().getFullYear();

  const copyRightInfo = `© ${currentYear} All Rights Reserved`;
  return (
    <Paper
      sx={{ position: "relative", bottom: 0, left: 0, right: 0, zIndex: 100 }}
      elevation={3}
    >
      <BottomNavigation
        showLabels
        sx={{ backgroundColor: "#15416E", height: "32px" }}
      >
        <BottomNavigationAction
          label={`UAPI PORTAL (Version : ${process.env.NEXT_PUBLIC_APP_VERSION})`}
          sx={{
            "& .MuiSvgIcon-root, & .MuiBottomNavigationAction-label": {
              color: "white",
              width: 200,
            },
          }}
          disabled
        />
      </BottomNavigation>

      <BottomNavigation
        showLabels
        sx={{ backgroundColor: "#15416E", height: "9px" }}
      >
        <BottomNavigationAction
          label={currentCompany}
          sx={{
            "& .MuiSvgIcon-root, & .MuiBottomNavigationAction-label": {
              color: "white",
              fontSize: "10px",
            },
          }}
          disabled
        />
      </BottomNavigation>
      <BottomNavigation
        showLabels
        sx={{
          backgroundColor: "#15416E",
          height: "45px",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: "140px",
        }}
      >
        <BottomNavigation
          showLabels
          sx={{
            backgroundColor: "#15416E",
            height: "35px",
          }}
        >
          <BottomNavigationAction
            label="API Documentation"
            sx={{
              "& .MuiSvgIcon-root, & .MuiBottomNavigationAction-label": {
                color: "white",
                fontSize: "12px",
                whiteSpace: "nowrap",
              },
            }}
          />

          <BottomNavigationAction
            label="Developer Forum"
            sx={{
              "& .MuiSvgIcon-root, & .MuiBottomNavigationAction-label": {
                color: "white",
                whiteSpace: "nowrap",
                fontSize: "12px",
              },
            }}
          />
        </BottomNavigation>
        <BottomNavigation
          showLabels
          sx={{ backgroundColor: "#15416E", height: "35px" }}
        >
          <BottomNavigationAction
            label="Terms of Use"
            sx={{
              "& .MuiSvgIcon-root, & .MuiBottomNavigationAction-label": {
                color: "white",
                whiteSpace: "nowrap",
                fontSize: "12px",
              },
            }}
          />
          <BottomNavigationAction
            label="API Status"
            sx={{
              "& .MuiSvgIcon-root, & .MuiBottomNavigationAction-label": {
                color: "white",
                whiteSpace: "nowrap",
                fontSize: "12px",
              },
            }}
          />
          <BottomNavigationAction
            label="Support"
            sx={{
              "& .MuiSvgIcon-root, & .MuiBottomNavigationAction-label": {
                color: "white",
                whiteSpace: "nowrap",
                fontSize: "12px",
              },
            }}
          />
        </BottomNavigation>
      </BottomNavigation>
      <BottomNavigation
        showLabels
        sx={{ backgroundColor: "white", height: "18px" }}
      >
        <BottomNavigationAction
          label={copyRightInfo}
          disabled
          sx={{
            "& .MuiSvgIcon-root, & .MuiBottomNavigationAction-label": {
              color: "black",
            },
            whiteSpace: "nowrap",
          }}
        />
      </BottomNavigation>
    </Paper>
  );
};

export default Footer;
