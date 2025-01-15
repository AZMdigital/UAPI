import AddModeratorOutlinedIcon from "@mui/icons-material/AddModeratorOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import dayjs from "dayjs";
import moment from "moment";

import {
  PERMISSION_API_KEY_VIEW,
  PERMISSION_COMPANY_CALLBACK_CONFIG_VIEW,
  PERMISSION_CONFIGURATION_VIEW,
  PERMISSION_CONNECTIVITY_VIEW,
  PERMISSION_CONSUMPTION_VIEW,
  PERMISSION_CUSTOM_HEADER_VIEW,
  PERMISSION_INVOICE_VIEW,
  PERMISSION_LOGS_VIEW,
  PERMISSION_PACKAGE_VIEW,
  PERMISSION_PROFILE_VIEW,
  PERMISSION_ROLE_VIEW,
  PERMISSION_SERVICE_VIEW,
  PERMISSION_USER_VIEW,
  SUB_ACCOUNT_VIEW,
} from "~/utils/permissionsConstants";

import { PermissionType } from "~/rest/models/role";

import { TabListInterface } from "~/modules/profile/interface/profile";

import { IconStyleInterface } from "~/core/components/interface";
import { labels } from "~/core/utils/labels";

export const paths = {
  loginPage: "/login",
  homePage: "/home",
  swaggerPage: "/swagger",
  profilePage: "/profile",
  servicesPage: "/services",
  packageManagement: "/packageMangement",
  createPackageManagement: "/packageMangement/package",
  invoices: "/invoiceManagement",
  roles: "/roleManagement",
  createRole: "/roleManagement/role",
  user: "/userMangement",
  createUserPage: "/userMangement/user",
  unAuthPage: "/UnAuthrizedPage",
  reportsPage: "/reports",
  reportsConsumptionDetail: "/reports/consumptionDetail",
  reportsConsumptionDetailOwnLicense: "/reports/ownLicenseConsumptionDetail",
  reportLogs: "/reports/logs",
  dashboard: "/dashboard",
  auditLogs: "/auditLogs",
  subAccounts: "/subAccountManagement",
  createSubAccounts: "/subAccountManagement/account",
  callbackLogs: "/callbackLogs",
};
export const TABS_ARRAY = [
  { name: "Home", path: paths.homePage },
  { name: "Services", path: paths.servicesPage },
  // { name: "Packages", path: paths.packageManagement },
  // { name: "About us", path: null },
];

export const INVALID_DATE = "Invalid Date";

export const addPackageTabs = [
  {
    label: labels.annualSubscriptionTiers,
    component: "",
    disabled: false,
  },
  {
    label: labels.serviceBundles,
    component: "",
    disabled: false,
  },
];

export const iconStyle: IconStyleInterface = {
  height: 14,
  width: 14,
  marginBottom: 0,
};

export const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getFormattedDate = (dateStr: string) => {
  return dayjs(dateStr).format?.("YYYY-MM-DD");
};

export const getFormattedDateWithTime = (date: string) => {
  return moment(date).format("ddd DD MMM YYYY h:mm A");
};

export const getMomentFormattedDate = (dateStr: string) => {
  const date = moment(dateStr);
  return date.format("YYYY-MM-DD");
};

export const getFileExtention = (filename: string) => {
  const lastDot = filename.lastIndexOf(".");
  return filename.substring(lastDot + 1);
};

export class MenuConfig {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  items: NavMenuItem[] = [
    {
      id: "1",
      title: labels.packageManagement,
      icon: <ShoppingBagOutlinedIcon />,
      page: paths.packageManagement,
      showBottomDivider: false,
    },
    {
      id: "2",
      title: labels.myInvoices,
      icon: <ReceiptOutlinedIcon />,
      page: paths.invoices,
      showBottomDivider: false,
    },
    {
      id: "3",
      title: labels.rolesAndPermissions,
      icon: <AddModeratorOutlinedIcon />,
      page: paths.roles,
      showBottomDivider: false,
    },

    {
      id: "4",
      title: labels.userManagement,
      icon: <PeopleOutlineIcon />,
      page: paths.user,
      showBottomDivider: false,
    },
    {
      id: "5",
      title: labels.reports,
      icon: <AssessmentOutlinedIcon />,
      page: paths.reportsPage,
      showBottomDivider: false,
      parentCheck: true,
      children: [
        ConsumptionDetailMenuItem,
        ConsumptionDetailOwnLicenseMenuItem,
        LogsReportMenuItem,
        AuditLogsMenuItem,
        CallbackLogsMenuItem,
      ],
    },
  ];

  public get navItems(): NavMenuItem[] {
    return this.items;
  }
}

export const DashboardMenuItem: NavMenuItem = {
  id: "6",
  title: labels.dashboard,
  icon: <DashboardCustomizeIcon />,
  page: paths.dashboard,
  showBottomDivider: false,
};

