import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { GridColDef } from "@mui/x-data-grid";
import dayjs from "dayjs";

import { labels } from "~/modules/auditLogs/utils/labels";

export const auditLogsColumns: GridColDef[] = [
  {
    headerName: labels.account,
    field: "updatedCompanyName",
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
    field: "updatedByUserName",
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
    headerName: labels.module,
    field: "moduleName",
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
    headerName: labels.activity,
    field: "description",
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
    headerName: labels.activityDate,
    field: "date",
    flex: 1,
    renderCell: ({ value }) => (
      <Tooltip title={value}>
        <Typography variant="h2" display="inline">
          {value}
        </Typography>
      </Tooltip>
    ),
  },
];

export const auditActivityDetailColumns: GridColDef[] = [
  {
    headerName: labels.path,
    field: "path",
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
    headerName: labels.operation,
    field: "operation",
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
    headerName: labels.oldValue,
    field: "oldValue",
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
    headerName: labels.newValue,
    field: "newValue",
    flex: 1,
    renderCell: ({ value }) => (
      <Tooltip title={value}>
        <Typography variant="h2" display="inline">
          {value}
        </Typography>
      </Tooltip>
    ),
  },
];

export const getDayJsDate = (dateStr: string) => {
  const formattedDate = dayjs(dateStr).format?.("YYYY-MM-DD");
  if (formattedDate !== "Invalid Date") {
    return formattedDate;
  } else {
    return "";
  }
};
