import { Fragment, useState } from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMore from "@mui/icons-material/ExpandMore";
import KeyIcon from "@mui/icons-material/Key";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { ServiceProviderItemProps } from "~/modules/profile/interface/profile";

const ServiceProviders = ({
  serviceProvider,
  selectedItem,
  setSelectedItem,
}: ServiceProviderItemProps) => {
  const [shouldOpenList, setOpen] = useState(false);

  const toggleExpension = () => {
    setOpen((shouldOpenList) => !shouldOpenList);
  };

  return (
    <Fragment>
      <ListItem
        disablePadding
        disableGutters
        sx={{
          backgroundColor:
            selectedItem.title === serviceProvider.title
              ? "primary.green"
              : "primary.greyBackground",
          borderRadius: 1.25,
          paddingY: "2.5px",
          color:
            selectedItem.title === serviceProvider.title
              ? "primary.typoWhite"
              : "secondary.textGray",
        }}
      >
        <IconButton onClick={toggleExpension} disableRipple>
          {shouldOpenList ? <ChevronRightIcon /> : <ExpandMore />}
        </IconButton>
        <ListItemButton
          sx={{ width: "100%", height: 40 }}
          disableGutters
          onClick={() => setSelectedItem(serviceProvider)}
        >
          <ListItemText
            sx={{ flex: "initial" }}
            primary={
              <Typography variant="h1" textTransform="capitalize">
                {serviceProvider.title}
              </Typography>
            }
          />
          {serviceProvider.showIcon && (
            <Icon sx={{ marginTop: 0.5, marginLeft: 2 }}>
              <KeyIcon />
            </Icon>
          )}
        </ListItemButton>
      </ListItem>

      <Divider
        sx={{
          backgroundColor: "primary.background",
          border: "none",
          height: "1px",
        }}
      />

      <Collapse in={shouldOpenList} timeout="auto" unmountOnExit>
        <List>
          {serviceProvider.children?.map((subItem: any) => (
            <ListItem
              key={subItem.id}
              disablePadding
              sx={{
                backgroundColor:
                  selectedItem.title === subItem.title ? "primary.green" : "",
                borderRadius: 1.25,
                paddingY: "2.5px",
                color:
                  selectedItem.title === subItem.title
                    ? "primary.typoWhite"
                    : "primary.main",
              }}
              onClick={() => setSelectedItem(subItem)}
            >
              <ListItemButton
                sx={{ width: "100%", height: 40, padding: "15px 30px" }}
              >
                <ListItemText
                  sx={{
                    minWidth: 0,
                    marginLeft: 1.5,
                    flex: "initial",
                  }}
                  primary={
                    <Stack direction="row" display="flex" alignItems="center">
                      <Typography
                        variant="h2"
                        marginTop={0.6}
                        textTransform="capitalize"
                      >
                        {subItem.title}
                      </Typography>
                    </Stack>
                  }
                />
                {subItem.showIcon && (
                  <Icon sx={{ marginTop: 0.5, marginLeft: 2 }}>
                    <KeyIcon />
                  </Icon>
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Collapse>
    </Fragment>
  );
};

export default ServiceProviders;
