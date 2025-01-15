import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import { DashboardCardProps } from "~/modules/dashboard/interfaces/dashboard.interface";

const DashboardCard = ({ label, value }: DashboardCardProps) => {
  return (
    <Grid item sm={12} lg={4} paddingX={2}>
      <Card
        variant="outlined"
        sx={{
          borderRadius: 4,
          borderColor: "white",
          height: 180,
        }}
      >
        <CardContent
          sx={{
            "&:last-child": {
              paddingBottom: 2,
            },
          }}
        >
          <Typography
            color="primary.blackishGray"
            sx={{
              paddingLeft: 1,
              fontSize: "1.1rem",
            }}
          >
            {label}
          </Typography>

          <Typography
            color="primary.cyan"
            fontStyle="bold"
            textAlign="center"
            sx={{
              fontSize: "4.5rem",
              fontWeight: 700,
            }}
          >
            {value}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default DashboardCard;
