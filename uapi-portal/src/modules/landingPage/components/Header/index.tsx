import { useEffect, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LanguageIcon from "@mui/icons-material/Language";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";

import coloredLogo from "~/public/assets/coloredLogo.svg";
import whiteLogo from "~/public/assets/whiteLogo.svg";

import { paths } from "~/core/utils/helper";

export const Header = () => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState("#112539"); // Initial background color
  const [textColor, setTextColor] = useState("#FFFFFF"); // Initial background color
  const [isDarkMode, setDarkMode] = useState(true);

  const handleMenuClick = () => {
    //  setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const handleScroll = () => {
      // Change color based on scroll position
      if (window.scrollY > 100) {
        // Change 100 to the scroll height you prefer
        setBackgroundColor("#FFFFFF"); // New color when scrolled
        setTextColor("#000000");
        setDarkMode(false);
      } else {
        setBackgroundColor("#112539"); // Original color
        setTextColor("#FFFFFF");
        setDarkMode(true);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup the event listener on unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navigateToLogin = () => {
    router.push(paths.loginPage);
  };

  return (
    <AppBar
      position="fixed"
      style={{ backgroundColor }}
      sx={{ padding: "8px 110px", boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.3)" }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Image
          src={isDarkMode ? whiteLogo : coloredLogo}
          alt="Logo h"
          width={98}
          height={48}
        />

        <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, color: textColor }}
            >
              Our Partners
            </Typography>
            <IconButton
              size="small"
              sx={{ color: textColor, marginTop: 0.5 }}
              onClick={handleMenuClick}
            >
              <ExpandMoreIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleMenuClose}>Option 1</MenuItem>
              <MenuItem onClick={handleMenuClose}>Option 2</MenuItem>
            </Menu>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, color: textColor }}
            >
              Services
            </Typography>
            <IconButton
              size="small"
              sx={{ color: textColor, marginTop: 0.5 }}
              onClick={handleMenuClick}
            >
              <ExpandMoreIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleMenuClose}>Option 1</MenuItem>
              <MenuItem onClick={handleMenuClose}>Option 2</MenuItem>
            </Menu>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, color: textColor }}
            >
              Developers
            </Typography>
            <IconButton
              size="small"
              sx={{ color: textColor, marginTop: 0.5 }}
              onClick={handleMenuClick}
            >
              <ExpandMoreIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleMenuClose}>Option 1</MenuItem>
              <MenuItem onClick={handleMenuClose}>Option 2</MenuItem>
            </Menu>
          </Box>

          <Typography
            variant="body2"
            sx={{ fontWeight: 600, color: textColor }}
          >
            Pricing
          </Typography>

          <Typography
            variant="body2"
            sx={{ fontWeight: 600, color: textColor }}
          >
            About UAPI
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 3,
              paddingLeft: 8,
            }}
          >
            <IconButton sx={{ color: textColor }}>
              <LanguageIcon />
            </IconButton>
            <Button
              variant="text"
              sx={{
                fontWeight: 700,
                color: textColor,
                textTransform: "none",
              }}
              onClick={navigateToLogin}
            >
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, color: textColor }}
              >
                Login
              </Typography>
            </Button>
          </Box>
        </Box>

        {/* <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <IconButton sx={{ color: textColor }}>
            <LanguageIcon />
          </IconButton>
          <Typography
            variant="body2"
            sx={{ fontWeight: 700, color: textColor }}
          >
            Login
          </Typography>
          <Button
            variant="outlined"
            sx={{
              color: textColor,
              borderColor: textColor,
            }}
          >
            Create Account
          </Button>
        </Box> */}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
