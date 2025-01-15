import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { GridColDef } from "@mui/x-data-grid";

import { labels } from "~/modules/packageManagement/utils/labels";

import { convertToTitleCase } from "~/core/utils/helper";

export const annualPackage = "ANNUAL";
export const serviceBundelPackage = "SERVICES";

function formatCurrency(value: any) {
  // Ensure the input is treated as a string
  let [integerPart, decimalPart] = value.toString().split(".");

  // Add a comma if the integer part has more than 3 digits
  if (integerPart.length > 3) {
    integerPart = `${integerPart.slice(0, -3)},${integerPart.slice(-3)}`;
  }

  // Ensure we always have a decimal part (default to `.0` if missing)
  decimalPart = decimalPart ? decimalPart : "0";

  return `${integerPart}.${decimalPart} SAR`;
}

export const packageStatus = [
  {
    label: "All",
    value: "",
  },
  {
    label: "Active",
    value: "ACTIVE",
  },
  {
    label: "Expired",
    value: "EXPIRED",
  },
  {
    label: "Pending Payment",
    value: "PENDING_PAYMENT",
  },
];

export const getPackageStatusBgColor = (value: string) => {
  if (value === "ACTIVE") {
    return "secondary.activeBg";
  } else if (value === "EXPIRED") {
    return "secondary.expiredBg";
  } else {
    // pending
    return "secondary.pendingBg";
  }
};

export const getFormattedStatus = (value: string) => {
  if (value === "PENDING_PAYMENT") {
    return "PENDING PAYMENT";
  } else {
    return value;
  }
};

export const getPackageStatusTextColor = (value: string) => {
  if (value === "ACTIVE") {
    return "secondary.activeText";
  } else if (value === "EXPIRED") {
    return "secondary.expiredText";
  } else {
    // pending
    return "secondary.pendingText";
  }
};

export const getPackageAvailableAmount = (
  price: string,
  priceConsumption: string,
  packageType: string
) => {
  let availableAmount = 0;

  if (packageType === serviceBundelPackage) {
    availableAmount = Number(price) - Number(priceConsumption);
    return availableAmount;
  } else {
    return availableAmount;
  }
};