export const SubAccountMenuItem: NavMenuItem = {
  id: "7",
  title: labels.subAccounts,
  icon: <DashboardCustomizeIcon />,
  page: paths.subAccounts,
  showBottomDivider: false,
};

export const ReportsMenuItem: NavMenuItem = {
  id: "5",
  title: labels.reports,
  icon: <AssessmentOutlinedIcon />,
  page: paths.reportsPage,
  showBottomDivider: false,
  parentCheck: true,
  children: [],
};

export const ConsumptionDetailMenuItem: any = {
  id: "5.1",
  title: labels.consumptionDetails,
  icon: <AssessmentOutlinedIcon />,
  page: paths.reportsConsumptionDetail,
  showBottomDivider: false,
};

export const ConsumptionDetailOwnLicenseMenuItem: any = {
  id: "5.2",
  title: labels.consumptionDetailOwnLicense,
  icon: <AssessmentOutlinedIcon />,
  page: paths.reportsConsumptionDetailOwnLicense,
  showBottomDivider: false,
};

export const LogsReportMenuItem: any = {
  id: "5.3",
  title: labels.logs,
  icon: <AssessmentOutlinedIcon />,
  page: paths.reportLogs,
  showBottomDivider: false,
};

export const AuditLogsMenuItem: any = {
  id: "5.4",
  title: labels.auditLogs,
  icon: <AssessmentOutlinedIcon />,
  page: paths.auditLogs,
  showBottomDivider: false,
};
export const CallbackLogsMenuItem: any = {
  id: "5.5",
  title: labels.callbackLogs,
  icon: <AssessmentOutlinedIcon />,
  page: paths.callbackLogs,
  showBottomDivider: false,
};

export enum FormModes {
  EDIT = "edit",
  CREATE = "create",
  VIEW = "view",
}

export enum AccountType {
  MAIN = "MAIN",
  SUB = "SUB",
}

export interface NavMenuItem {
  id: string;
  title: string;
  page: string;
  icon: any;
  showBottomDivider: boolean;
  children?: any;
  parentCheck?: boolean;
}

export const convertToTitleCase = (
  input: string | null | undefined
): string => {
  if (!input || input.trim().length === 0) return ""; // Return empty string for null, undefined, or empty input

  // Convert the entire string to lowercase and split into an array of words
  const words = input.toLowerCase().split(" ");

  // Capitalize the first letter of each word
  const titleCaseWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1)
  );

  // Join the title-cased words back into a single string
  return titleCaseWords.join(" ");
};

export enum FieldTypes {
  TEXT = "text",
  DATE = "date",
  NUMBER = "number",
  PHONE_NUMBER = "PHONE_NUMBER",
  SELECT = "SELECT",
  RADIO = "RADIO",
  CHECKBOX = "CHECKBOX",
}

export interface Field {
  controllerName: string;
  label: string;
  type: FieldTypes;
  isDisabled?: boolean;
  isRequired?: boolean;
  shouldShowHeading?: boolean;
  headingText?: string;
  icon?: any;
  textFieldType?: string;
  gridXsValue?: number;
  suffixText?: string;
}

export const isEditFormMode = (mode: FormModes) => {
  if (mode === FormModes.EDIT) {
    return true;
  } else {
    return false;
  }
};

export const checkPermission = (
  handle: string,
  permissions: PermissionType[]
) => {
  const filteredData: any = permissions.filter(
    (permission: any) => permission === handle
  );

  if (filteredData.length > 0) {
    return true;
  } else false;
};

export const shouldAddProfile = (permissions: PermissionType[]) => {
  // Check for Profile permission
  // If all subflows of profiles are disabled than disable the whole Profile flow
  const filterPermissionsData = permissions.filter(
    (permission) =>
      permission.handle === "profile" ||
      permission.handle === "api-key" ||
      permission.handle === "connectivity" ||
      permission.handle === "configurations"
  );

  if (filterPermissionsData.length > 0) {
    return true;
  } else {
    return false;
  }
};

export const getNavbarListByRole = (
  navBarlist: any[],
  permissions: PermissionType[],
  isSuperAdmin: boolean
) => {
  let returnNavBarList = [];

  // if superAdmin
  if (isSuperAdmin) {
    // return the whole list
    returnNavBarList = navBarlist;
  } else {
    // Always show the Home
    returnNavBarList.push(navBarlist[0]);

    // Check for Service permission
    if (checkPermission(PERMISSION_SERVICE_VIEW, permissions)) {
      returnNavBarList.push(navBarlist[1]);
    }
  }
  // Return the finalArray
  return returnNavBarList;
};

