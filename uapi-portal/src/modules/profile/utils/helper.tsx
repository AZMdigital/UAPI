import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { GridColDef } from "@mui/x-data-grid";

import { Status } from "~/config/appConfig";

import Callbacks from "~/modules/profile/components/Callbacks";
import Configuration from "~/modules/profile/components/Configuration";
import Connectivity from "~/modules/profile/components/Connectivity";
import CustomHeaders from "~/modules/profile/components/CustomHeaders";
import GenerateToken from "~/modules/profile/components/GenToken";
import UserProfile from "~/modules/profile/components/UserProfile";
import { TabListInterface } from "~/modules/profile/interface/profile";
import { labels } from "~/modules/profile/utils/labels";

import { capitalizeFirstLetter } from "~/core/utils/helper";

const getTextColor = (isActive: boolean) => {
  if (isActive) return "secondary.activeText";
  return "secondary.expiredText";
};

const getBackgroundColor = (isActive: boolean) => {
  if (isActive) return "secondary.activeBg";
  return "secondary.expiredBg";
};

export enum ServiceGroupType {
  SERVICE_PROVIDER = "SERVICE_PROVIDER",
  SERVICE_HEAD = "SERVICE_HEAD",
}

export enum CredentailsMode {
  SERVICEPROVIDER = "SERVICEPROVIDER",
  SERVICEHEAD = "SERVICEHEAD",
}

export const getCallbackEnabledService = (servicesList: any[]) => {
  const filteredData: any = servicesList.filter(
    (data: any) =>
      data.service.callbackEnabled === true && data.service.isActive === true
  );
  return filteredData;
};

export const userCredentials = [
  {
    key: "Name",
    value: "Abd ur rehman",
  },
  { key: "Email", value: "urrehman22@gmail.com" },
  { key: "Address", value: "jeddah, Saudi Arabia" },
  { key: "Contact No", value: "+32 454663456" },
  { key: "Company", value: "Octek Pvt Ltd" },
  { key: "Status", value: "Active" },
  { key: "Role", value: "Azm Support User" },
];

export const profileTabArray: TabListInterface[] = [
  {
    name: "Profile",
    view: <UserProfile />,
  },
  {
    name: "Api Key",
    view: <GenerateToken />,
  },
  {
    name: "Connectivity",
    view: <Connectivity />,
  },
  {
    name: "Configuration",
    view: <Configuration />,
  },
  {
    name: "Custom Headers",
    view: <CustomHeaders />,
  },
  {
    name: "Callback Config",
    view: <Callbacks />,
  },
];

export const cutomHeaderColumns: GridColDef[] = [
  {
    headerName: labels.keyText,
    field: "key",
    flex: 1,
    renderCell: ({ value }) => (
      <Tooltip title={value}>
        <Typography variant="h2" display="inline">
          {value}
        </Typography>
      </Tooltip>
    ),
  },
  {
    headerName: labels.valueText,
    field: "value",
    flex: 1,
    renderCell: ({ value }) => (
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "start",
          alignItems: "center",
        }}
      >
        <Tooltip title={value}>
          <Typography
            variant="h2"
            sx={{
              color: "primary.blackishGray",
            }}
          >
            {value}
          </Typography>
        </Tooltip>
      </Box>
    ),
  },
];

export const callBacksColumns: GridColDef[] = [
  {
    headerName: labels.serviceName,
    field: "serviceName",
    flex: 1,
    renderCell: ({ value }) => (
      <Tooltip title={value}>
        <Typography variant="h2" display="inline">
          {value}
        </Typography>
      </Tooltip>
    ),
  },
  {
    headerName: labels.callbackDescription,
    field: "description",
    flex: 1,
    renderCell: ({ value }) => (
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "start",
          alignItems: "center",
        }}
      >
        <Tooltip title={value}>
          <Typography
            variant="h2"
            sx={{
              color: "primary.blackishGray",
            }}
          >
            {value}
          </Typography>
        </Tooltip>
      </Box>
    ),
  },
  {
    headerName: labels.callbackUrl,
    field: "callbackUrl",
    flex: 1,
    renderCell: ({ value }) => (
      <Tooltip title={value}>
        <Typography variant="h2" display="inline">
          {value}
        </Typography>
      </Tooltip>
    ),
  },
  {
    headerName: labels.customHeaderKey,
    field: "authHeaderKey",
    flex: 1,
    renderCell: ({ value }) => (
      <Tooltip title={value}>
        <Typography variant="h2" display="inline">
          {value}
        </Typography>
      </Tooltip>
    ),
  },
  {
    headerName: labels.customHeaderValue,
    field: "authHeaderValue",
    flex: 1,
    renderCell: ({ value }) => (
      <Tooltip title={value}>
        <Typography variant="h2" display="inline">
          {value}
        </Typography>
      </Tooltip>
    ),
  },
  {
    headerName: labels.status,
    field: "isActive",
    flex: 0.5,
    renderCell: ({ value: isActive }) => {
      return (
        <Chip
          label={capitalizeFirstLetter(
            isActive ? Status.ACTIVE : Status.IN_ACTIVE
          )}
          variant="outlined"
          sx={{
            height: 25,
            fontWeight: 400,
            fontSize: "0.97rem",
            color: getTextColor(isActive),
            border: "none",
            backgroundColor: getBackgroundColor(isActive),
          }}
        />
      );
    },
  },
];

export const configurationList: string[] = ["DP", "Mutual Authentication"];

export const formatAuthTypeName = (inputString: string): string => {
  // Replace underscores with spaces
  const stringWithSpaces = inputString.replace(/_/g, " ");

  // Convert the first letter to uppercase and the rest to lowercase
  return (
    inputString.charAt(0).toUpperCase() +
    stringWithSpaces.slice(1).toLowerCase()
  );
};
