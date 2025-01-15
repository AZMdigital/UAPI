import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { SidebarListProps } from "~/modules/profile/interface/profile";
import { upcomingServicesList } from "~/modules/services/utils/helper";

const SidebarList = ({
  list,
  selectedItem,
  setSelectedItem,
}: SidebarListProps) => {
  const checkIfNotUpcomingList = (item: string) => {
    const filteredArray = upcomingServicesList.filter((service) =>
      service.includes(item)
    );
    if (filteredArray.length === 0) {
      setSelectedItem(item);
    }
  };

  return (
    <Box
      sx={{ backgroundColor: "secondary.main", overflow: "scroll" }}
      padding={1}
      borderRadius="4px"
      maxHeight="62vh"
    >
      <List
        sx={{
          backgroundColor: "transparent",
          width: 400,
          overflow: "auto",
        }}
      >
        {list.map((item: any) => (
          <>
            <ListItem
              key={item}
              disablePadding
              sx={{
                backgroundColor: selectedItem === item ? "primary.green" : "",
                borderRadius: 1.25,
                paddingY: "2.5px",
                color:
                  selectedItem === item ? "primary.typoWhite" : "primary.main",
              }}
              onClick={() => checkIfNotUpcomingList(item)}
            >
              <ListItemButton
                sx={{ width: "100%", height: 40, padding: "15px 30px" }}
              >
                <ListItemText
                  primary={
                    <Stack direction="row" display="flex" alignItems="center">
                      <Typography
                        variant="h2"
                        marginTop={0.6}
                        textTransform="capitalize"
                      >
                        {item}
                      </Typography>
                    </Stack>
                  }
                />
              </ListItemButton>
            </ListItem>

            <Divider
              sx={{
                backgroundColor: "primary.background",
                border: "none",
                height: "1px",
              }}
            />
          </>
        ))}
      </List>
    </Box>
  );
};

export default SidebarList;
