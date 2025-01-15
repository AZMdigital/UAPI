type AppType = {
  appName: string;
  userPath: string;
};
export type SettingsType = {
  defaultDateFormat: string;
  defaultDateFormatReverse: string;
  defaultTimeFormat: string;
  defaultDateTimeFormat: string;
};

export type ConfigType = {
  app: AppType;
  settings: SettingsType;
};
