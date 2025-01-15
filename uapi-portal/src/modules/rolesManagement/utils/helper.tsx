import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { GridColDef } from "@mui/x-data-grid";

import { Status } from "~/config/appConfig";

import { PermissionType } from "~/rest/models/role";

import { labels } from "~/modules/rolesManagement/utils/labels";

import { capitalizeFirstLetter, Field, FieldTypes } from "~/core/utils/helper";

const getTextColor = (isActive: boolean) => {
  if (isActive) return "secondary.activeText";
  return "secondary.expiredText";
};

const getBackgroundColor = (isActive: boolean) => {
  if (isActive) return "secondary.activeBg";
  return "secondary.expiredBg";
};

export const permissionOptions = [
  {
    id: 0,
    value: "Enable-All",
    label: "Enable All",
  },
  // {
  //   id: 1,
  //   value: "Disable-All",
  //   label: "Disable All",
  // },
];

export const rolesColumns: GridColDef[] = [
  {
    headerName: labels.roleId,
    field: "roleCode",
    flex: 0.5,
    renderCell: ({ value }) => (
      <Tooltip title={value}>
        <Typography variant="h2" display="inline">
          {value}
        </Typography>
      </Tooltip>
    ),
  },
  {
    headerName: labels.roleName,
    field: "name",
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
    headerName: labels.roleStatus,
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

export const rolesFormFields: Field[] = [
  {
    controllerName: "id",
    label: labels.roleId,
    type: FieldTypes.TEXT,
    isDisabled: false,
    isRequired: true,
  },
  {
    controllerName: "name",
    label: labels.roleName,
    type: FieldTypes.TEXT,
    isDisabled: false,
    isRequired: true,
  },
  {
    controllerName: "isActive",
    label: labels.roleStatus,
    type: FieldTypes.TEXT,
    isDisabled: false,
    isRequired: true,
  },
  {
    controllerName: "permissions",
    label: labels.rolePermissions,
    type: FieldTypes.TEXT,
    isDisabled: false,
    isRequired: true,
  },
];

export const getPermissionNames = (data: PermissionType[]) => {
  const permissions = data.map(({ id, name, handle }) => ({
    id,
    name,
    handle,
  }));
  return permissions;
};

export const getPermissionHandles = (data: PermissionType[]) => {
  const permissions = data.map((permission) => permission.handle);
  return permissions;
};
