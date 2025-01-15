import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { GridColDef } from "@mui/x-data-grid";
import dayjs from "dayjs";
import moment from "moment";

import { ConsumptionAccountType } from "~/rest/models/reports";

export const transactionStatus = [
  {
    label: "All",
    value: "",
  },
  {
    label: "Success",
    value: "SUCCESS",
  },
  {
    label: "Failed",
    value: "FAILED",
  },
];

export const consumptionDetailColumns: GridColDef[] = [
  {
    headerName: "Service",
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
    headerName: "Success Transactions",
    field: "successTransaction",
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
    headerName: "Failure Transactions",
    field: "failedTransactions",
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
    headerName: "Total Transactions",
    field: "totalTransactions",
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
    headerName: "Due Month",
    field: "dueMonth",
    flex: 1,
    renderCell: ({ value }) => (
      <Tooltip title={moment(value, "MM").format("MMMM")}>
        <Typography variant="h2" display="inline">
          {moment(value, "MM").format("MMMM")}
        </Typography>
      </Tooltip>
    ),
  },
];

export const getSumOfAllValues = <K extends keyof ConsumptionAccountType>(
  key: K,
  array: ConsumptionAccountType[]
): number =>
  array.reduce(
    (accumulator, currentItem) => accumulator + (currentItem[key] as number),
    0
  );

export const addNoneOption = (dataList: any[]) => {
  const noneOption: any = {};
  noneOption.service = {
    id: 1,
    name: "None",
  };
  const returnList: any[] = dataList;
  returnList.unshift(noneOption);
  return returnList;
};

export const logsColumns: GridColDef[] = [
  {
    headerName: "Transactions Date",
    field: "transactionDate",
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
    headerName: "Request Message",
    field: "requestText",
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
        <Tooltip title={value}>
          <Typography variant="h2" display="inline" noWrap>
            {value}
          </Typography>
        </Tooltip>
      </Box>
    ),
  },
  {
    headerName: "Response Message",
    field: "responseText",
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
        <Tooltip title={value}>
          <Typography variant="h2" display="inline" noWrap>
            {value}
          </Typography>
        </Tooltip>
      </Box>
    ),
  },
  {
    headerName: "Endpoint URL",
    field: "url",
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
        <Tooltip title={value}>
          <Typography variant="h2" display="inline" noWrap>
            {value}
          </Typography>
        </Tooltip>
      </Box>
    ),
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
