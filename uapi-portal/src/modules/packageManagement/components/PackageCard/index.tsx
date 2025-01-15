import CheckCircleOutlineTwoToneIcon from "@mui/icons-material/CheckCircleOutlineTwoTone";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { PackageCardProps } from "~/modules/packageManagement/interfaces/packages.interface";
import {
  annualPackage,
  getFormattedStatus,
  serviceBundelPackage,
} from "~/modules/packageManagement/utils/helper";

import {
  convertToTitleCase,
  getMomentFormattedDate,
} from "~/core/utils/helper";

export default function PackageCard({
  selectedPackage,
  handleSelection,
  packageData,
  packageDescriptionList,
  otherData,
}: PackageCardProps) {
  const getSelectionColor = () => {
    if (otherData) {
      if (otherData.id === selectedPackage?.id) {
        return "primary.cyan";
      } else {
        return "";
      }
    } else {
      if (packageData.id === selectedPackage?.id) {
        return "primary.cyan";
      } else {
        return "";
      }
    }
  };

  const handleDataSelection = () => {
    if (otherData) {
      handleSelection(otherData);
    } else {
      handleSelection(packageData);
    }
  };

  return (
    <Card
      variant="outlined"
      sx={{
        display: "inline-table",
        width: 281,
        maxWidth: 281,
        borderRadius: "4px",
        borderColor: getSelectionColor(),
      }}
      onClick={() => handleDataSelection()}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          paddingBottom: 3,
        }}
      >
        {packageData.packageType === annualPackage && (
          <Typography
            variant="h1"
            textAlign="center"
            sx={{ color: "primary.cyan" }}
          >
            {packageData.name}
          </Typography>
        )}

        <Typography marginTop={2} variant="h1" textAlign="center">
          {`${packageData.pricePerPeriod} SAR`}
        </Typography>

        {packageData.packageType === serviceBundelPackage && (
          <Divider sx={{ marginTop: 2 }} />
        )}

        {packageData.packageType === annualPackage && (
          <Typography
            variant="h6"
            marginTop={0.5}
            textAlign="center"
            sx={{ color: "grey" }}
          >
            {`billed ${convertToTitleCase(packageData.packagePeriod)}`}
          </Typography>
        )}

        <List sx={{ width: "100%", marginTop: 2 }}>
          {packageDescriptionList.map((value) => (
            <ListItem key={value} disableGutters alignItems="flex-start">
              <ListItemIcon sx={{ minWidth: 35 }}>
                <CheckCircleOutlineTwoToneIcon sx={{ color: "green" }} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="h5" component="div" paddingTop={0.5}>
                    {value}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>

        {otherData && (
          <Stack direction="column">
            <Typography
              variant="h5"
              marginTop={0.5}
              textAlign="center"
              sx={{ color: "grey" }}
            >
              {`Activation Date:  ${getMomentFormattedDate(
                otherData.activationDate
              )}`}
            </Typography>

            <Typography variant="h5" textAlign="center" sx={{ color: "grey" }}>
              {`Status :  ${convertToTitleCase(
                getFormattedStatus(otherData.packageStatus)
              )}`}
            </Typography>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
