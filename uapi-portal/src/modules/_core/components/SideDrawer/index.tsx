import { Fragment, useEffect, useState } from "react";
import { ArrowForwardIos } from "@mui/icons-material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { CSSObject, styled, Theme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";

import { useAppDispatch, useAppSelector } from "~/state/hooks";

import { setChildItem, setParentItem } from "~/core/state/coreSlice";
import {
  getSideMenuOptionByRole,
  MenuConfig,
  NavMenuItem,
} from "~/core/utils/helper";
import { labels } from "~/core/utils/labels";

const drawerWidth = 370;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  marginTop: "70px",
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  marginTop: "70px",
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  zIndex: 99,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const SideDrawer = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);

  const dispatch = useAppDispatch();
  const parentItem = useAppSelector((state) => state.core.parentItem);
  const childItem = useAppSelector((state) => state.core.childItem);
  const user = useAppSelector((state) => state.core.userInfo);
  const userPermissions = useAppSelector(
    (state) => state.core.userRolePermissions
  );
  const [navItems, setNavItems] = useState<NavMenuItem[]>();
  useEffect(() => {
    if (userPermissions && user) {
      const { navItems } = new MenuConfig();
      if (childItem && childItem === parentItem) {
        setOpenItems([childItem]);
      } else if (!(childItem === parentItem && childItem)) {
        setOpenItems([""]);
      }
      setNavItems(
        getSideMenuOptionByRole(
          navItems,
          userPermissions,
          user.isSuperAdmin,
          user.company.accountType,
          user.company.useMainAccountBundles
        )
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.pathname]);

  const getIconColorForMenuOpen = () => {
    if (isOpen) {
      return "white";
    } else {
      return "black";
    }
  };

  const [openItems, setOpenItems] = useState<Array<string>>([]);

  const toggleSubMenu = (itemId: string) => {
    setOpenItems((prevOpenItems) => {
      if (prevOpenItems.includes(itemId)) {
        return prevOpenItems.filter((id) => id !== itemId);
      } else {
        return [...prevOpenItems, itemId];
      }
    });
  };

  const navigateToPage = (route: string) => {
    if (route !== "-") {
      router.push(route);
    }
  };

  return (
    <Box display="flex">
      <Drawer
        variant="permanent"
        open={isOpen}
        sx={{
          "& .MuiDrawer-paper": {
            position: "relative",
            marginTop: 0,
          },
        }}
      >
        <DrawerHeader sx={{ display: "flex", justifyContent: "flex-start" }}>
          <ListItem disablePadding sx={{ display: "block" }}>
            <ListItemButton
              onClick={() => setIsOpen(!isOpen)}
              sx={{
                height: 20,
                justifyContent: isOpen ? "initial" : "center",
                marginTop: 3,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  marginX: isOpen ? 1 : "auto",
                  justifyContent: "center",
                }}
              >
                {!isOpen ? <ChevronRightIcon /> : <ChevronLeftIcon />}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="h2" color="primary.black">
                    {labels.hideMenu}
                  </Typography>
                }
                sx={{
                  opacity: isOpen ? 1 : 0,
                }}
              />
            </ListItemButton>
          </ListItem>
        </DrawerHeader>
        <Divider />
        <List>
          {navItems?.map((item) => (
            <Fragment key={item.id}>
              <ListItem sx={{ paddingRight: 5, paddingLeft: 2 }}>
                <ListItemButton
                  onClick={() => {
                    if (item.children) {
                      toggleSubMenu(item.id);
                      dispatch(setParentItem(item.id));
                    } else {
                      dispatch(setParentItem(item.id));
                      navigateToPage(item.page);
                    }
                  }}
                  id={item.title}
                  sx={{
                    height: 46,
                    borderRadius: 2,
                    justifyContent: "center",
                    backgroundColor:
                      router.pathname.includes(item.page) &&
                      isOpen &&
                      !item.children
                        ? "primary.cyan"
                        : "white",
                    "&:hover": {
                      backgroundColor:
                        router.pathname.includes(item.page) &&
                        isOpen &&
                        !item.children
                          ? "primary.cyan"
                          : "white",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      marginLeft: 0,
                      marginRight: isOpen ? 1 : "auto",
                      marginY: 2,
                      color:
                        router.pathname.includes(item.page) && !item.children
                          ? getIconColorForMenuOpen()
                          : "black",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={<Typography variant="h2">{item.title}</Typography>}
                    sx={{
                      paddingTop: 0,
                      opacity: isOpen ? 1 : 0,
                      color:
                        router.pathname.includes(item.page) && !item.children
                          ? "white"
                          : "primary.black",
                      fontSize: 16,
                      fontWeight: 400,
                    }}
                  />
                </ListItemButton>
              </ListItem>
              <List>
                {openItems.includes(item.id) &&
                  item.children?.map((subItem: any) => (
                    <ListItem key={subItem.id}>
                      <ListItemButton
                        onClick={() => {
                          dispatch(setChildItem(item.id));
                          navigateToPage(subItem.page);
                        }}
                        id={subItem.title}
                        sx={{
                          height: 46,
                          borderRadius: 2,
                          justifyContent: "center",
                          backgroundColor:
                            router.pathname.includes(subItem.page) && isOpen
                              ? "primary.cyan"
                              : "white",
                          "&:hover": {
                            backgroundColor:
                              router.pathname.includes(subItem.page) && isOpen
                                ? "primary.cyan"
                                : "white",
                          },
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            marginLeft: 2,
                            marginRight: isOpen ? 1 : "auto",
                            marginY: 2,
                            marginX: 1,
                            color: router.pathname.includes(subItem.page)
                              ? getIconColorForMenuOpen()
                              : "black",
                          }}
                        >
                          <ArrowForwardIos
                            style={{
                              fontSize: "1rem",
                            }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography
                              style={{
                                fontSize: "1rem",
                              }}
                            >
                              {subItem.title}
                            </Typography>
                          }
                          sx={{
                            paddingTop: 0.5,
                            opacity: isOpen ? 1 : 0,
                            color: router.pathname.includes(subItem.page)
                              ? "white"
                              : "primary.black",
                            fontSize: 16,
                            fontWeight: 400,
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
              </List>

              {item.showBottomDivider && <Divider />}
            </Fragment>
          ))}
        </List>
      </Drawer>
    </Box>
  );
};

export default SideDrawer;
