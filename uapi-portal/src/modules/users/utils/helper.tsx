import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { GridColDef } from "@mui/x-data-grid";

import { Status } from "~/config/appConfig";

import { labels } from "~/modules/users/utils/labels";

import { Field } from "~/core/components/interface";
import { capitalizeFirstLetter } from "~/core/utils/helper";

export const userFormFields: Field[] = [
  {
    controllerName: "id",
    label: labels.id,
    isRequired: false,
  },
  {
    controllerName: "firstName",
    label: labels.firstName,
    isRequired: true,
  },

  {
    controllerName: "lastName",
    label: labels.lastName,
    isRequired: true,
  },
  {
    controllerName: "nationalId",
    label: labels.nationalId,
    isRequired: true,
  },
  {
    controllerName: "email",
    label: labels.email,
    isRequired: true,
  },
  {
    controllerName: "username",
    label: labels.userName,
    isRequired: true,
  },

  {
    controllerName: "contactNo",
    label: labels.contactNo,
    isRequired: true,
  },
  {
    controllerName: "roleId",
    label: labels.role,
    isRequired: true,
    headingText: "Select Role",
  },
  {
    controllerName: "isActive",
    label: labels.isActive,
    isRequired: true,
    headingText: "Select Status",
  },
];

export const userTypes = [
  { name: "select Role", value: "SELECT" },
  { name: "Company User", value: "COMPANY_USER" },
  { name: "Support User", value: "SUPPORT_USER" },
];

export const userStatus = [
  { name: "Active", value: Status.ACTIVE },
  { name: "Inactive", value: Status.IN_ACTIVE },
];

export const zeroPad = (num: number, places: number) =>
  String(num).padStart(places, "0");

const getTextColor = (isActive: boolean) => {
  if (isActive) return "secondary.activeText";
  return "secondary.expiredText";
};

const getBackgroundColor = (isActive: boolean) => {
  if (isActive) return "secondary.activeBg";
  return "secondary.expiredBg";
};
export const userColumns: GridColDef[] = [
  {
    headerName: labels.id,
    field: "userCode",
    flex: 1,
    renderCell: ({ value }) => (
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Tooltip title={zeroPad(value, 3)}>
          <Typography
            variant="h2"
            sx={{
              color: "primary.blackishGray",
            }}
          >
            {zeroPad(value, 3)}
          </Typography>
        </Tooltip>
      </Box>
    ),
  },
  {
    headerName: labels.firstName,
    field: "firstName",
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
    headerName: labels.lastName,
    field: "lastName",
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
    headerName: labels.userName,
    field: "username",
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
    headerName: labels.email,
    field: "email",
    flex: 1,
    renderCell: ({ value }) => (
      <Tooltip title={value}>
        <Typography
          variant="h2"
          sx={{
            textDecoration: "underline",
          }}
          display="inline"
        >
          {value}
        </Typography>
      </Tooltip>
    ),
  },
  {
    headerName: labels.contactNo,
    field: "contactNo",
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
    headerName: labels.userRole,
    field: "roleName",
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
    flex: 1,
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

export const disableFields = ["username", "email"];
