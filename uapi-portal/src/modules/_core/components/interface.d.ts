import { MutableRefObject, ReactElement } from "react";
import { IconType } from "@mui/icons-material";
import {
  GridColDef,
  GridColumnGroupingModel,
  GridFeatureMode,
} from "@mui/x-data-grid";
import dayjs from "dayjs";

export interface StepperComponentProps {
  onBoardingSteps: any;
  currentActiveStep: number;
  handleBack?: any;
  moveToStep: (stepNumber: number) => void;
}

export interface CustomTextFieldControllerProps {
  control?: any;
  controllerName: string;
  label?: string | ReactElement;
  isDisabled?: boolean;
  showHeading?: boolean;
  headingText?: string;
  headingColor?: string;
  showIcon?: IconType;
  handleChange?: (event: any) => void;
  errorMessage?: string;
  textFieldType?: string;
  marginTop?: string;
  size?: "medium" | "small";
  borderRadius?: string;
  labelColor?: string;
  inputPadding?: number;
  height?: number;
  isRequired?: boolean;
  dateFormat?: string;
  minDate?: dayjs;
  maxDate?: dayjs;
  dateViews?: readonly any[];
  defaultDate?: Date;
  showBottomHeading?: boolean;
  bottomHeadingText?: string;
  hideErrorMessage?: boolean;
  options?: any[];
  placeHolderText?: string;
  showToolTip?: boolean;
}

export interface CheckboxControllerProps {
  controllerName: string;
  label: string;
  showToolTip?: boolean;
  toolTiptext?: string;
  disabled?: boolean;
}

export interface CustomRadioGroupControllerProps {
  controllerName: string;
  label: string;
  headingColor?: string;
  isRequired?: boolean;
  disabled?: boolean;
  onSelectChange?: (newValue: any) => void;
  options: Array<{ id: number; value: string; label: string }>;
  readonly?: boolean;
  rowDirection: boolean;
}

export interface TabInterface {
  label: string;
  component: string;
  disabled: boolean;
}

export interface LoadingViewInterface {
  height?: string;
}

export interface UnAuthViewProps {
  hideHomeBtn?: boolean;
}

export interface TabsComponentProps {
  currentActiveStep: number;
  setCurrentTab: (tabnumber: number) => void;
  tabArray?: TabInterface[];
}

export interface PopupType {
  id?: number;
}

export interface SearchTextFieldProps {
  onSearch?: (query: string) => void;
  interval?: number;
  isSearchLoading?: boolean;
  searchPlaceHolder: string;
}

export interface SearchTextFieldControllerProps {
  controllerName: string;
  label?: string | ReactElement;
  isDisabled?: boolean;
  showHeading?: boolean;
  showBottomHeading?: boolean;
  bottomHeadingText?: string;
  headingText?: string;
  headingColor?: string;
  showIcon?: any;
  handleChange?: () => void;
  errorMessage?: string;
  textFieldType?: string;
  size?: any;
  marginTop?: string;
  isRequired: boolean;
  dateFormat?: string;
  isLoading?: boolean;
  searchName: (name: string) => Promise<boolean>;
}

export interface ActionCriteria {
  key: any;
  value: any;
}

export interface TableInterface {
  columns: GridColDef[];
  rows: any[];
  onDelete?: (id: number) => void;
  onEdit?: (input: any) => void;
  onCustomAction?: (input: any) => void;
  actionCriteria?: ActionCriteria;
  loading: boolean;
  deleting: boolean;
  actions?: boolean;
  showActionTitle?: boolean;
  showViewButton?: boolean;
  showEditButton?: boolean;
  showDeleteButton?: boolean;
  showCustomActionButton?: boolean;
  customActionTitle?: string;
  onView?: (id: any) => void;
  showFooterRow?: boolean;
  footerView?: any;
  columnGrouping?: GridColumnGroupingModel;
  paginationMode?: GridFeatureMode;
  paginationModel?: any;
  rowCount?: number;
  onPaginationModelChange?: (value: any) => void;
  columnHeaderHeight?: number;
  showHeaderView?: boolean;
  headerName?: string;
  defaultPageSize?: number;
}

export interface ConatinerLayoutInterface {
  children: React.ReactNode;
  buttonLabel?: string;
  buttonAction?: () => void;
  breadCrumbs: string[];
  showButton?: boolean;
  id?: string;
}

export interface CustomDropDownControllerProps {
  controllerName: string;
  label?: string;
  placeHolder?: string;
  children?: React.ReactNode;
  isRequired: boolean;
  headingColor?: string;
  selectedValue?: string;
  disabled?: boolean;
  defaultSelectedValue?: string;
  onSelectChange?: (value: any) => void;
  selectMultiple?: boolean;
  options?: any;
  showToolTip?: any;
}

export interface CustomTextFieldErrorProps {
  controllerName: string;
  errorMessage: any;
}

export interface ToggleSwitchProps {
  isChecked: boolean;
  handleChecked: (value: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export interface Field {
  controllerName: string;
  label: string;
  isDisabled?: boolean;
  isRequired?: boolean;
  shouldShowHeading?: boolean;
  headingText?: string;
  icon?: any;
  textFieldType?: string;
}
export interface PopOverComponentInterface {
  children: React.ReactNode;
  open: boolean;
  anchorEL: any;
  handleTogglePopOver: (anchor: any) => void;
  key?: any;
}

export interface SettingListItemsInterface {
  name: string;
  email?: string;
  icon: IconType;
  action: (() => void) | null;
  divider?: boolean;
}

export interface IconStyleInterface {
  height: number;
  width: number;
  marginBottom: number;
}

export interface PageNotFoundProps {
  pageNotFoundText: string;
}

export interface FileBrowserButtonProps {
  textTitle: string;
  clickEvent: any;
  inputRef: MutableRefObject<HTMLInputElement>;
  enabled: boolean;
  isloading: boolean;
  fileType: string;
  setFile: (value: File) => void;
}

export interface ConfirmationDialogProps {
  isOpen: boolean;
  label: string;
  secondarylabel?: string;
  showLoading?: boolean;
  handleAction: (state: boolean) => void;
}

export interface DisplayNoteProps {
  title: string;
  message: string;
}
