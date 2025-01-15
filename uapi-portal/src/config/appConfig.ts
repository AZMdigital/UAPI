import { AppType, ConfigType, SettingsType } from "~/config/appConfig.d";

export const app: AppType = {
  appName: "API-HUB-PORTAL",
  userPath: "",
};

export const pageSizeOptions = [10];
export const pagination = { paginationModel: { page: 0, pageSize: 10 } };

export const settings: SettingsType = {
  defaultDateFormat: "dd/MM/yyyy",
  defaultDateFormatReverse: "yyyy/MM/dd",
  defaultDateTimeFormat: "dd/MM/yyyy HH:mm",
  defaultTimeFormat: "HH:mm",
};

export enum Status {
  ACTIVE = "active",
  IN_ACTIVE = "InActive",
}

const config: ConfigType = {
  app,
  settings,
};

export default config;