export const getProfileTabListByRole = (
  tablist: TabListInterface[],
  permissions: PermissionType[],
  isSuperAdmin: boolean
) => {
  let returnTabList: TabListInterface[] = [];

  // if superAdmin
  if (isSuperAdmin) {
    // return the whole list
    returnTabList = tablist;
  } else {
    // Check for Profile permission
    if (checkPermission(PERMISSION_PROFILE_VIEW, permissions)) {
      returnTabList.push(tablist[0]);
    }

    // Check for API Key permission
    if (checkPermission(PERMISSION_API_KEY_VIEW, permissions)) {
      returnTabList.push(tablist[1]);
    }

    // Check for API Key permission
    if (checkPermission(PERMISSION_CONNECTIVITY_VIEW, permissions)) {
      returnTabList.push(tablist[2]);
    }

    // Check for Configuration permission
    if (checkPermission(PERMISSION_CONFIGURATION_VIEW, permissions)) {
      returnTabList.push(tablist[3]);
    }

    // Check for Custom Headers
    if (checkPermission(PERMISSION_CUSTOM_HEADER_VIEW, permissions)) {
      returnTabList.push(tablist[4]);
    }

    // Check for Callbacks
    if (checkPermission(PERMISSION_COMPANY_CALLBACK_CONFIG_VIEW, permissions)) {
      returnTabList.push(tablist[5]);
    }
  }

  return returnTabList;
};

export const getSideMenuOptionByRole = (
  menulist: NavMenuItem[],
  permissions: PermissionType[],
  isSuperAdmin: boolean,
  accountType: string,
  useMainAccountBundle: boolean
) => {
  let returnMenuList: NavMenuItem[] = [];

  // if superAdmin
  if (isSuperAdmin) {
    // return the whole list
    // returnMenuList = menulist;
    // returnMenuList = [DashboardMenuItem, SubAccountMenuItem, ...menulist];

    if (accountType === AccountType.MAIN) {
      returnMenuList = [DashboardMenuItem, SubAccountMenuItem, ...menulist];
    } else {
      if (useMainAccountBundle) {
        const allItemsWithOutInvoice = menulist.filter(
          (item) => item.id !== "2"
        );
        returnMenuList = [DashboardMenuItem, ...allItemsWithOutInvoice];
      } else {
        returnMenuList = [DashboardMenuItem, ...menulist];
      }
    }
  } else {
    // We have to add dashboard in all cases
    returnMenuList.push(DashboardMenuItem);

    // Checks for Sub Account Management
    // If accountType is "MAIN" then add Sub account management in the list
    if (accountType === AccountType.MAIN) {
      // We will Add If Checks in it
      if (checkPermission(SUB_ACCOUNT_VIEW, permissions)) {
        returnMenuList.push(SubAccountMenuItem);
      }
    }

    // Check for Package Management
    if (checkPermission(PERMISSION_PACKAGE_VIEW, permissions)) {
      returnMenuList.push(menulist[0]);
    }

    // Check for Invoice Management

    if (accountType === AccountType.MAIN) {
      if (checkPermission(PERMISSION_INVOICE_VIEW, permissions)) {
        returnMenuList.push(menulist[1]);
      }
    } else {
      // Sub Account
      if (!useMainAccountBundle) {
        if (checkPermission(PERMISSION_INVOICE_VIEW, permissions)) {
          returnMenuList.push(menulist[1]);
        }
      }
    }

    // Check for Roles Management
    if (checkPermission(PERMISSION_ROLE_VIEW, permissions)) {
      returnMenuList.push(menulist[2]);
    }

    // Check for User Management
    if (checkPermission(PERMISSION_USER_VIEW, permissions)) {
      returnMenuList.push(menulist[3]);
    }

    // Check for Consumption Report
    if (checkPermission(PERMISSION_CONSUMPTION_VIEW, permissions)) {
      const reportsMenu = ReportsMenuItem;
      reportsMenu.children = [
        ConsumptionDetailMenuItem,
        ConsumptionDetailOwnLicenseMenuItem,
      ];
      returnMenuList.push(reportsMenu);
    }
    // Check for Logs Report
    if (checkPermission(PERMISSION_LOGS_VIEW, permissions)) {
      const index = returnMenuList.findIndex((item: any) => item.id === "5");
      if (index !== -1) {
        const reportsItem = returnMenuList[index];
        reportsItem.children.push(
          LogsReportMenuItem,
          AuditLogsMenuItem,
          CallbackLogsMenuItem
        );
        returnMenuList[index] = reportsItem;
      } else {
        const reportsMenu = ReportsMenuItem;
        reportsMenu.children = [
          LogsReportMenuItem,
          AuditLogsMenuItem,
          CallbackLogsMenuItem,
        ];
        returnMenuList.push(reportsMenu);
      }
    }
  }

  // Return the finalArray
  return returnMenuList;
};