export const annualPackageColumns: GridColDef[] = [
  {
    headerName: labels.accountName, // "",
    field: "accountName",
    flex: 1.2,
    renderCell: ({ value }) => (
      <Tooltip title={value}>
        <Typography variant="h2" display="inline">
          {value}
        </Typography>
      </Tooltip>
    ),
  },
  {
    headerName: labels.subAccountName, // "",
    field: "subAccountName",
    flex: 1.2,
    renderCell: ({ value }) => (
      <Tooltip title={value}>
        <Typography variant="h2" display="inline">
          {value}
        </Typography>
      </Tooltip>
    ),
  },
  {
    headerName: labels.packageName, // "",
    field: "packageName",
    flex: 1.2,
    renderCell: ({ value }) => (
      <Tooltip title={value}>
        <Typography variant="h2" display="inline">
          {value}
        </Typography>
      </Tooltip>
    ),
  },
  {
    headerName: labels.price, // "",
    field: "packagePricePerPeriod",
    flex: 1,
    renderCell: ({ value }) => (
      <Tooltip title={`${formatCurrency(value)}`}>
        <Typography
          variant="h2"
          sx={{
            marginTop: 1.8,
            color: "primary.blackishGray",
          }}
        >
          {`${formatCurrency(value)}`}
        </Typography>
      </Tooltip>
    ),
  },
  {
    headerName: labels.transactionLimit,
    field: "packageTransactionLimit",
    flex: 1,
    renderCell: ({ value }) => (
      <Box
        sx={{
          // backgroundColor: "secondary.columnGroupBg",
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Tooltip title={value}>
          <Typography
            variant="h2"
            textAlign="center"
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
    headerName: labels.transactionConsumption,
    field: "transactionConsumption",
    flex: 1,
    renderCell: ({ value }) => (
      <Box
        sx={{
          //  backgroundColor: "secondary.columnGroupBg",
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Tooltip title={value}>
          <Typography
            variant="h2"
            textAlign="center"
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
    headerName: labels.status, // "",
    field: "packageStatus",
    flex: 1,
    renderCell: ({ value }) => {
      return (
        <Chip
          label={convertToTitleCase(getFormattedStatus(value))}
          variant="outlined"
          sx={{
            height: 25,
            fontWeight: 400,
            fontSize: "0.97rem",
            color: getPackageStatusTextColor(value),
            border: "none",
            backgroundColor: getPackageStatusBgColor(value),
          }}
        />
      );
    },
  },

  {
    headerName: labels.activationDate, // "",
    field: "activationDate",
    flex: 1,
    renderCell: ({ value }) => (
      <Tooltip title={value.split("T")[0]}>
        <Typography
          variant="h2"
          sx={{
            marginTop: 1.8,
            color: "primary.blackishGray",
          }}
        >
          {value.split("T")[0]}
        </Typography>
      </Tooltip>
    ),
  },
  {
    headerName: labels.validity, // "",
    field: "packageValidity",
    flex: 1,
    renderCell: ({ value }) => (
      <Tooltip title={formatString(value)}>
        <Typography
          variant="h2"
          sx={{
            marginTop: 1.8,
            color: "primary.blackishGray",
          }}
        >
          {formatString(value)}
        </Typography>
      </Tooltip>
    ),
  },
];

export const servicesPackageColumns: GridColDef[] = [
  {
    headerName: labels.packageName, // "",
    field: "packageName",
    flex: 1.5,
    renderCell: ({ value }) => (
      <Tooltip title={value}>
        <Typography variant="h2" display="inline">
          {value}
        </Typography>
      </Tooltip>
    ),
  },
  {
    headerName: labels.price, // "",
    field: "packagePricePerPeriod",
    flex: 1,
    renderCell: ({ value }) => (
      <Tooltip title={formatCurrency(value)}>
        <Typography
          variant="h2"
          sx={{
            marginTop: 1.8,
            color: "primary.blackishGray",
          }}
        >
          {formatCurrency(value)}
        </Typography>
      </Tooltip>
    ),
  },
  {
    headerName: labels.availableAmount,
    field: "availableAmount",
    flex: 1,
    renderCell: ({ value }) => (
      <Box
        sx={{
          // backgroundColor: "secondary.columnGroupBg",
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Tooltip title={value}>
          <Typography
            variant="h2"
            textAlign="center"
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
    headerName: labels.priceConsumption,
    field: "priceConsumption",
    flex: 1,
    renderCell: ({ value }) => (
      <Box
        sx={{
          //  backgroundColor: "secondary.columnGroupBg",
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Tooltip title={formatCurrency(value)}>
          <Typography
            variant="h2"
            textAlign="center"
            sx={{
              color: "primary.blackishGray",
            }}
          >
            {formatCurrency(value)}
          </Typography>
        </Tooltip>
      </Box>
    ),
  },

  {
    headerName: labels.status, // "",
    field: "packageStatus",
    flex: 1,
    renderCell: ({ value }) => {
      return (
        <Chip
          label={convertToTitleCase(getFormattedStatus(value))}
          variant="outlined"
          sx={{
            height: 25,
            fontWeight: 400,
            fontSize: "0.97rem",
            color: getPackageStatusTextColor(value),
            border: "none",
            backgroundColor: getPackageStatusBgColor(value),
          }}
        />
      );
    },
  },

  {
    headerName: labels.activationDate, // "",
    field: "activationDate",
    flex: 1,
    renderCell: ({ value }) => (
      <Tooltip title={value.split("T")[0]}>
        <Typography
          variant="h2"
          sx={{
            marginTop: 1.8,
            color: "primary.blackishGray",
          }}
        >
          {value.split("T")[0]}
        </Typography>
      </Tooltip>
    ),
  },
  {
    headerName: labels.validity, // "",
    field: "packageValidity",
    flex: 1,
    renderCell: ({ value }) => (
      <Tooltip title={formatString(value)}>
        <Typography
          variant="h2"
          sx={{
            marginTop: 1.8,
            color: "primary.blackishGray",
          }}
        >
          {formatString(value)}
        </Typography>
      </Tooltip>
    ),
  },
];

export const updateTransactionLimit = (
  arr: string[],
  transactionLimit: number
): string[] => {
  return [`Upto ${transactionLimit} Transactions`, ...arr];
};

export const annualSubscriptionDescriptions: string[] = [
  "Developer Portal Access",
  "Include support Prior and Post Go-Live",
  "Support Post Go-Live",
];

export const serviceBundleDescriptions: string[] = [
  "Valid for one year",
  "Services price same of provider",
  "Government services cost will be deducted based on consumption “actual prices for government services fees”.",
  "Service fee deduction will be on consumed transactions per choosen service.",
  "App prices are TAX and VAT excluded.",
];

export const postPaidDescriptions: string[] = [
  "Invoices issued at the end of the month",
  "Invoices should be paid within 7 days maximum",
  "Government services cost will be deducted based on consumption “actual prices for government services fees”.",
  "Service fee deduction will be on consumed transactions per choosen service.",
  "App prices are TAX and VAT excluded.",
];

const formatString = (value: string): string => {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

export const getCompanyActivePackages = (
  packageList: any,
  packageType: string
) => {
  const filteredData = packageList
    // Step 1: Filter by packageType and packageStatus
    .filter(
      (item: any) =>
        item.package.packageType === packageType &&
        item.packageStatus === "ACTIVE"
    )
    // Step 2: Remove duplicates based on package.id
    .reduce(
      (acc: any, current: any) => {
        if (!acc.seenPackageIds.has(current.package.id)) {
          acc.filtered.push(current);
          acc.seenPackageIds.add(current.package.id);
        }
        return acc;
      },
      { filtered: [], seenPackageIds: new Set() }
    ).filtered;

  return filteredData;
};
