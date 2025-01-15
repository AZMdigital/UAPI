import { AlertColor } from "@mui/material/Alert";

import { PermissionType } from "~/rest/models/role";

import { UserType } from "~/modules/profile/interface/profile";
import { CompanyInputType } from "~/modules/subAccountManagement/interfaces/subAccount.interface";

import { FormModes } from "~/core/utils/helper";

// declaring the types for our state
type UserState = {
  token: string | null;
  refreshToken: string | null;
  validity: number | null;
  refreshValidity: number | null;
  tokenType: string | null;
  message: string | null;
  messageType: AlertColor | undefined;
  isSnackOpen: boolean;
  userInfo: UserType | null;
  selectedOriginalServiceHead: string;
  parentItem: string;
  childItem: string;
  formMode: FormModes;
  openModal: boolean;
  modalTitle: string;
  openPopOver: boolean;
  userRolePermissions: PermissionType[];
  currentCompany: CompanyInputType | undefined;
  mainAccountToken: string | null;
  mainAccountRefreshToken: string | null;
  mainAccountValidity: number | null;
  mainAccountRefreshValidity: number | null;
  mainAccountTokenType: string | null;
  openUploadModal: boolean;
};
const userInitialState: UserState = {
  token: null,
  refreshToken: null,
  validity: null,
  refreshValidity: null,
  tokenType: null,
  message: null,
  messageType: undefined,
  isSnackOpen: false,
  userInfo: null,
  parentItem: "",
  childItem: "",
  formMode: FormModes.CREATE,
  selectedOriginalServiceHead: "",
  openModal: false,
  modalTitle: "Modal",
  openPopOver: false,
  userRolePermissions: [],
  currentCompany: undefined,
  mainAccountToken: null,
  mainAccountRefreshToken: null,
  mainAccountValidity: null,
  mainAccountRefreshValidity: null,
  mainAccountTokenType: null,
  openUploadModal: false,
};

export default userInitialState;
