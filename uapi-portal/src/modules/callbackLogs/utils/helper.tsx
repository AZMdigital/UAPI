import { Box } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { GridColDef } from "@mui/x-data-grid";
import dayjs from "dayjs";
import moment from "moment";

export const callbackLogsColumns: GridColDef[] = [
  {
    headerName: "Service Name",
    field: "serviceName",
    flex: 1,
    renderCell: ({ value }) => {
      return (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Tooltip title={value}>
            <Typography variant="h2" display="inline" noWrap>
              {value}
            </Typography>
          </Tooltip>
        </Box>
      );
    },
  },
  {
    headerName: "Created At",
    field: "createdAt",
    flex: 1,
    renderCell: ({ value }) => {
      const displayValue = value ? value : "-";
      return (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Tooltip title={displayValue}>
            <Typography variant="h2" display="inline" noWrap>
              {displayValue}
            </Typography>
          </Tooltip>
        </Box>
      );
    },
  },
];

export const getFormattedDateTime = (dateStr: string) => {
  const date = moment(dateStr);
  return date.format("MMM DD YYYY, h:mm:ss a");
};

export const getDayJsDate = (dateStr: string) => {
  const formattedDate = dayjs(dateStr).format?.("YYYY-MM-DD");
  if (formattedDate !== "Invalid Date") {
    return formattedDate;
  } else {
    return "";
  }
};

export const truncateString = (str: string, maxLength: number): string => {
  return str.length > maxLength ? `${str.slice(0, maxLength - 3)}...` : str;
};
