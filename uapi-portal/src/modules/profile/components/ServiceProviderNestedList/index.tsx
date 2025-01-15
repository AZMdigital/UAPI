import Box from "@mui/material/Box";
import List from "@mui/material/List";

import ServiceProviders from "~/modules/profile/components/ServiceProviderNestedList/ServiceProviders";
import { ServiceProviderNestedListProps } from "~/modules/profile/interface/profile";

const ServiceProviderNestedList = ({
  ServiceProviderGroupList,
  selectedItem,
  setSelectedItem,
}: ServiceProviderNestedListProps) => {
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
        }}
      >
        {ServiceProviderGroupList?.map((item) => (
          <ServiceProviders
            key={item.id}
            serviceProvider={item}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
          />
        ))}
      </List>
    </Box>
  );
};
export default ServiceProviderNestedList;
