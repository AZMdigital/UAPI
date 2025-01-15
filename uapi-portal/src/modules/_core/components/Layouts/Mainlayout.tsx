import { useEffect, useState } from "react";
import KeyboardArrowDownOutlined from "@mui/icons-material/KeyboardArrowDownOutlined";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { useRouter } from "next/router";

import { useAppSelector } from "~/state/hooks";

import Footer from "~/modules/_core/components/Footer";

import appBarULogo from "~/public/assets/header_uapi.svg";

import PopoverComponent from "~/core/components/Popover";
import SettingsComponent from "~/core/components/settings";
import { getNavbarListByRole, TABS_ARRAY } from "~/core/utils/helper";

interface MainlayoutProps {
  children: React.ReactElement;
}
export default function Mainlayout({ children }: MainlayoutProps) {
  const router = useRouter();
  const [anchorEL, setAnchorEl] = useState<any>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const user = useAppSelector((state) => state.core.userInfo);
  const [navtTabsArray, setNavTabsArray] = useState<any[]>([]);
  const userPermissions = useAppSelector(
    (state) => state.core.userRolePermissions
  );

  const handleTogglePopOver = (anchorEL: any) => {
    setAnchorEl(anchorEL);
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (userPermissions && user) {
      const tabList = getNavbarListByRole(
        TABS_ARRAY,
        userPermissions,
        user.isSuperAdmin
      );
      setNavTabsArray(tabList);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userPermissions, user]);

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "primary.background",
      }}
    >
      <AppBar sx={{ paddingX: "10px", backgroundColor: "secondary.main" }}>
        <Toolbar sx={{ height: "77px" }}>
          <Box width="40%">
            <Stack
              width="15%"
              display="flex"
              flexDirection="row"
              alignItems="center"
              paddingLeft="19px"
            >
              <Image src={appBarULogo} alt="" height={56} width={66} />
            </Stack>
          </Box>
          <Box width="60%">
            <Stack
              width="100%"
              display="flex"
              flexDirection="row"
              alignItems="center"
              justifyContent="flex-end"
            >
              <Tabs
                sx={{ color: "secondary.main", marginRight: "50px" }}
                aria-label="disabled tabs example"
              >
                {navtTabsArray.map((tab) => (
                  <Tab
                    onClick={() => tab.path && router.push(tab.path)}
                    sx={{
                      color:
                        router.pathname === tab.path
                          ? "primary.green"
                          : "primary.typoBlack",
                      textTransform: "capitalize",
                      fontSize: "16px",
                      fontWeight: 400,
                      fontFamily: "SegoeUI",
                    }}
                    label={tab.name}
                    key={tab.name}
                  />
                ))}
              </Tabs>
              <PopoverComponent
                open={isOpen}
                anchorEL={anchorEL}
                handleTogglePopOver={handleTogglePopOver}
              >
                <SettingsComponent />
              </PopoverComponent>
              <Stack
                onClick={(event) => handleTogglePopOver(event.currentTarget)}
                display="flex"
                flexDirection="row"
                alignItems="center"
              >
                <Avatar />
                <Box
                  marginLeft="10px"
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  color="primary.typoBlack"
                >
                  <Typography variant="h2" color="primary.typoBlack">
                    {`${user?.firstName} ${user?.lastName} `}
                  </Typography>
                  <KeyboardArrowDownOutlined sx={{ marginBottom: "2px" }} />
                </Box>
              </Stack>
            </Stack>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          width: "100vw",
          marginTop: "77px",
          backgroundColor: "primary.background",
        }}
      >
        {children}
      </Box>

      {user && <Footer currentCompany={user?.company.companyName} />}
    </Box>
  );
}
