import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { GridColDef } from "@mui/x-data-grid";

import { Status } from "~/config/appConfig";

import { AdminInfoFormInputs } from "~/modules/subAccountManagement/interfaces/subAccount.interface";
import { labels } from "~/modules/subAccountManagement/utils/labels";

import { ActionCriteria } from "~/core/components/interface";
import { capitalizeFirstLetter, Field, FieldTypes } from "~/core/utils/helper";

export const isValidEmail = (email: string) => {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(email);
};

const getColor = (isActive: boolean) => {
  if (isActive) return "secondary.active";
  return "secondary.inActive";
};

export const switchAccountCriteria: ActionCriteria = {
  key: "isSwitchable",
  value: true,
};
export const subAccountsColumns: GridColDef[] = [
  {
    headerName: labels.accountCode,
    field: "accountCode",
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
    headerName: labels.subAccountName,
    field: "companyName",
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
    headerName: labels.useAccountBundles,
    field: "useMainAccountBundles",
    flex: 1,
    renderCell: ({ value }) => (
      <Tooltip title={value ? "Yes" : "No"}>
        <Typography variant="h2" display="inline">
          {value ? "Yes" : "No"}
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
            color: getColor(isActive),
            borderColor: getColor(isActive),
          }}
        />
      );
    },
  },
];

export const getAdminInfoFields = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  values: AdminInfoFormInputs
): Array<Field> => {
  return [
    {
      controllerName: "companyName",
      label: labels.projectName,
      type: FieldTypes.TEXT,
      isDisabled: false,
      isRequired: true,
    },
    {
      controllerName: "subAccountDescription",
      label: labels.description,
      type: FieldTypes.TEXT,
      isDisabled: false,
      isRequired: true,
    },
    {
      controllerName: "user.firstName",
      label: labels.firstName,
      type: FieldTypes.TEXT,
      isDisabled: false,
      isRequired: true,
    },
    {
      controllerName: "user.lastName",
      label: labels.lastName,
      type: FieldTypes.TEXT,
      isDisabled: false,
      isRequired: true,
    },
    {
      controllerName: "user.nationalId",
      label: labels.nationalId,
      type: FieldTypes.NUMBER,
      isDisabled: false,
      isRequired: true,
    },
    {
      controllerName: "user.username",
      label: labels.username,
      type: FieldTypes.TEXT,
      isDisabled: false,
      isRequired: true,
    },
    {
      controllerName: "user.email",
      label: labels.email,
      type: FieldTypes.TEXT,
      isDisabled: false,
      isRequired: true,
    },
    {
      controllerName: "user.contactNo",
      label: labels.mobileNumber,
      textFieldType: "number",
      type: FieldTypes.TEXT,
      isDisabled: false,
      isRequired: true,
    },

    {
      controllerName: "isActive",
      label: labels.status,
      type: FieldTypes.SELECT,
      isDisabled: false,
      isRequired: true,
    },
    {
      controllerName: "useMainAccountBundles",
      label: labels.useMainAccountBundles,
      type: FieldTypes.CHECKBOX,
      isDisabled: false,
      isRequired: true,
    },
  ];
};
