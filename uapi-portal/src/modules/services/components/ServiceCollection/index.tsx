// import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

// import Typography from "@mui/material/Typography";
import { ServiceType } from "~/rest/models/service";

import ServiceCard from "~/modules/services/components/ServiceCard";
import { ServiceCollectionProps } from "~/modules/services/utils/helper";
import { labels } from "~/modules/services/utils/labels";

export default function ServiceCollection({
  serviceCollection,
}: ServiceCollectionProps) {
  return (
    <Grid item xs={12} width="100%" paddingBottom={4}>
      {/* <Box width="100%" display="flex" justifyContent="center">
        <Typography
          gutterBottom
          variant="h3"
          component="div"
          fontWeight={700}
          fontSize={30}
          marginTop={3}
          fontFamily="Din Alternate"
        >
          {serviceCollection.name}
        </Typography>
      </Box> */}

      <Grid
        item
        container
        display="flex"
        justifyContent="center"
        paddingTop={3}
        paddingX={20}
        columnGap={3}
        rowGap={3}
      >
        {serviceCollection.collection.map((service: ServiceType) => (
          <ServiceCard
            key={service.id}
            heading={service.name}
            description={service.description}
            buttonText={labels.cardBtnText}
            variant="contained"
            serviceGroup={service.serviceProvider.name}
            footerText={service.description}
            path={service.swaggerPath}
            serviceOperations={service.services}
          />
        ))}
      </Grid>
    </Grid>
  );
}
