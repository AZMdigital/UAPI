import { Fragment } from "react";
import { useFormContext } from "react-hook-form";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";

import { Status } from "~/config/appConfig";

import { useAppDispatch, useAppSelector } from "~/state/hooks";

import { useGetIsUserExists } from "~/rest/apiHooks/user/useUser";

import { AdminInfoFormInputs } from "~/modules/subAccountManagement/interfaces/subAccount.interface";
import { getAdminInfoFields } from "~/modules/subAccountManagement/utils/helper";
import { labels } from "~/modules/users/utils/labels";

import CheckboxComponent from "~/core/components/FormComponents/CheckboxComponent";
import DropDownController from "~/core/components/FormComponents/DropDownComponent";
import FormTextFieldController from "~/core/components/FormComponents/FormTextField";
import SearchTextFieldComponent from "~/core/components/FormComponents/SearchTextFieldComponent";
import { MenuItemStyle } from "~/core/components/style";
import {
  setUserEmailValidity,
  setUserNameValidity,
} from "~/core/state/userSlice";
import { Field, FieldTypes, isEditFormMode } from "~/core/utils/helper";

export const SubAccountForm = () => {
  const dispatch = useAppDispatch();
  const { getValues } = useFormContext();
  const fields = getAdminInfoFields(getValues() as AdminInfoFormInputs);
  const formMode = useAppSelector((state) => state.core.formMode);
  const isEditMode = isEditFormMode(
    useAppSelector((state) => state.core.formMode)
  );

  const { mutateAsync: getAllUserNames, isLoading } = useGetIsUserExists();
  const { mutateAsync: getAllUserEmails, isLoading: isUserEmailLoading } =
    useGetIsUserExists();

  const searchUserName = async (name: string): Promise<boolean> => {
    try {
      const nameStr = name.replace(/\s/g, "");
      const resultUserName = await getAllUserNames({ query: nameStr });
      if (resultUserName) {
        dispatch(setUserNameValidity(!resultUserName.exist));
        return !resultUserName.exist;
      } else {
        dispatch(setUserNameValidity(false));
        return false;
      }
    } catch (error) {
      dispatch(setUserNameValidity(false));
      return false;
    }
  };

  const searchUserEmail = async (name: string): Promise<boolean> => {
    try {
      const nameStr = name.replace(/\s/g, "");
      const resultUserEmail = await getAllUserEmails({ query: nameStr });
      if (resultUserEmail) {
        dispatch(setUserEmailValidity(!resultUserEmail.exist));
        return !resultUserEmail.exist;
      } else {
        dispatch(setUserEmailValidity(false));
        return false;
      }
    } catch (error) {
      dispatch(setUserEmailValidity(false));
      return false;
    }
  };

  const renderFormComponent = (field: Field) => {
    const { controllerName, label, type, textFieldType } = field;

    switch (type) {
      case FieldTypes.TEXT:
        return controllerName === "user.username" ||
          controllerName === "user.email" ? (
          <SearchTextFieldComponent
            key={controllerName}
            controllerName={controllerName}
            label={label}
            isDisabled={formMode === "edit" || formMode === "view"}
            errorMessage={
              controllerName === "user.username"
                ? labels.userExists
                : labels.userEmailExists
            }
            isRequired
            showHeading
            isLoading={
              controllerName === "user.username"
                ? isLoading
                : isUserEmailLoading
            }
            headingText={label}
            searchName={
              controllerName === "user.username"
                ? searchUserName
                : searchUserEmail
            }
          />
        ) : (
          <FormTextFieldController
            key={controllerName}
            controllerName={controllerName}
            label={label}
            isDisabled={formMode === "view"}
            errorMessage={`${label}is missing`}
            textFieldType={textFieldType}
            isRequired
            showHeading
            headingText={label}
          />
        );
      case FieldTypes.NUMBER:
        return (
          <FormTextFieldController
            key={controllerName}
            controllerName={controllerName}
            label={label}
            textFieldType={type}
            isDisabled={formMode === "view"}
            errorMessage={`${label}is missing`}
            isRequired
            showHeading
            headingText={label}
          />
        );

      default:
        if (controllerName === "isActive") {
          return (
            <DropDownController
              key={controllerName}
              controllerName={controllerName}
              label={label}
              isRequired
              disabled={formMode === "view"}
            >
              <MenuItem value={Status.ACTIVE} sx={MenuItemStyle}>
                {labels.active}
              </MenuItem>
              <MenuItem value={Status.IN_ACTIVE} sx={MenuItemStyle}>
                {labels.inActive}
              </MenuItem>
            </DropDownController>
          );
        } else if (controllerName === "useMainAccountBundles") {
          return (
            <Box paddingTop={3.5}>
              <CheckboxComponent
                controllerName={controllerName}
                label={label}
                disabled={formMode === "view" || formMode === "edit"}
              />
            </Box>
          );
        }
    }
  };

  return (
    <FormControl>
      <Grid
        item
        container
        xs={12}
        rowSpacing={4}
        columnGap={8}
        direction="row"
        paddingTop={6}
        justifyContent="center"
      >
        {fields.map((field, index) => {
          return (
            <Fragment key={field.controllerName}>
              <Grid
                key={field.controllerName}
                item
                sm={5}
                xs={10}
                direction="column"
              >
                {isEditMode
                  ? field.controllerName !== "user.password" &&
                    field.controllerName !== "user.confirmPassword" &&
                    renderFormComponent(field)
                  : field.controllerName !== "user.isActive" &&
                    renderFormComponent(field)}
              </Grid>
              {index === fields.length - 1 && (
                <Grid item sm={5} xs={10} container direction="column">
                  <Box width={1} />
                </Grid>
              )}
            </Fragment>
          );
        })}
      </Grid>
    </FormControl>
  );
};
